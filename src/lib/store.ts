// Data-access seam for the app.
//
// Today every collection is backed by localStorage through the context
// providers (src/context/*) + the useLocalStorage hook. The `Repository<T>`
// shape below documents the contract a backend needs to satisfy. To move a
// collection to a real API/DB later, implement this same shape with fetch()
// calls to a route handler (see src/app/api/weather/route.ts for the pattern)
// and swap it into the matching provider — no UI component changes required.

export interface Identifiable {
  id: string;
}

export interface Repository<T extends Identifiable> {
  list(): T[];
  create(item: T): void;
  update(id: string, patch: Partial<T>): void;
  remove(id: string): void;
  setAll(items: T[]): void;
}

// Pure array transforms shared by the localStorage-backed providers.
export const collection = {
  create<T extends Identifiable>(items: T[], item: T): T[] {
    return [...items, item];
  },
  update<T extends Identifiable>(
    items: T[],
    id: string,
    patch: Partial<T>
  ): T[] {
    return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
  },
  remove<T extends Identifiable>(items: T[], id: string): T[] {
    return items.filter((item) => item.id !== id);
  },
};
