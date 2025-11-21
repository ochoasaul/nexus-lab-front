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
- `pnpm dev` – modo desarrollo con HMR
- `pnpm build` – compilación para producción
- `pnpm preview` – sirve la build ya compilada
- `pnpm lint` – ejecuta ESLint sobre todo el proyecto

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
1. Instala dependencias (`pnpm install`).
2. Copia o ajusta las variables del archivo `.env`.
3. Ejecuta `pnpm dev` y abre `http://localhost:5173`.
