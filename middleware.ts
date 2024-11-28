import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from "@clerk/nextjs/server";

function corsMiddleware(request: NextRequest) {
  // Manejar solicitudes OPTIONS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_STORE_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Agregar encabezados CORS a todas las respuestas
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_STORE_URL || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  afterAuth(auth, req) {
    // Aplicar CORS middleware
    return corsMiddleware(req);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};