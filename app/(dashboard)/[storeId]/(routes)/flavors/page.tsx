import { format } from "date-fns";

import { FlavorsClient } from "./components/client";
import { FlavorColumn } from "./components/columns";

import prismadb from "@/lib/prismadb";

const FlavorPage = async ({ params }: { params: { storeId: string } }) => {
    const flavors = await prismadb.flavor.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedFlavors: FlavorColumn[] = flavors.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "dd-MM-yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <FlavorsClient data={formattedFlavors} />
            </div>
        </div>
    );
};

export default FlavorPage;
