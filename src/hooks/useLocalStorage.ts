"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe localStorage state.
 *
 * Uses `useSyncExternalStore` so the server/first-client render always returns
 * `initialValue` (no hydration mismatch), then reconciles to the persisted
 * value after mount. Reads are cached per key so snapshots keep a stable
 * reference — required to avoid an infinite render loop.
 *
 * Note: pass a stable `initialValue` (e.g. a module-level constant) so the
 * server snapshot reference doesn't change between renders.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);

  // Cross-tab updates.
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) {
      cache.delete(key);
      emit(key);
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set!.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readValue<T>(key: string, initialValue: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return initialValue;
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }

  let value: T;
  try {
    value = raw !== null ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    value = initialValue;
  }

  cache.set(key, { raw, value });
  return value;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const value = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(key, listener), [key]),
    useCallback(() => readValue(key, initialValue), [key, initialValue]),
    useCallback(() => initialValue, [initialValue])
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readValue(key, initialValue);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        const raw = JSON.stringify(resolved);
        window.localStorage.setItem(key, raw);
        cache.set(key, { raw, value: resolved });
      } catch (e) {
        console.error(e);
      }
      emit(key);
    },
    [key, initialValue]
  );

  return [value, setValue] as const;
}

export default useLocalStorage;
