import { UserID } from "./types/type";

export function AmINotLoggedIn(): boolean {
    return localStorage.getItem("access_token") === null
}

export function GetMyIDUser(): UserID {
    return localStorage.getItem("iduser") || "";
}