# Webfolio

PWA multi-tenant para gestión de portafolios privados y reservas logísticas de talento.

## Stack Tecnológico

- **Framework:** Next.js (App Router) + TypeScript
- **Estilos:** Tailwind CSS (Diseño minimalista)
- **Backend / Base de Datos:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Iconografía:** Lucide React

## Estructura Inicial (Sprint 1)

- `src/lib/supabase/client.ts`: Cliente de navegador sujeto a políticas RLS por tenant.
- `src/lib/supabase/server.ts`: Cliente de servidor estándar y cliente administrativo (`service_role`) protegido mediante `server-only`.
- `src/components/layout/`: Layout responsivo del Súper Administrador (`Sidebar` y `SuperAdminShell`).
- `src/components/ui/`: Componentes reutilizables (`DataTable`, `Badge`, `StatusBadge`, `Button`).
- `src/app/(admin)/`: Vistas principales del Súper Administrador (**Directorio de Modelos**, **Métricas** y **Configuración**).

## Configuración Local

1. Copiar variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
2. Instalar dependencias y ejecutar servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
