
if (!globalThis.secretKey) {
    globalThis.secretKey = {
        key: ""
    }
}

const secretKey: { key: string } = globalThis.secretKey;

export default secretKey;