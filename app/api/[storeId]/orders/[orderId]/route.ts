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

        const { status, isPaid } = body;

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

        // Crear un objeto de datos dinámicamente basado en los valores recibidos
        const dataToUpdate: { status?: string; isPaid?: boolean } = {};

        if (status) {
            dataToUpdate.status = status;
        }

        if (typeof isPaid !== 'undefined') {
            dataToUpdate.isPaid = isPaid;
        }

        // Verificar que haya al menos un dato para actualizar
        if (Object.keys(dataToUpdate).length === 0) {
            return new NextResponse("Faltan datos para actualizar", { status: 400 });
        }

        // Actualizar el pedido
        const order = await prismadb.order.updateMany({
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