import secretKeyStore from './secretkey-store';

export async function setSecretKey(email: string, secretKey: string) {
    secretKeyStore.set(email, secretKey);
    console.log(secretKeyStore);
}
export async function deleteSecretKey(email: string,) {
    secretKeyStore.delete(email);
    console.log(secretKeyStore);
}
