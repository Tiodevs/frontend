import { getCookie } from "cookies-next";

export function getCookiesClient(){
    const token = getCookie("session")

    return token 
}