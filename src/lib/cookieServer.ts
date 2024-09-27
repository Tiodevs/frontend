import { cookies } from "next/headers";

export function getCookiesServer(){
    const token = cookies().get("session")?.value
    
    // console.log("getfunctioncookie: ", token)
    
    return token || null
}