import { User } from "./user";

export interface IProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    image?: string;
    bio?: string;
    role: string;
    phoneNumber: string;
    photos?: Photo[];
}

export class Profile implements IProfile {
    constructor(user: User) {
        this.id = user.id;
        this.username = user.userName;
        this.email = user.email;
        this.displayName = user.displayName;
        this.image = user.image;
        this.bio = user.bio;
        this.role = user.role;
        this.phoneNumber = user.phoneNumber;
    }

    username: string;
    email: string;
    displayName: string;
    image?: string;
    bio?: string;
    role: string;
    phoneNumber: string;
    id: string = "";
    photos?: Photo[] = [];
}
export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}
