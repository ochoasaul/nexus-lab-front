import { useCallback, useEffect, useMemo, useState } from 'react'
import { ROLE_DETAILS, type RoleKey } from '../../config'
import { useAuth } from '../../hooks/useAuth'
import {
  LABS,
  type Laboratory,
  type LabReport,
  type LabReservation,
  type LabSchedule,
  type LabUser,
  type LabUserRole,
  type LostObject,
} from '../../mocks/labs'

const MENU_OPTIONS = [
  { id: 'overview', label: 'Resumen' },
  { id: 'inventory', label: 'Inventario' },
  { id: 'users', label: 'Usuarios y roles' },
  { id: 'reports', label: 'Reportes y registros' },
  { id: 'schedules', label: 'Docentes & horarios' },
  { id: 'tasks', label: 'Tareas' },
] as const

export type MenuOptionId = (typeof MENU_OPTIONS)[number]['id']

type AggregatedLab = {
  id: string
  name: string
  permissions: Laboratory['permissions']
  inventory: Laboratory['inventory']
  users: LabUser[]
  schedules: LabSchedule[]
  reports: LabReport[]
  reservations: LabReservation[]
  lostObjects: LostObject[]
}

type ActivityItem = {
  id: string
  message: string
  timestamp: string
}

const defaultPermissions: Laboratory['permissions'] = {
  canAssignUsers: true,
  canCreateAdministrativos: true,
  canAddSchedules: true,
  canManageInventory: true,
}

const aggregateLabs = (labs: Laboratory[]): AggregatedLab => ({
  id: 'all',
  name: 'Todos los laboratorios',
  permissions: defaultPermissions,
  inventory: labs.flatMap((lab) => lab.inventory),
  users: labs.flatMap((lab) => lab.users),
  schedules: labs.flatMap((lab) => lab.schedules),
  reports: labs.flatMap((lab) => lab.reports),
  reservations: labs.flatMap((lab) => lab.reservations),
  lostObjects: labs.flatMap((lab) => lab.lostObjects),
})

// Línea 65 - Actualiza esta función
const labsForRole = (role: RoleKey, userLabs: string[] = []) => {  // ✅ Agrega = []
  if (role === 'super_admin') return LABS
  return LABS.filter((lab) => userLabs.includes(lab.id))
}


const cloneLab = (lab: Laboratory): Laboratory => JSON.parse(JSON.stringify(lab))

const randomId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

// Return the list of LabUserRole values that `currentRole` is allowed to assign
const allowedAssignRolesFor = (currentRole: RoleKey): LabUserRole[] => {
  if (currentRole === 'super_admin') return ['encargado', 'administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'encargado') return ['administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'administrativo') return ['administrativo', 'auxiliar', 'docente', 'alumno']
  return ['docente', 'alumno']
}

// Return which roles the currentRole can be assigned tasks to
const allowedTaskAssigneesFor = (currentRole: RoleKey): LabUserRole[] => {
  if (currentRole === 'super_admin') return ['encargado', 'administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'encargado') return ['administrativo', 'auxiliar']
  if (currentRole === 'administrativo') return ['auxiliar']
  return []
}

export function useDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<MenuOptionId>('overview')
  const [selectedLabId, setSelectedLabId] = useState<string>('all')
  const [labState, setLabState] = useState<Laboratory[]>([])
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([])
  const [assignedTasks, setAssignedTasks] = useState<
    { id: string; title: string; assigneeId: string; assignerId: string; labId: string; timestamp: string; status: 'pendiente' | 'en_progreso' | 'completada' }[]
  >([])
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLabState([])
      return
    }
    const scopedLabs = labsForRole(user.role, user.labs).map(cloneLab)
    setLabState(scopedLabs)
    // Default selection: super_admin keeps 'all', other roles default to their first assigned lab
    if (user.role === 'super_admin') {
      setSelectedLabId('all')
    } else {
      setSelectedLabId(scopedLabs[0]?.id ?? 'all')
    }
    // Seed some demo tasks for UI preview: pick an administrativo and an auxiliar if present
    const demoLab = scopedLabs[0]
    if (demoLab) {
      const admin = demoLab.users.find((u) => u.role === 'administrativo')
      const aux = demoLab.users.find((u) => u.role === 'auxiliar')
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      const demoTasks: typeof assignedTasks = []
      if (admin) {
        demoTasks.push({
          id: randomId(),
          title: 'Revisar control de acceso',
          assigneeId: admin.id,
          assignerId: demoLab.users[0]?.id ?? 'system',
          labId: demoLab.id,
          timestamp: now,
          status: 'pendiente',
        })
      }
      if (aux) {
        demoTasks.push({
          id: randomId(),
          title: 'Verificar stock de guantes nitrilo',
          assigneeId: aux.id,
          assignerId: demoLab.users[0]?.id ?? 'system',
          labId: demoLab.id,
          timestamp: now,
          status: 'en_progreso',
        })
        demoTasks.push({
          id: randomId(),
          title: 'Ordenar material de laboratorio',
          assigneeId: aux.id,
          assignerId: demoLab.users[0]?.id ?? 'system',
          labId: demoLab.id,
          timestamp: now,
          status: 'completada',
        })
      }
      if (demoTasks.length) setAssignedTasks(demoTasks)
    }
  }, [user])

  useEffect(() => {
    if (selectedLabId === 'all') return
    if (!labState.some((lab) => lab.id === selectedLabId)) {
      setSelectedLabId('all')
    }
  }, [labState, selectedLabId])

  const aggregatedLab = useMemo(() => aggregateLabs(labState), [labState])

  const selectedLab = useMemo(() => {
    if (selectedLabId === 'all') return null
    return labState.find((lab) => lab.id === selectedLabId) ?? null
  }, [selectedLabId, labState])

  const dataset = selectedLab ?? aggregatedLab

  const summaryCards = useMemo(
    () => [
      {
        label: 'Laboratorios monitorizados',
        value: labState.length,
        description: 'Operativos en esta sesión',
      },
      {
        label: 'Objetos perdidos',
        value: dataset.lostObjects.length,
        description: 'Reportes de objetos perdidos',
      },
      {
        label: 'Préstamos pendientes',
        value: dataset.reports.filter((r) => r.type === 'prestamos' && r.status !== 'cerrado').length,
        description: 'Préstamos y materiales en proceso',
      },
      {
        label: 'Reservas',
        value: dataset.reservations.length,
        description: 'Reservas registradas para el laboratorio',
      },
      {
        label: 'Usuarios activos',
        value: dataset.users.filter((userItem) => userItem.status === 'activo').length,
        description: 'Incluye docentes y auxiliares',
      },
      {
        label: 'Horarios programados',
        value: dataset.schedules.length,
        description: 'Entradas y salidas registradas',
      },
    ],
    [labState.length, dataset.lostObjects, dataset.reports, dataset.reservations, dataset.users, dataset.schedules],
  )

  const groupedUsers = useMemo(() => {
    return dataset.users.reduce<Record<string, LabUser[]>>((groups, currentUser) => {
      const group = currentUser.role
      if (!groups[group]) groups[group] = []
      groups[group].push(currentUser)
      return groups
    }, {})
  }, [dataset.users])

  const roleInfo = user ? ROLE_DETAILS[user.role] : null

  const logActivity = useCallback((message: string) => {
    const entry: ActivityItem = {
      id: randomId(),
      message,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    }
    setActivityFeed((prev) => [entry, ...prev].slice(0, 5))
    setActionMessage(message)
    setTimeout(() => setActionMessage(null), 2800)
  }, [])

  const mutateLab = useCallback((labId: string, mutator: (draft: Laboratory) => void) => {
    setLabState((prev) =>
      prev.map((lab) => {
        if (lab.id !== labId) return lab
        const draft = cloneLab(lab)
        mutator(draft)
        return draft
      }),
    )
  }, [])

  const resolveActionLabId = useCallback(() => {
    if (selectedLabId !== 'all') return selectedLabId
    return labState[0]?.id ?? null
  }, [labState, selectedLabId])

  const simulateInventoryAudit = useCallback(() => {
    const labId = resolveActionLabId()
    if (!labId) return
    mutateLab(labId, (draft) => {
      if (!draft.inventory.length) return
      draft.inventory = draft.inventory.map((item, index) =>
        index === 0
          ? { ...item, available: Math.max(0, item.available - 1), status: item.available - 1 <= 0 ? 'mantenimiento' : item.status }
          : item,
      )
    })
    logActivity('Auditoría rápida registrada en el inventario.')
  }, [logActivity, mutateLab, resolveActionLabId])

  const simulateAssignUser = useCallback(
    (name: string, role: LabUserRole) => {
      const labId = resolveActionLabId()
      if (!labId) return

      // Check that the current user is allowed to assign the requested role
      if (!user) return
      const allowed = allowedAssignRolesFor(user.role)
      if (!allowed.includes(role)) {
        logActivity(`No tienes permisos para asignar el rol ${role}.`)
        return
      }

      mutateLab(labId, (draft) => {
        draft.users.push({
          id: randomId(),
          name,
          role,
          status: 'pendiente',
        })
      })
      logActivity(`Se envió una invitación para ${name} como ${role}.`)
    },
    [logActivity, mutateLab, resolveActionLabId],
  )

  const simulateReservation = useCallback(() => {
    const labId = resolveActionLabId()
    if (!labId) return
    mutateLab(labId, (draft) => {
      draft.reservations.unshift({
        id: randomId(),
        requester: 'Reserva simulada',
        room: `Sala ${Math.ceil(Math.random() * 5)}`,
        date: new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'pendiente',
      })
    })
    logActivity('Reserva de aula registrada.')
  }, [logActivity, mutateLab, resolveActionLabId])

  const simulateLostObject = useCallback(() => {
    const labId = resolveActionLabId()
    if (!labId) return
    mutateLab(labId, (draft) => {
      draft.lostObjects.unshift({
        id: randomId(),
        item: 'Tarjeta de acceso',
        reportedBy: 'Sistema',
        date: new Date().toLocaleDateString('es-ES'),
        status: 'pendiente',
      })
    })
    logActivity('Objeto perdido registrado en el sistema.')
  }, [logActivity, mutateLab, resolveActionLabId])

  const simulateSchedule = useCallback(() => {
    const labId = resolveActionLabId()
    if (!labId) return
    mutateLab(labId, (draft) => {
      draft.schedules.push({
        id: randomId(),
        subject: 'Clase extraordinaria',
        teacher: 'Docente invitado',
        day: 'Viernes',
        timeRange: '16:00 - 18:00',
        duration: '2h',
      })
    })
    logActivity('Nuevo horario asignado para docentes.')
  }, [logActivity, mutateLab, resolveActionLabId])

  const simulateSupport = useCallback(() => {
    const labId = resolveActionLabId()
    if (!labId) return
    // For the mock, we only log the support registration in the activity feed
    logActivity('Registro de soporte creado.')
  }, [logActivity, resolveActionLabId])

  const simulateAssignTask = useCallback(
    (assigneeId: string, title: string) => {
      const labId = resolveActionLabId()
      if (!labId) return
      if (!user) return

      // Find the assignee in the dataset
      const assignee = dataset.users.find((u) => u.id === assigneeId)
      if (!assignee) {
        logActivity('Usuario no encontrado para asignar tarea.')
        return
      }

      const allowed = allowedTaskAssigneesFor(user.role)
      if (!allowed.includes(assignee.role)) {
        logActivity(`No tienes permisos para designar tareas a ${assignee.name} (${assignee.role}).`)
        return
      }

      const task = {
        id: randomId(),
        title,
        assigneeId,
        assignerId: user.id,
        labId,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        status: 'pendiente' as const,
      }
      setAssignedTasks((prev) => [task, ...prev])
      logActivity(`Tarea asignada: "${title}" → ${assignee.name}`)
    },
    [dataset.users, logActivity, resolveActionLabId, user],
  )

  const simulateStartTask = useCallback(
    (taskId: string) => {
      if (!user) return
      setAssignedTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t
          if (t.assigneeId !== user.id) return t
          return { ...t, status: 'en_progreso' }
        }),
      )
      logActivity('Tarea iniciada.')
    },
    [logActivity, user],
  )

  const simulateCompleteTask = useCallback(
    (taskId: string) => {
      if (!user) return
      setAssignedTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t
          if (t.assigneeId !== user.id) return t
          return { ...t, status: 'completada' }
        }),
      )
      logActivity('Tarea completada.')
    },
    [logActivity, user],
  )

  return {
    user,
    roleInfo,
    menuOptions: MENU_OPTIONS,
    activeSection,
    setActiveSection,
    labs: labState,
    selectedLabId,
    setSelectedLabId,
    selectedLab,
    dataset,
    summaryCards,
    groupedUsers,
    simulateInventoryAudit,
    simulateAssignUser,
    simulateAssignTask,
    simulateStartTask,
    simulateCompleteTask,
    simulateReservation,
    simulateLostObject,
    simulateSchedule,
    simulateSupport,
    assignedTasks,
    activityFeed,
    actionMessage,
  }
}
