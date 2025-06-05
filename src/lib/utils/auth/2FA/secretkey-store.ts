if (!globalThis.secretKeyStore) {
  globalThis.secretKeyStore = new Map<string, string>();
}

export const secretKeyStore = globalThis.secretKeyStore as Map<string, string>;