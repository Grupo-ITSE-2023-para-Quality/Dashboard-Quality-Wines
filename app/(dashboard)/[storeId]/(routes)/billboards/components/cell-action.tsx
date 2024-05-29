"use client";

import axios from "axios";
import { Cell } from "@tanstack/react-table";
import { BillboardColumn } from "./columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter,  } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionsProps {
  data: BillboardColumn;
}

export const CellAction: React.FC<CellActionsProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); 
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id de promoción copiado en el portapapeles");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${data.id}`
      );
      router.refresh();
      toast.success("Promoción eliminada");
    } catch (error) {
      toast.error(
        "Elimine primero todas las categorias usadas en esta promoción"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
   < AlertModal 
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only"> Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar Id
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/${params.storeId}/billboards/${data.id}`)
          }
        >
          <Edit className="mr-2 h-4 w-4" />
          Actualizar
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
