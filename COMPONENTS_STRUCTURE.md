# Estructura de Componentes

Esta documentación describe la organización de los componentes en el proyecto.

## 📁 Estructura de Carpetas

```
src/components/
├── ui/                    # Componentes UI básicos reutilizables
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── useButton.ts
│   └── StatusBadge.tsx
│
├── modals/                # Todos los modales de la aplicación
│   ├── BaseModal.tsx      # Modal base (exportado también como Modal)
│   ├── AllLostObjectsModal.tsx
│   ├── ConfirmMoveToPorteriaModal.tsx
│   ├── CreateInventoryModal.tsx
│   ├── DeliverLostObjectModal.tsx
│   ├── EditInventoryModal.tsx
│   ├── ImagePreviewModal.tsx
│   ├── LostObjectModal.tsx
│   ├── MateriaModal.tsx
│   └── SoporteModal.tsx
│
├── dashboard/             # Componentes específicos del dashboard
│   ├── Panel.tsx          # Contenedor de paneles
│   ├── SummaryCard.tsx    # Tarjetas de resumen
│   └── QuickActions.tsx   # Acciones rápidas
│
├── layout/                # Componentes de layout
│   ├── Sidebar.tsx        # Barra lateral
│   └── TopBar.tsx         # Barra superior
│
├── icons/                 # Iconos SVG
│   └── Icons.tsx          # Exportación de todos los iconos
│
└── feedback/              # Componentes de feedback al usuario
    └── Toast.tsx           # Sistema de notificaciones toast
```

## 📋 Categorías de Componentes

### 1. UI (`ui/`)
Componentes básicos reutilizables que forman la base de la interfaz:
- **Button**: Botón con variantes (primary, secondary, ghost)
- **StatusBadge**: Badge para mostrar estados

### 2. Modals (`modals/`)
Todos los modales de la aplicación:
- **BaseModal**: Modal base reutilizable
- Modales específicos para diferentes funcionalidades

### 3. Dashboard (`dashboard/`)
Componentes específicos del dashboard:
- **Panel**: Contenedor de secciones
- **SummaryCard**: Tarjetas de resumen estadístico
- **QuickActions**: Panel de acciones rápidas

### 4. Layout (`layout/`)
Componentes de estructura de página:
- **Sidebar**: Navegación lateral
- **TopBar**: Barra superior

### 5. Icons (`icons/`)
Iconos SVG reutilizables exportados desde un solo archivo.

### 6. Feedback (`feedback/`)
Componentes de retroalimentación al usuario:
- **Toast**: Sistema de notificaciones

## 🔗 Uso en Páginas

### Componentes UI
```typescript
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
```

### Modales
```typescript
import { LostObjectModal } from '@/components/modals/LostObjectModal'
import { Modal } from '@/components/modals/BaseModal'
```

### Dashboard
```typescript
import { Panel } from '@/components/dashboard/Panel'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
```

### Layout
```typescript
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
```

### Feedback
```typescript
import { ToastContainer } from '@/components/feedback/Toast'
```

## ✅ Verificación de Uso

Todos los componentes en `components/` son utilizados en las páginas:

- ✅ **Button**: Usado en todas las páginas y componentes
- ✅ **StatusBadge**: Usado en Reports, Tasks, Schedules, Dashboard
- ✅ **Panel**: Usado en todas las páginas principales
- ✅ **SummaryCard**: Usado en Dashboard
- ✅ **QuickActions**: Usado en Dashboard
- ✅ **Modales**: Usados en Reports, Inventory, Schedules
- ✅ **Toast**: Usado globalmente en App.tsx
- ✅ **Layout**: Usado en MainLayout y AuthLayout

## 📝 Notas

- Los componentes están organizados por funcionalidad y reutilización
- Los componentes UI son los más básicos y reutilizables
- Los componentes de dashboard son específicos del área de dashboard
- Los modales están centralizados en una carpeta para fácil mantenimiento
- El sistema de feedback (Toast) está separado para claridad

