import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// Manejo de CORS
function corsMiddleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.json(null, {
      headers: {
        "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", `${process.env.FRONTEND_STORE_URL}`);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Combinar CORS y autenticación
export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  async afterAuth(auth, request) {
    return corsMiddleware(request);
  },
});

export const config = {
  matcher: ["/api/:path*"], // Middleware aplicado solo en rutas de API
};
