"use server"

if (!globalThis.secretKey) {
    console.log("initialize secret key ");

    globalThis.secretKey = {
        key: ""
    }
}

const secretKey: { key: string } = globalThis.secretKey;

export default secretKey;