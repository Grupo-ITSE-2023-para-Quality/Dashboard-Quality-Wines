import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        if (!params.orderId) {
            return new NextResponse("Id de order es necesario", { status: 400 });
        }

        const order = await prismadb.order.findUnique({
            where: {
                id: params.orderId,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
  
      if (!userId) {
        return new NextResponse("No Autenticado", { status: 401 });
      }
  
      if (!params.orderId) {
        return new NextResponse("El id de order es necesario", { status: 400 });
      }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId,
        },
      });
  
      if (!storeByUserId) {
        return new NextResponse("Sin autorización", { status: 403 });
      }
  
      const dataToUpdate: { status?: string; isPaid?: boolean } = {};
  
      if (body.status) {
        dataToUpdate.status = body.status;
  
        if (body.status === "Cancelado") {
          const orderItems = await prismadb.orderItem.findMany({
            where: {
              orderId: params.orderId,
            },
          });
  
          for (const orderItem of orderItems) {
            // Actualizar el stock del producto
            const product = await prismadb.product.update({
              where: {
                id: orderItem.productId,
              },
              data: {
                stock: {
                  increment: orderItem.quantity, // Aumentamos el stock del producto
                },
                isArchived: {
                  set: false, // Cambiamos isArchived a false si el stock es mayor a 0
                },
              },
            });
  
            // Si el stock después de incrementar es mayor a 0, aseguramos que isArchived sea false
            if (product.stock > 0) {
              await prismadb.product.update({
                where: {
                  id: product.id,
                },
                data: {
                  isArchived: false,
                },
              });
            }
          }
        }
      }
  
      if (Object.keys(dataToUpdate).length === 0) {
        return new NextResponse("Faltan datos para actualizar", { status: 400 });
      }
  
      const order = await prismadb.order.update({
        where: {
          id: params.orderId,
        },
        data: dataToUpdate,
      });
  
      return NextResponse.json(order);
    } catch (error) {
      console.log("[ORDER_PATCH]", error);
      return new NextResponse("Error interno", { status: 500 });
    }
  }

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("No Autenticado", { status: 401 });
        }

        if (!params.orderId) {
            return new NextResponse("Id de order necesario", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        // Verificar si el pedido pertenece al usuario
        if (!storeByUserId) {
            return new NextResponse("Sin autorización", { status: 403 });
        }

        // Antes de eliminar el pedido, elimina los OrderItems asociados
        await prismadb.orderItem.deleteMany({
            where: {
                orderId: params.orderId,
            },
        });

        // Luego elimina el pedido
        const order = await prismadb.order.delete({
            where: {
                id: params.orderId,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[ORDER_DELETE]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}