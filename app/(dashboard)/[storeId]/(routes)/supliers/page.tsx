import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SuplierClient } from "./components/client";
import { SuplierColumn } from "./components/columns";

const SupliersPage = async ({ params }: {params: {storeId: string}}) => {
    const supliers = await prismadb.suplier.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            empresa: "desc"
        },
    });

    const formattedSupliers: SuplierColumn[] = supliers.map((item) => ({
        id: item.id,
        empresa: item.empresa,
        localidad: item.localidad,
        telefono: item.telefono,
        email: item.email  || "", 
        comentario: item.comentario || "",
        createdAt: format(item.createdAt, "dd-MM-yyyy"),
    }));

    return (
        <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SuplierClient data={formattedSupliers} />
        </div>
        </div>
    );
};

export default SupliersPage;