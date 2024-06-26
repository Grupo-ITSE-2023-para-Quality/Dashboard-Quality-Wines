// route.ts
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { productIds, checkoutData } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Ids de productos son obligatorios", { status: 400, headers: corsHeaders });
    }

    if (!checkoutData || !checkoutData.name || !checkoutData.lastName || !checkoutData.phone) {
      return new NextResponse("Datos de checkout son obligatorios", { status: 400, headers: corsHeaders });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      return new NextResponse("Uno o más productos no existen", { status: 400, headers: corsHeaders });
    }

    const line_items: Array<{
      quantity: number;
      price_data: {
        currency: string;
        product_data: any;
        unit_amount: number;
      };
    }> = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "ARS",
          unit_amount: product.price.toNumber() * 100,
          product_data: {
            name: product.name,
          },
        },
      });
    });

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        name: checkoutData.name,
        lastName: checkoutData.lastName,
        phone: checkoutData.phone,
        email: checkoutData.email || "", // Manejar caso de email opcional
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    const response = await fetch(`${process.env.FRONTEND_STORE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order, line_items }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta del checkout:', errorText);
      return new NextResponse('Ocurrió un error durante el checkout', { status: 500, headers: corsHeaders });
    }

    try {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 200, headers: corsHeaders });
    } catch (parseError) {
      const responseText = await response.text();
      console.error('Error al parsear la respuesta del checkout:', responseText);
      return new NextResponse('Ocurrió un error durante el checkout', { status: 500, headers: corsHeaders });
    }

  } catch (error) {
    console.error('Error durante el checkout:', error);
    return new NextResponse('Ocurrió un error durante el checkout', { status: 500, headers: corsHeaders });
  }
}
