import prismadb from "@/lib/prismadb";
import { SuplierForm } from "./components/suplier-form";

const SuplierPage = async ({
    params,
}: {
    params: { suplierId: string; storeId: string };
}) => {
    const suplier = await prismadb.suplier.findUnique({
        where: {
            id: params.suplierId
    },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SuplierForm initialData={suplier}/>
            </div>
        </div>
    );
}

export default SuplierPage;