"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Nueva variable para las imágenes ya subidas
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Obtener imágenes existentes de Cloudinary
  const loadExistingImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/cloudinary/images");
      setExistingImages(response.data.map((image: any) => image.secure_url));
    } catch (error) {
      console.error("Error al cargar las imágenes existentes", error);
      toast.error("No se pudieron cargar las imágenes existentes.");
    } finally {
      setLoading(false);
    }
  };

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="image" src={url} />
          </div>
        ))}
      </div>
      
      {/* Cargar imágenes existentes
      <Button onClick={loadExistingImages} disabled={loading || disabled}>
        Ver imágenes existentes
      </Button>
 
      <div className="mt-4 grid grid-cols-3 gap-4">
        {existingImages.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden cursor-pointer"
            onClick={() => onChange(url)}
          >
            <Image fill className="object-cover" alt="existing image" src={url} />
          </div>
        ))}
      </div>*/}

      {/* Cargar nueva imagen */}
      <CldUploadWidget onSuccess={onUpload} uploadPreset="jdbw3dhm">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Subir imagen
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
