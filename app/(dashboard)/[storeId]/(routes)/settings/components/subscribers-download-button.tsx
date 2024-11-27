"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface Props {
  storeId: string;
}

const SubscribersDownloadButton: React.FC<Props> = ({ storeId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${storeId}/subscribers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agrega autenticación si es necesario
        },
      });
      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.statusText}`);
      }
      
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'subscribers.txt';
      link.click();
    } catch (error) {
      console.error('Error downloading subscribers:', error);
      alert('No se pudo descargar la lista de suscriptores. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <Button onClick={handleDownload} disabled={isLoading}>
      {isLoading ? 'Descargando...' : 'Descargar suscriptores'}
    </Button>
  );
};

export default SubscribersDownloadButton;