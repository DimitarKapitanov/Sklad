export interface User {
    userName: string;
    displayName: string;
    token: string;
    image?: string;
    email: string;
    roles: string[];
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
}