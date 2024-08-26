import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    console.log("Inicio de POST request");

    // Ensure the destructuring of the request body is correctly handled.
    const requestBody = await req.json();
    const { productIds, checkoutData } = requestBody;
    console.log("Datos de entrada:", { productIds, checkoutData });

    if (!productIds || productIds.length === 0) {
      console.error("Faltan IDs de productos");
      return new NextResponse("Ids de productos son obligatorios", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (
      !checkoutData ||
      !checkoutData.name ||
      !checkoutData.lastName ||
      !checkoutData.phone
    ) {
      console.error("Faltan datos de checkout");
      return new NextResponse("Datos de checkout son obligatorios", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    console.log("Productos encontrados:", products);

    if (products.length !== productIds.length) {
      console.error("Uno o más productos no existen");
      return new NextResponse("Uno o más productos no existen", {
        status: 400,
        headers: corsHeaders,
      });
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
    console.log("Pedido creado:", order);

    const response = await fetch(`${process.env.FRONTEND_STORE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order, line_items }),
    });

    console.log("Respuesta del fetch recibida:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la respuesta del checkout:", errorText);
      return new NextResponse("Ocurrió un error durante el checkout", {
        status: 500,
        headers: corsHeaders,
      });
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      try {
        const responseData = await response.json();
        console.log("Respuesta del checkout:", responseData);
        return NextResponse.json(responseData, {
          status: 200,
          headers: corsHeaders,
        });
      } catch (parseError) {
        console.error("Error al parsear la respuesta del checkout:", parseError);
        return new NextResponse("Ocurrió un error durante el checkout", {
          status: 500,
          headers: corsHeaders,
        });
      }
    } else {
      console.error("La respuesta no tiene el Content-Type adecuado");
      return new NextResponse("Ocurrió un error durante el checkout", {
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error("Error durante el checkout:", error);
    return new NextResponse("Ocurrió un error durante el checkout", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
