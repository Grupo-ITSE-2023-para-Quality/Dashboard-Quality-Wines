"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings, ChevronDown, X } from "lucide-react"; // Import ChevronDown and X icons
import { useParams, usePathname } from "next/navigation";
import React, { useState } from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Estadísticas",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Secciones",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categorías",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Presentaciones",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/flavors`,
      label: "Variedades",
      active: pathname === `/${params.storeId}/flavors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Productos",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/supliers`,
      label: "Proveedores",
      active: pathname === `/${params.storeId}/supliers`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Pedidos",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Configuración",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center justify-between lg:space-x-6", className)}>
      <div className="hidden lg:flex space-x-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-gray-600"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <ChevronDown size={24} />} {/* Changed to ChevronDown */}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg lg:hidden">
          <div className="flex flex-col space-y-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)} // Close menu on link click
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}