import { NextResponse } from 'next/server';

export function middleware(req: any) {
    const token = req.cookies.get('token')?.value;  // Check the cookie for the token
    // If no token, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }else{
        // If token exists, proceed to the next step
        return NextResponse.next();
    }
}
// Apply middleware to specific routes (e.g., /admin and /screen2)
export const config = {
    matcher: ['/adminpanel', '/screen2'],
};
