export interface DecodedToken {
    nameid: string;
    unique_name: string;
    email: string;
    nbf: number;
    exp: number;
    iat: number;
}