export interface User {
    id: string;
    userName: string;
    displayName: string;
    token: string;
    image?: string;
    email: string;
    roles: string[];
    bio: string;
    phoneNumber: string;
}

export interface UserInfo {
    id: string;
    displayName: string;
    userName: string;
    image?: string;
    role: string;
    phoneNumber: string;
    bio: string;
    email: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
}

export interface NewUserFormValues {
    email: string;
    password: string;
    displayName: string;
    userName: string;
    role: string;
    bio?: string;
    phoneNumber?: string;
}

export interface UserUpdateFormValues {
    displayName: string;
    password: string;
    role: string;
    phoneNumber: string;
    bio: string;
    email: string;
}