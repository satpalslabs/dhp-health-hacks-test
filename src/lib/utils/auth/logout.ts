import { deleteUserTokens } from "./save-tokens";

export async function logOut() {
    return await deleteUserTokens()
}
