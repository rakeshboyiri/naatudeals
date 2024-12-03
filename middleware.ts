import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('admin_token')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isRegisterPage = request.nextUrl.pathname === '/admin/register'

  if (isAdminPage && !isLoggedIn && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if ((isLoginPage || isRegisterPage) && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

