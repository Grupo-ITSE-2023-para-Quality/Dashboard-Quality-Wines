import { NextRequest, NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  const storeId = params.storeId;
  const { name, lastName, phone, email, cartItems } = await req.json();

  // Validar si el carrito está vacío
  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
  }

  try {
    // Crear el pedido en la base de datos
    const order = await prismadb.order.create({
      data: {
        storeId,
        name,
        lastName,
        phone,
        email,
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
          })),
        },
      },
    });

    // Responder con éxito
    const response = NextResponse.json(order, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', `${process.env.FRONTEND_STORE_URL}`);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;

  } catch (error) {
    console.error('Error al crear el pedido:', error);
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
  }
}

// Manejo de las solicitudes OPTIONS para CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': `${process.env.FRONTEND_STORE_URL}`,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
