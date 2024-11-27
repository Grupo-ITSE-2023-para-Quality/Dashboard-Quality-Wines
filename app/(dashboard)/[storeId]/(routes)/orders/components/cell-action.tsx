"use client";

import axios from "axios";
import { OrderColumn } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash, MessageCircle } from "lucide-react";
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

  const onSendWhatsApp = (phone: string) => {
    // Genera la URL de WhatsApp usando el número de teléfono
    const whatsappUrl = `https://wa.me/+54${phone}`;
    window.open(whatsappUrl, "_blank");
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
  
      // Actualizamos el estado del pedido
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, {
        status: newStatus,
      });
  
      router.refresh();
      toast.success("Estado actualizado");
    } catch (error) {
      // Verificamos si error es un objeto y tiene la propiedad response
      if (axios.isAxiosError(error)) {
        // Si es un error de Axios, podemos acceder a error.response
        const errorMessage = error.response?.data || "Algo salió mal, por favor intenta de nuevo.";
        toast.error(errorMessage);
        console.error("[Error en onStatusChange]", errorMessage);
      } else {
        // Si no es un error de Axios, manejamos el error genérico
        toast.error("Algo salió mal, por favor intenta de nuevo.");
        console.error("[Error en onStatusChange]", error);
      }    
    } finally {
      setLoading(false);
    }
  };
  
  const onPaidChange = async (newIsPaid: boolean) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, {
        status: data.status,
        isPaid: newIsPaid,
      });
      router.refresh();
      toast.success("Estado de pago actualizado");
    } catch (error: any) {
      toast.error("Algo salió mal, por favor intenta de nuevo.");
      console.error("[PATCH Error]", error.response.data);
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
          <DropdownMenuItem onClick={() => onStatusChange("En preparación")}>
            Preparar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Entregado")}>
            Entregar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange("Cancelado")}>
            Cancelar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPaidChange(!data.isPaid)}>
            {data.isPaid ? "Marcar como no pagado" : "Marcar como pagado"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copiar ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSendWhatsApp(data.phone)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Enviar WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
