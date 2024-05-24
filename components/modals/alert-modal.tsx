"use cliente";

import { useEffect, useState } from "react";
import { Modal } from "@components/ui/modal";
import { Button } from "@components/ui/butto    n";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({ 
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted){
        return null;
    }

    return (
        <Modal
        tittle="Esta Seguro?"
        description="Esta acción es incorrecta"
        isOpen={isOpen}
        onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button disabled={loading} variant="outline" onClick={onClose}>
               Cancel   
              </Button>
              <Button disabled={loading} variant="destructive" onClick={onConfirm}>

              </Button>
            </div>

        </Modal>
    );

};