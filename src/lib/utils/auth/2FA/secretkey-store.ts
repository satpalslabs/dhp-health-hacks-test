if (!globalThis.secretKeyStore) {
  globalThis.secretKeyStore = new Map<string, string>();
}

const secretKeyStore = globalThis.secretKeyStore as Map<string, string>;

export default secretKeyStore;