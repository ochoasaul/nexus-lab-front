# MaquetaLab

Proyecto base en React con Vite pensado para comenzar rápidamente un dashboard con layouts, rutas, hooks y servicios ya organizados.

## Stack
- React 19 + TypeScript + Vite
- React Router DOM para el enrutado
- Zustand para el estado global
- Axios para los servicios HTTP
- Tailwind CSS para la maqueta y componentes visuales
- ESLint con las reglas recomendadas de React Hooks

## Scripts
- `npm run dev` – modo desarrollo con HMR
- `npm run build` – compilación para producción
- `npm run preview` – sirve la build ya compilada
- `npm run lint` – ejecuta ESLint sobre todo el proyecto

## Estructura de carpetas
```
nombre-proyecto/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── useButton.ts
│   │   ├── dashboard/
│   │   │   ├── Panel.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── SummaryCard.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── TopBar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useForm.ts
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Home/
│   │   └── Login/
│   ├── routes/
│   │   └── AppRouter.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── postService.ts
│   │   └── userService.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── userStore.ts
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   ├── config.ts
│   └── main.tsx
├── .env
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── README.md
```

Cada carpeta tiene un ejemplo mínimo para que puedas sustituirlo por tu lógica real (por ejemplo, los servicios apuntan al endpoint definido en `.env` y el store de Zustand ya expone acciones básicas).

## Variables de entorno
Crea un archivo `.env` en la raíz:
```
VITE_API_URL=https://api.maquetalab.local
```
Cambia el valor por la URL real de tu backend.

## Comenzar
1. Instala dependencias (`npm install`).
2. Copia o ajusta las variables del archivo `.env`.
3. Ejecuta `npm run dev` y abre `http://localhost:5173`.

## Gestor de paquetes
Este repositorio ahora usa npm como gestor de paquetes. Se ha eliminado `pnpm-lock.yaml` y `package-lock.json` se generará en tu entorno al ejecutar `npm install`.

Si prefieres usar pnpm, restaura `pnpm-lock.yaml` desde el historial de Git o genera uno nuevo con `pnpm install` y ajusta los comandos anteriores (`pnpm dev`, etc.).
