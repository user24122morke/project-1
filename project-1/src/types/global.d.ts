// src/types/global.d.ts
export {};

declare global {
  var adminConnections: Map<string, ReadableStreamDefaultController<Uint8Array>>;
}
