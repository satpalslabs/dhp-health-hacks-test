type User = {
    email: string;
    displayName: string;
    role: string;
};

type SignInResponse = {
    token: string;
    email: string;
    refreshToken: string;
    displayName?: string;
    role?: string;
}

export type { SignInResponse, User }