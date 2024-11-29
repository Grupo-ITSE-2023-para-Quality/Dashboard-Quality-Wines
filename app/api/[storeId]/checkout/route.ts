import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const storeId = params.storeId;
  const { name, lastName, phone, email, cartItems } = await req.json();

  // Validar si el carrito está vacío
  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json(
      { error: "El carrito está vacío" },
      { status: 400 }
    );
  }

  // Iniciar una transacción
  const transaction = await prismadb.$transaction(async (prisma) => {
    const updates = cartItems.map(async (item: any) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      // Verificar si hay suficiente stock
      if (product.stock < item.quantity) {
        throw new Error(
          `No hay suficiente stock para el producto ${item.productId}`
        );
      }

      // Calcular el nuevo stock
      const newStock = product.stock - item.quantity;

      // Actualizar el producto en la base de datos
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: newStock,
          inStock: newStock > 0,
          isArchived: newStock === 0, 
        },
      });
    });

    // Esperar a que todas las actualizaciones de stock se completen
    await Promise.all(updates);

    // Crear el pedido en la base de datos
    const order = await prisma.order.create({
      data: {
        storeId,
        name,
        lastName,
        phone,
        email,
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity, // Cantidad del producto
            price: item.price, // Precio del producto
          })),
        },
      },
    });

    return order; // Retornar el pedido creado
  });

  try {
    // Código de la transacción
    const response = NextResponse.json(transaction, { status: 201 });
    response.headers.set(
      "Access-Control-Allow-Origin",
      `${process.env.FRONTEND_STORE_URL}`
    );
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error al crear el pedido:", error);

    // Verificar si el error es una instancia de Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Manejo de errores desconocidos
      return NextResponse.json(
        { error: "Error al crear el pedido" },
        { status: 500 }
      );
    }
  }
}
// Manejo de las solicitudes OPTIONS para CORS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": `${process.env.FRONTEND_STORE_URL}`,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
