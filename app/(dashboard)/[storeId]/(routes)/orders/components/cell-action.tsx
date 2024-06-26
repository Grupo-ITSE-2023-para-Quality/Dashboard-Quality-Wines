"use client";

import axios from "axios";
import { Cell } from "@tanstack/react-table";
import { OrderColumn } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionsProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionsProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id de order copiado en el portapapeles");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
      router.refresh();
      toast.success("Pedido eliminado");
    } catch (error) {
      toast.error("Algo salió mal, por favor intenta de nuevo.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, { status: newStatus });
      router.refresh();
      toast.success("Estado actualizado");
    } catch (error) {
      toast.error("Algo salió mal, por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const onPaidChange = async (newIsPaid: boolean) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, {
        status: data.status, // Asegúrate de incluir el status actual o adecuado
        isPaid: newIsPaid,
      });
      router.refresh();
      toast.success("Estado de pago actualizado");
    } catch (error: any) {
      toast.error("Algo salió mal, por favor intenta de nuevo.");
      console.error("[PATCH Error]", error.response.data); // Loguea el error para debugging
    } finally {
      setLoading(false);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Aceptado")}>
            Aceptar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Rechazado")}>
            Rechazar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Finalizado")}>
            Finalizar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPaidChange(!data.isPaid)}>
            {data.isPaid ? "Marcar como no pagado" : "Marcar como pagado"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
