"use client";
import axios from "axios";
import { SuplierColumn } from "./columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash, MessageCircle } from "lucide-react"; // Importa el icono de MessageCircle
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionsProps {
    data: SuplierColumn;
}

export const CellAction: React.FC<CellActionsProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopyEmail = (email?: string) => {
        if (email) {
            navigator.clipboard.writeText(email);
            toast.success("Email del proveedor copiado en el portapapeles");
        } else {
            toast.error("Email no disponible");
        }
    };

    const onSendWhatsApp = (telefono?: string) => {
        if (telefono) {
            const whatsappUrl = `https://wa.me/+54${telefono}`;
            window.open(whatsappUrl, "_blank");
        } else {
            toast.error("Número de teléfono no disponible");
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/supliers/${data.id}`);
            router.refresh();
            toast.success("Proveedor eliminado");
        } catch (error) {
            toast.error("Elimine primero todas los productos del proveedor");
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only"> Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopyEmail(data.email)}>
                        Copiar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendWhatsApp(data.telefono)}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Enviar WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`/${params.storeId}/supliers/${data.id}`)
                        }
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
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