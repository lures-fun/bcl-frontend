import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('au')?.value;
  const { pathname } = request.nextUrl;

  const isRootPath = pathname === '/';

  if (token) {
    if (isRootPath) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  } else {
    if (isRootPath) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  // api、_next、static、favicon.ico で始まるパスを除外しないとエラーが出る
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
