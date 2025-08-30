import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function will be called for every request that matches the `matcher` config below.
export function middleware(req: NextRequest) {
  // 1. Get the username and password from your environment variables.
  const basicAuthUser = process.env.AUTH_USER
  const basicAuthPass = process.env.AUTH_PASS

  // 2. Check if the Authorization header is present.
  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const authValue = authHeader.split(' ')[1]
    // The header value is Base64 encoded. We need to decode it.
    const [user, pass] = atob(authValue).split(':')

    // 3. Compare the provided credentials with the correct ones.
    if (user === basicAuthUser && pass === basicAuthPass) {
      // If they match, allow the request to continue.
      return NextResponse.next()
    }
  }

  // 4. If credentials are missing or incorrect, send a 401 response.
  // This is what triggers the browser's native login pop-up.
  const response = new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
  
  return response
}

// This config specifies which pages the middleware should protect.
export const config = {
  // This regex matches all routes except for API routes, Next.js static files, images, and the favicon.
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
