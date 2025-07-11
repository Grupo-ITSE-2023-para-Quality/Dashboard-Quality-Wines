# Panel de Control para E-commerce - Quality Wines

 Este es un panel de control de administrador (CMS) completo para una tienda online, desarrollado como parte de las Prácticas Profesionalizantes de la Tecnicatura Superior en Desarrollo de Software del ITSE.

El sistema permite gestionar todos los aspectos de la tienda, desde los productos y categorías hasta los pedidos y proveedores, ofreciendo una visión completa del rendimiento del negocio a través de un dashboard de estadísticas.

**Ver demo en vivo:** [**qualitywines-admin.vercel.app**](https://www.google.com/search?q=https://qualitywines-admin.vercel.app)

*(Usuario: `admin`, Contraseña: `demodemo`)*

## ✨ Características Principales

Este panel de control está diseñado para ser una solución integral y escalable para la administración de un e-commerce.

  * **📈 Dashboard de Estadísticas:** Visualiza métricas clave como ganancias totales, ventas y stock de productos en un gráfico interactivo.
  * **🛍️ Gestión de Tiendas Múltiples:** El sistema está preparado para manejar múltiples tiendas desde una sola interfaz.
  * **🗂️ Gestión de Productos:**
      * Creación, edición y eliminación de productos.
      * Campos personalizables como nombre, precio, descripción, stock y stock mínimo.
      * Posibilidad de marcar productos como "Destacados" (para la página principal) o "Archivados" (para ocultarlos de la tienda).
  * **📑 Gestión de Categorías:** Organiza tus productos en diferentes categorías para una mejor navegación en la tienda.
  * **🖼️ Gestión de Secciones (Billboards):** Administra las imágenes y secciones principales que se mostrarán en la tienda, como banners promocionales.
  * **📦 Gestión de Atributos:**
      * **Presentaciones:** Define los tamaños o envases de los productos (ej: 750ml, 1.5L).
      * **Variedades:** Administra los tipos o sabores de los productos (ej: Malbec, Cabernet Sauvignon).
  * **🚚 Gestión de Pedidos:** Visualiza y administra todos los pedidos realizados por los clientes, incluyendo su estado (Pendiente, En preparación, Entregado) y si han sido pagados.
  * **👥 Gestión de Proveedores:** Lleva un registro de tus proveedores con su información de contacto y comentarios.
  * **🔐 Autenticación Segura:** Implementación de un sistema de autenticación completo con Clerk para proteger las rutas y la información sensible.
  * **⚙️ API First Design:** Todas las funcionalidades del panel están expuestas a través de una API RESTful, lo que permite una fácil integración con cualquier frontend de tienda.
  * **📱 Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla para una correcta visualización en dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack de tecnologías modernas y eficientes:

  * **Framework:** [Next.js](https://nextjs.org/)
  * **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
  * **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
  * **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/)
  * **Gestión de Estado:** [Zustand](https://github.com/pmndrs/zustand)
  * **ORM:** [Prisma](https://www.prisma.io/)
  * **Base de Datos:** [PlanetScale](https://planetscale.com/) (MySQL)
  * **Autenticación:** [Clerk](https://clerk.com/)
  * **Subida de Imágenes:** [Cloudinary](https://cloudinary.com/)
  * **Validación de Formularios:** [Zod](https://zod.dev/) y [React Hook Form](https://react-hook-form.com/)
  * **Gráficos:** [Recharts](https://recharts.org/)
  * **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Cómo Empezar

Para correr este proyecto en tu entorno local, sigue estos pasos:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/ProfeCeci/Dashboard-Quality-Wines.git
    cd Dashboard-Quality-Wines
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables. Puedes tomar como base el archivo `.env.example` (si existe) o crearlo desde cero.

    ```env
    # Base de Datos (PlanetScale u otra)
    DATABASE_URL="tu_url_de_base_de_datos"

    # Autenticación con Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clave_publicable_de_clerk
    CLERK_SECRET_KEY=tu_clave_secreta_de_clerk

    # Cloudinary para la subida de imágenes
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu_cloud_name_de_cloudinary"

    # URL del frontend de la tienda (para CORS)
    FRONTEND_STORE_URL="http://localhost:3001" # o la URL de tu tienda
    ```

4.  **Ejecutar las migraciones de la base de datos:**
    Prisma utilizará el esquema definido para crear las tablas en tu base de datos.

    ```bash
    npx prisma migrate dev
    ```

5.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

6.  ¡Listo\! Abre [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) en tu navegador para ver el proyecto en acción.

## ✍️ Autores

Este proyecto fue desarrollado en equipo por:

  * **Andrea Cecilia López**

      * GitHub: [@ProfeCeci](https://www.google.com/search?q=https://github.com/ProfeCeci)
      * LinkedIn: [linkedin.com/in/andreacecilialopez](https://www.google.com/search?q=https://www.linkedin.com/in/andreacecilialopez/)

  * **Nicolas Loto**

      * GitHub: [@nicolasloto](https://www.google.com/search?q=https://github.com/nicolasloto)

  * **Carlos Joaquin Guzman**

      * GitHub: [@Joaco1404](https://www.google.com/search?q=https://github.com/Joaco1404)

  * **Fernando Agustin Guzman**
