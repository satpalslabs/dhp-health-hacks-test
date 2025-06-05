type User = {
    email: string;
    displayName: string;
    role: string;
    is2fa_enabled?: boolean;

};

type SignInResponse = {
    token: string;
    email: string;
    refreshToken: string;
    displayName?: string;
    role?: string;
    is2fa_enabled?: boolean;
    secretKey?: string
    environment: string;
    step: number
}

export type { SignInResponse, User }