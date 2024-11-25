import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { suplierid: string } }
) {
    try {
        if(!params.suplierid) {
            return new NextResponse("Id de proveedor no proporcionado", { status: 400 });
        }

        const suplier = await prismadb.suplier.findUnique({
            where: {
                id: params.suplierid,
            },
        });

        if(!suplier) {
            return new NextResponse("Proveedor no encontrado", { status: 404 });
        }

        return NextResponse.json(suplier);
    }catch(error) {
        console.log("[PROVIDER_GET]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string; suplierId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { empresa, localidad, telefono, email, comentario } = body; // Asegúrate de incluir `comentario`

        if (!userId) {
            return new NextResponse("No autenticado", { status: 401 });
        }

        if (!empresa) {
            return new NextResponse("Se requiere ingresar la empresa", { status: 400 });
        }

        if (!localidad) {
            return new NextResponse("La localidad es obligatoria", { status: 400 });
        }

        if (!telefono) {
            return new NextResponse("El telefono es obligatorio", { status: 400 });
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

        const suplier = await prismadb.suplier.update({
            where: {
                id: params.suplierId,
            },
            data: {
                empresa,
                localidad,
                telefono,
                email, // El email puede ser undefined
                comentario, // Asegúrate de que el comentario se esté actualizando
            },
        });

        return NextResponse.json(suplier);
    } catch (error) {
        console.log("[PROVIDER_PATCH]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; suplierId: string } },
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("No autenticado", { status: 401 });
        }

        if(!params.suplierId) {
            return new NextResponse("El Id del proveedor es necesario", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if(!storeByUserId) {
            return new NextResponse("Sin autorización", { status: 403 });
        }

        // Aquí se elimina el proveedor
        await prismadb.suplier.delete({
            where: {
                id: params.suplierId,
            },
        });

        // Respuesta indicando que se ha eliminado correctamente
        return NextResponse.json({ message: "Proveedor eliminado correctamente" });
    } catch(error) {
        console.log("[PROVIDER_DELETE]", error);
        return new NextResponse("Error interno", { status: 500 });
    }
}