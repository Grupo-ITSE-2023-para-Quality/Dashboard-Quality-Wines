import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

const allowedOrigins = `${process.env.FRONTEND_STORE_URL}`;

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  const origin = req.headers.get('origin');
  
  // Inicializa los headers con CORS permitido si el origen es válido
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  try {
    if (!allowedOrigins.includes(origin!)) {
      return new NextResponse("No autorizado por CORS", { status: 403, headers });
    }

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("El email es obligatorio", { status: 400, headers });
    }

    if (!params.storeId) {
      return new NextResponse("Id de tienda es obligatorio", { status: 400, headers });
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    if (!store) {
      return new NextResponse("Tienda no encontrada", { status: 404, headers });
    }

    const existingSubscriber = await prismadb.subscriber.findFirst({
      where: {
        email,
        storeId: params.storeId,
      },
    });

    if (existingSubscriber) {
      return new NextResponse("Este email ya está suscrito", { status: 400, headers });
    }

    const subscriber = await prismadb.subscriber.create({
      data: {
        email,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(subscriber), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.log("[SUBSCRIBERS_POST]", error);
    return new NextResponse("Error interno", { status: 500, headers });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  const origin = req.headers.get('origin');

  // Inicializa los headers
  const headers: HeadersInit = {
    'Content-Type': 'text/plain',
    'Content-Disposition': 'attachment; filename="subscribers.txt"',
  };

  try {
    if (origin && origin !== 'https://qualitywines-admin.vercel.app/api/a45de0f3-c4f7-4ada-b2cd-6ebbbca8eff5' && !allowedOrigins.includes(origin)) {
      return new NextResponse("No autorizado por CORS", { status: 403, headers });
    }

    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Id de tienda es obligatorio", { status: 400, headers });
    }

    // Obtener suscriptores de la base de datos
    const subscribers = await prismadb.subscriber.findMany({
      where: {
        storeId: storeId,
      },
      select: {
        email: true,
      },
    });

    // Manejar el caso en el que no haya suscriptores
    if (subscribers.length === 0) {
      return new NextResponse("", {
        status: 200,
        headers,
      });
    }

    // Generar la lista de emails separados por comas
    const emailList = subscribers.map(sub => sub.email).join(', ');

    return new NextResponse(emailList, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[SUBSCRIBERS_GET]', error);
    return new NextResponse("Error interno", { status: 500, headers });
  }
}


export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
