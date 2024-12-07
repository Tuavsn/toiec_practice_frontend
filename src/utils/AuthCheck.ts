export function IsNotLogIn(): boolean {
    return localStorage.getItem("access_token") === null
}