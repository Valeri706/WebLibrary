import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";
import {UserRole} from "@/types/userRole";

export { default } from 'next-auth/middleware'

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;
    
    if(!token) {
        if(pathname.includes('/api/auth') || pathname === '/auth' || pathname === "/books") {
            return NextResponse.next()
        }
        
        return NextResponse.redirect(new URL('/auth', req.url))
    }
    
    if(pathname === '/auth') {
        return NextResponse.redirect(new URL('/', req.url))
    }
    
    if(pathname.includes('/admin') && token.role != UserRole.admin) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next();
    
}

export const config = {
    matcher: ['/profile/:path*', '/admin/:path*', '/auth'], 
};