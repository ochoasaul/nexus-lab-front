# Arquitectura de Componentes

## 📐 Principios de Organización

### Componentes Generales (`@/components/`)
Contienen componentes **reutilizables** que se usan en múltiples páginas o en toda la aplicación.

### Componentes Específicos (`@/pages/[page]/components/`)
Contienen componentes **específicos** de una página o funcionalidad particular.

---

## 📁 Estructura de Carpetas

### `src/components/` - Componentes Generales

```
components/
├── ui/                    # Componentes UI básicos reutilizables
│   ├── Button/            # Botón con variantes
│   └── StatusBadge.tsx    # Badge de estado
│
├── dashboard/             # Componentes del dashboard (usados en TODAS las páginas)
│   ├── Panel.tsx          # Contenedor de paneles (usado en todas las páginas)
│   ├── QuickActions.tsx   # Acciones rápidas (disponible para todas las páginas)
│   └── SummaryCard.tsx    # Tarjetas de resumen estadístico
│
├── modals/                # Modales reutilizables
│   ├── BaseModal.tsx      # Modal base
│   └── [modales específicos]
│
├── layout/                # Componentes de layout
│   ├── Sidebar.tsx
│   └── TopBar.tsx
│
├── icons/                 # Iconos SVG
│   └── Icons.tsx
│
└── feedback/              # Sistema de feedback
    └── Toast.tsx          # Notificaciones toast
```

### `src/pages/[page]/components/` - Componentes Específicos

Cada página tiene sus propios componentes específicos:

```
pages/
├── Dashboard/
│   └── components/
│       ├── LabsGrid.tsx       # Grid de laboratorios (específico de Dashboard)
│       ├── LabCard.tsx        # Tarjeta de laboratorio (específico de Dashboard)
│       └── OverviewHeader.tsx # Encabezado de overview (específico de Dashboard)
│
├── Inventory/
│   └── components/
│       ├── InventoryList.tsx      # Lista de inventario (específico de Inventory)
│       └── LaboratorioSelector.tsx # Selector de laboratorio (específico de Inventory)
│
├── Reports/
│   └── components/
│       ├── ReportsSection.tsx      # Sección de reportes (específico de Reports)
│       ├── ReservationsSection.tsx # Sección de reservas (específico de Reports)
│       └── LostObjectsSection.tsx  # Sección de objetos perdidos (específico de Reports)
│
├── Tasks/
│   └── components/
│       ├── TaskList.tsx        # Lista de tareas (específico de Tasks)
│       └── CreateTaskForm.tsx  # Formulario de tareas (específico de Tasks)
│
├── Users/
│   └── components/
│       ├── UserRoleGroup.tsx   # Grupo de usuarios por rol (específico de Users)
│       └── AssignUserForm.tsx  # Formulario de asignación (específico de Users)
│
└── Schedules/
    └── components/
        ├── MateriaCard.tsx     # Tarjeta de materia (específico de Schedules)
        └── MateriasFilters.tsx # Filtros de materias (específico de Schedules)
```

---

## 🎯 Reglas de Uso

### ✅ Componentes Generales (`@/components/`)

**Se usan cuando:**
- El componente se usa en **múltiples páginas**
- El componente es **reutilizable** en diferentes contextos
- El componente es parte de la **infraestructura** de la aplicación

**Ejemplos:**
- `Panel` - Usado en todas las páginas
- `QuickActions` - Disponible para todas las páginas
- `Button` - Componente base reutilizable
- `StatusBadge` - Usado en múltiples páginas
- `Modal` - Sistema de modales reutilizable

### ✅ Componentes Específicos (`@/pages/[page]/components/`)

**Se usan cuando:**
- El componente es **específico** de una página
- El componente solo tiene sentido en el contexto de esa página
- El componente no se reutiliza en otras páginas

**Ejemplos:**
- `LabsGrid` - Solo se usa en Dashboard
- `InventoryList` - Solo se usa en Inventory
- `TaskList` - Solo se usa en Tasks

---

## 📋 Mapa de Componentes por Categoría

### Componentes Generales

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `Button` | `components/ui/Button/` | Todas las páginas |
| `StatusBadge` | `components/ui/StatusBadge.tsx` | Reports, Tasks, Schedules, Dashboard |
| `Panel` | `components/dashboard/Panel.tsx` | **Todas las páginas** |
| `QuickActions` | `components/dashboard/QuickActions.tsx` | **Disponible para todas las páginas** |
| `SummaryCard` | `components/dashboard/SummaryCard.tsx` | Dashboard, Reports |
| `Modal` | `components/modals/BaseModal.tsx` | Todas las páginas (base) |
| `Toast` | `components/feedback/Toast.tsx` | Global (App.tsx) |

### Componentes Específicos por Página

| Página | Componentes Específicos |
|--------|-------------------------|
| **Dashboard** | `LabsGrid`, `LabCard`, `OverviewHeader` |
| **Inventory** | `InventoryList`, `LaboratorioSelector` |
| **Reports** | `ReportsSection`, `ReservationsSection`, `LostObjectsSection` |
| **Tasks** | `TaskList`, `CreateTaskForm` |
| **Users** | `UserRoleGroup`, `AssignUserForm` |
| **Schedules** | `MateriaCard`, `MateriasFilters` |

---

## 🔄 Flujo de Importaciones

### Importar Componentes Generales
```typescript
// Componentes UI
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'

// Componentes Dashboard (generales)
import { Panel } from '@/components/dashboard/Panel'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { SummaryCard } from '@/components/dashboard/SummaryCard'

// Modales
import { LostObjectModal } from '@/components/modals/LostObjectModal'
```

### Importar Componentes Específicos
```typescript
// Desde la misma página
import { TaskList } from './components/TaskList'
import { CreateTaskForm } from './components/CreateTaskForm'

// Desde otra página (evitar, pero posible)
import { LabsGrid } from '@/pages/Dashboard/components/LabsGrid'
```

---

## ✅ Verificación de Estructura

### Componentes Generales en `components/`
- ✅ `ui/Button/` - Reutilizable
- ✅ `ui/StatusBadge.tsx` - Reutilizable
- ✅ `dashboard/Panel.tsx` - Usado en todas las páginas
- ✅ `dashboard/QuickActions.tsx` - Disponible para todas las páginas
- ✅ `dashboard/SummaryCard.tsx` - Reutilizable
- ✅ `modals/*` - Modales reutilizables
- ✅ `layout/*` - Componentes de layout
- ✅ `icons/*` - Iconos reutilizables
- ✅ `feedback/Toast.tsx` - Sistema global

### Componentes Específicos en `pages/[page]/components/`
- ✅ Dashboard: `LabsGrid`, `LabCard`, `OverviewHeader`
- ✅ Inventory: `InventoryList`, `LaboratorioSelector`
- ✅ Reports: `ReportsSection`, `ReservationsSection`, `LostObjectsSection`
- ✅ Tasks: `TaskList`, `CreateTaskForm`
- ✅ Users: `UserRoleGroup`, `AssignUserForm`
- ✅ Schedules: `MateriaCard`, `MateriasFilters`

---

## 📝 Notas Importantes

1. **`components/dashboard/` es general**: Aunque se llama "dashboard", estos componentes (`Panel`, `QuickActions`, `SummaryCard`) son **generales** y se usan en todas las páginas.

2. **`QuickActions` disponible globalmente**: Aunque actualmente solo se usa en `OverviewPage`, está diseñado para estar disponible en todas las páginas.

3. **Separación clara**: Los componentes generales están en `components/`, los específicos en `pages/[page]/components/`.

4. **Reutilización**: Si un componente específico necesita usarse en otra página, considerar moverlo a `components/` si es apropiado.

