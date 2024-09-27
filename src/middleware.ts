import { NextRequest, NextResponse } from "next/server";
import { getCookiesServer } from "./lib/cookieServer";
import { api } from "./app/services/api";

export async function middleware(req:NextRequest) {
    const {pathname} = req.nextUrl

    if(pathname.startsWith("/_next") || pathname === "/"){
        return NextResponse.next()
    }

    const token = getCookiesServer()

    // console.log("o toquem que o middleware recebeu: ", token)

    if(pathname.startsWith("/dashboard")){
        if(!token){
            return NextResponse.redirect(new URL("/", req.url))
        }

        const isValid = await validateToken(token)

        if(!isValid){
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    return NextResponse.next()
}

async function validateToken(token:string) {
    if(!token) return false

    try {
        await api.get("/me", {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        return true
    } catch (err) {
        console.log("Erro do tolken: ",err)
        return false
    }
}