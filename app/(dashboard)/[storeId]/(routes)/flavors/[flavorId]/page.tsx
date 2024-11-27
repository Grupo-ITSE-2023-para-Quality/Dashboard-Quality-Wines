import prismadb from "@/lib/prismadb";
import { FlavorForm } from "./components/flavor-form";

const FlavorPage = async ({ params }: { params: { flavorId: string } }) => {
  // Obtener la variedad (flavor) por ID
  const flavor = await prismadb.flavor.findUnique({
    where: {
      id: params.flavorId,
    },
  });

  // Obtener todas las categorías
  const categories = await prismadb.category.findMany();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Pasar tanto la información inicial del flavor como las categorías al formulario */}
        <FlavorForm initialData={flavor} categories={categories} />
      </div>
    </div>
  );
};

export default FlavorPage;
