import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

const protectedRoutes = ["/",
    "/marketplace",
    "/bulletin",
    "/buyleads",
    "/quotes",
    "/create-quote",
    "/agri-doctor",
    "/agri-doctor/query-info",
    "/mybusinesses",
    "/business-listing",
    "/subscription",
    "/authentication/basic",
    "/authentication/complete",
]

export default async function middleware(req: any) {
    let isAuthenticated: boolean = false;
    const jwtToken: string | undefined = req.cookies.get('accessToken');
    // console.log(jwtToken)
    if (jwtToken) {
        const decodedToken: any = jwtDecode(JSON.stringify(jwtToken));

        if (decodedToken?.exp * 1000 > Date.now()) {
            isAuthenticated = true;
        }
    }
    // console.log(isAuthenticated)
    if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {

        const cookies = Cookies.get();
        if (cookies) {
            alert('Cookies are present and will removed...')
            for (const cookie in cookies) {
                Cookies.remove(cookie);
            }
        }
        const absoluteURL = new URL("/authentication/login", req.nextUrl.origin)
        // localStorage.clear();
        return NextResponse.redirect(absoluteURL.toString())
    }
}

