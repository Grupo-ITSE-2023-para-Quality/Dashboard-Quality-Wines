"use client";

import * as z from "zod";
import axios from "axios";
import { Suplier } from "@prisma/client";
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

const formSchema = z.object({
  empresa: z.string().min(1),
  localidad: z.string().min(1),
  telefono: z.string().min(1),
  email: z.string().email().optional(),
  comentario: z.string().optional(),
});

type SuplierFormValues = z.infer<typeof formSchema>;

interface SuplierFormProps {
  initialData: Suplier | null;
}

export const SuplierForm: React.FC<SuplierFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar proveedor" : "Crear proveedor";
  const description = initialData
    ? "Editar la información del proveedor"
    : "Añade un nuevo proveedor";
  const toastMessage = initialData
    ? "Proveedor actualizado"
    : "Proveedor creado";
  const action = initialData ? "Guardar cambios" : "Crear";
  const form = useForm<SuplierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          email: initialData.email || undefined, // Cambia null a undefined
          comentario: initialData.comentario || "", // Asegúrate de que comentario no sea null
        }
      : {
          empresa: "",
          localidad: "",
          telefono: "",
          email: undefined, // Cambia a undefined
          comentario: "",
        },
  });

  const onSubmit = async (data: SuplierFormValues) => {
    try {
      setLoading(true);
      console.log("Store ID:", params.storeId); // Verifica el storeId
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/supliers/${params.suplierId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/supliers`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/supliers`);
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error enviando formulario:", error); // Muestra el error en la consola
      toast.error("Algo salió mal");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/supliers/${params.suplierId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/supliers`);
      toast.success("Proveedor eliminado");
    } catch (error) {
      toast.error("Elimine primero todos los productos del proveedor");
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
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nombre de la empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="localidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localidad</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Localidad"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Número de teléfono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Correo electrónico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comentario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Información adicional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
