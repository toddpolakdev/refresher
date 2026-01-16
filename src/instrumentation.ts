// instrumentation.ts
if (typeof global !== "undefined" && "localStorage" in global) {
  delete (global as any).localStorage;
}
