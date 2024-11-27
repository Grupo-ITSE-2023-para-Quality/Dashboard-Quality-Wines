"use client";

import * as z from "zod";
import axios from "axios";
import { Flavor, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Esquema de validación con categoryId incluido
const formSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1), // Agregamos categoryId para la relación
});

type FlavorFormValues = z.infer<typeof formSchema>;

interface FlavorFormProps {
  initialData: Flavor | null;
  categories: Category[]; // Las categorías que se pueden seleccionar
}

export const FlavorForm: React.FC<FlavorFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar variedad" : "Crear variedad";
  const description = initialData
    ? "Editar el tipo de variedad o sabor del producto"
    : "Añade un nuevo tipo de variedad o sabor al producto";
  const toastMessage = initialData ? "Variedad actualizada" : "Variedad creada";
  const action = initialData ? "Guardar cambios" : "Crear";

  // Configuración del formulario, incluyendo el campo de categoría
  const form = useForm<FlavorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      categoryId: "", // Valor por defecto del campo de categoría
    },
  });

  const onSubmit = async (data: FlavorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/flavors/${params.flavorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/flavors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/flavors`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/flavors/${params.flavorId}`);
      router.refresh();
      router.push(`/${params.storeId}/flavors`);
      toast.success("Variedad eliminada");
    } catch (error) {
      toast.error("Primero elimine todos los productos que usan este tipo de variedad");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de variedad</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nombre"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId" // Relación con la categoría
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Seleccione una categoría"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className-="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
