import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button/Button'
import { EnterIcon, InventoryIcon, AssignIcon, LoanIcon, SupportIcon, CalendarIcon } from '../../components/icons/Icons'
import { Panel } from '../../components/dashboard/Panel'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
import { ROLE_DETAILS, type RoleKey } from '../../config'
import type { LabUserRole } from '../../mocks/labs'
import { useDashboard, type MenuOptionId } from './useDashboard'
import { useSearchParams } from 'react-router-dom'

// Allowed assignment options based on the current user's role
const allowedAssignRolesFor = (currentRole: RoleKey): LabUserRole[] => {
  if (currentRole === 'super_admin') return ['encargado', 'administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'encargado') return ['administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'administrativo') return ['administrativo', 'auxiliar', 'docente', 'alumno']
  return ['docente', 'alumno']
}

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

function DashboardPage() {
  const {
    user,
    roleInfo,
    menuOptions,
    activeSection,
    setActiveSection,
    labs,
    selectedLabId,
    setSelectedLabId,
    selectedLab,
    dataset,
    summaryCards,
    groupedUsers,
    simulateAssignTask,
    simulateInventoryAudit,
    simulateAssignUser,
    simulateReservation,
    simulateLostObject,
  simulateSchedule,
  simulateSupport,
    simulateStartTask,
    simulateCompleteTask,
    assignedTasks,
    activityFeed,
    actionMessage,
  } = useDashboard()

  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState<LabUserRole>('auxiliar')
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'hardware' | 'consumible' | 'seguridad'>('all')
  const [searchParams, setSearchParams] = useSearchParams()
  const currentView = (searchParams.get('view') ?? 'overview') as MenuOptionId

  useEffect(() => {
    if (currentView !== activeSection) {
      setActiveSection(currentView)
    }
  }, [currentView, activeSection, setActiveSection])

  const updateSection = (section: MenuOptionId) => {
    setActiveSection(section)
    setSearchParams({ view: section }, { replace: true })
  }

  if (!user || !roleInfo) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para explorar el panel.
      </section>
    )
  }

  const actionsRequireLab = selectedLabId === 'all' && labs.length > 1

  const handleAssignUser = () => {
    if (!newUserName.trim()) return
    simulateAssignUser(newUserName.trim(), newUserRole)
    setNewUserName('')
  }

  const handleLabQuickSelect = (labId: string) => {
    setSelectedLabId(labId)
    updateSection('inventory')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'inventory':
        return (
          <Panel
            title="Inventario"
            actions={
              <Button
                label="Auditar inventario"
                variant="secondary"
                onClick={simulateInventoryAudit}
                disabled={actionsRequireLab}
                title={actionsRequireLab ? 'Selecciona un laboratorio específico' : ''}
              />
            }
            className={actionsRequireLab ? 'space-y-2' : ''}
          >
            {actionsRequireLab && (
              <p className="text-xs text-primary-600">Selecciona un laboratorio específico para aplicar los cambios.</p>
            )}

            <div className="mt-4 flex gap-2">
              {(['all', 'hardware', 'consumible', 'seguridad'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setInventoryFilter(cat)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    inventoryFilter === cat ? 'bg-primary-50 text-primary-600' : 'bg-charcoal-50 text-charcoal-700'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dataset.inventory
                .filter((it) => inventoryFilter === 'all' || it.category === inventoryFilter)
                .map((item) => (
                  <article key={item.id} className="rounded-2xl border border-charcoal-100 bg-surface p-4">
                    <header className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-charcoal-500">{item.category === 'hardware' ? 'Equipo' : 'Consumible'}</p>
                        <h4 className="text-lg font-semibold text-charcoal-900">{item.name}</h4>
                      </div>
                      <StatusBadge label={item.status} />
                    </header>
                    <footer className="mt-4 flex gap-4 text-sm text-charcoal-600">
                      <span>Total: {item.quantity}</span>
                      <span>Disponibles: {item.available}</span>
                    </footer>
                  </article>
                ))}
            </div>
          </Panel>
        )
      case 'users':
        return (
          <Panel title="Roles y permisos">
            <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(groupedUsers).map(([role, users]) => (
                  <article key={role} className="rounded-2xl border border-charcoal-100 bg-surface p-4">
                    <header className="mb-3 flex items-center justify-between">
                      <h4 className="text-base font-semibold text-charcoal-900">{formatRoleLabel(role)}</h4>
                      <span className="text-xs text-charcoal-500">{users.length} usuarios</span>
                    </header>
                      <ul className="space-y-2 text-sm text-charcoal-600">
                        {users.map((member) => {
                          // determine whether current user may assign a task to this member
                          const canAssignTask =
                            user && (user.role === 'super_admin' || (user.role === 'encargado' && ['administrativo', 'auxiliar'].includes(member.role)) || (user.role === 'administrativo' && member.role === 'auxiliar'))
                          return (
                            <li key={member.id} className="flex items-center justify-between border-b border-charcoal-100 pb-1">
                              <div className="flex items-center gap-3">
                                <span>{member.name}</span>
                                <small className="text-xs text-charcoal-400">{formatRoleLabel(member.role)}</small>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={member.status === 'activo' ? 'text-emerald-600' : 'text-amber-600'}>
                                  {member.status}
                                </span>
                                {canAssignTask && (
                                  <Button
                                    label="Designar tarea"
                                    variant="ghost"
                                    Icon={AssignIcon}
                                    onClick={() => {
                                      const title = window.prompt(`Descripción de la tarea para ${member.name}:`)
                                      if (!title || !title.trim()) return
                                      simulateAssignTask(member.id, title.trim())
                                    }}
                                  />
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                  </article>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 p-4 text-sm text-charcoal-600">
                <h4 className="text-lg font-semibold text-charcoal-900">Asignar a un laboratorio</h4>
                <p className="mt-2 text-charcoal-500">
                  Los encargados pueden sumar administrativos, auxiliares o promover alumnos para cubrir turnos.
                </p>
                <div className="mt-4 grid gap-3">
                  <input
                    placeholder="Nombre completo"
                    value={newUserName}
                    onChange={(event) => setNewUserName(event.target.value)}
                    className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
                  />
                  <select
                    className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                    value={newUserRole}
                    onChange={(event) => setNewUserRole(event.target.value as LabUserRole)}
                  >
                    {allowedAssignRolesFor(user.role).map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {formatRoleLabel(roleOption)}
                      </option>
                    ))}
                  </select>
                  <Button
                    label="Crear invitación"
                    onClick={handleAssignUser}
                    disabled={!newUserName.trim() || actionsRequireLab}
                    title={actionsRequireLab ? 'Selecciona un laboratorio' : ''}
                  />
                </div>
              </div>
            </div>
          </Panel>
        )
      case 'reports':
        return (
          <Panel title="Reportes y registros">
            <div className="grid gap-6 lg:grid-cols-3">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Reportes abiertos</p>
                  <Button label="Nuevo reporte" variant="ghost" onClick={simulateLostObject} disabled={actionsRequireLab} />
                </div>
                <ul className="space-y-4">
                  {dataset.reports.map((report) => (
                    <article key={report.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                      <header className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-charcoal-400">{report.type}</p>
                          <h4 className="text-lg font-semibold text-charcoal-900">{report.title}</h4>
                        </div>
                        <StatusBadge label={report.status} />
                      </header>
                      <p className="text-sm text-charcoal-600">{report.details}</p>
                      <small className="text-xs text-charcoal-400">Actualizado {report.updatedAt}</small>
                    </article>
                  ))}
                </ul>
              </section>
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Reservas de aulas</p>
                  <Button label="Registrar reserva" variant="ghost" onClick={simulateReservation} disabled={actionsRequireLab} />
                </div>
                <ul className="space-y-4">
                  {dataset.reservations.map((reservation) => (
                    <article key={reservation.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                      <header className="mb-2 flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-charcoal-900">{reservation.requester}</h4>
                        <StatusBadge label={reservation.status} />
                      </header>
                      <p className="text-sm text-charcoal-600">{reservation.room}</p>
                      <small className="text-xs text-charcoal-400">{reservation.date}</small>
                    </article>
                  ))}
                </ul>
              </section>
              <section>
                <p className="mb-3 text-xs uppercase tracking-[0.4em] text-charcoal-400">Objetos perdidos</p>
                <ul className="space-y-4">
                  {dataset.lostObjects.map((lost) => (
                    <article key={lost.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                      <header className="mb-2 flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-charcoal-900">{lost.item}</h4>
                        <StatusBadge label={lost.status} />
                      </header>
                      <p className="text-sm text-charcoal-600">Reportado por {lost.reportedBy}</p>
                      <small className="text-xs text-charcoal-400">{lost.date}</small>
                    </article>
                  ))}
                </ul>
              </section>
            </div>
          </Panel>
        )
      case 'schedules':
        return (
          <Panel title="Horarios y docentes">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Registros dinámicos</p>
                <h3 className="text-2xl font-semibold text-charcoal-900">Entradas y salidas de docentes</h3>
                <p className="text-sm text-charcoal-500">
                  Define múltiples horarios por materia y ajusta la duración cuando cambie el plan.
                </p>
              </div>
              <Button label="Agregar horario" variant="secondary" onClick={simulateSchedule} disabled={actionsRequireLab} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dataset.schedules.map((schedule) => (
                <article key={schedule.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                  <header className="mb-2 flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-charcoal-900">{schedule.subject}</h4>
                    <span className="text-xs text-charcoal-500">{schedule.duration}</span>
                  </header>
                  <p className="text-sm text-charcoal-600">{schedule.teacher}</p>
                  <small className="text-xs text-charcoal-400">
                    {schedule.day} · {schedule.timeRange}
                  </small>
                </article>
              ))}
            </div>
          </Panel>
        )
      case 'tasks':
        return (
          <Panel title="Tareas asignadas">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">Tareas</p>
                <h3 className="text-2xl font-semibold text-charcoal-900">Gestión de tareas</h3>
                <p className="text-sm text-charcoal-500">Visualiza y administra las tareas asignadas según tu rol.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <section className="col-span-2">
                <div className="space-y-3">
                  {(assignedTasks.length === 0 && <p className="text-sm text-charcoal-500">No hay tareas asignadas.</p>) || null}
                  {assignedTasks.map((task) => {
                    const assignee = dataset.users.find((u) => u.id === task.assigneeId)
                    const assigner = dataset.users.find((u) => u.id === task.assignerId)
                    // visibility rules:
                    // - auxiliar: only sees their tasks
                    // - administrativo: sees their tasks and tasks assigned to auxiliares in same dataset
                    // - encargado/super_admin: sees tasks for administrativos and auxiliares
                    const canViewTask = (() => {
                      if (!user) return false
                      if (user.role === 'super_admin') return true
                      if (user.role === 'encargado') return assignee?.role === 'administrativo' || assignee?.role === 'auxiliar'
                      if (user.role === 'administrativo') return assignee?.id === user.id || assignee?.role === 'auxiliar'
                      if (user.role === 'auxiliar') return assignee?.id === user.id
                      return false
                    })()

                    if (!canViewTask) return null

                    const isAssignee = user && user.id === task.assigneeId

                    return (
                      <article key={task.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                        <header className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-charcoal-900">{task.title}</h4>
                            <p className="text-xs text-charcoal-500">Asignado a {assignee?.name ?? '—'}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-charcoal-500">{task.timestamp}</p>
                            <StatusBadge label={task.status === 'pendiente' ? 'pendiente' : task.status === 'en_progreso' ? 'en progreso' : 'completada'} />
                          </div>
                        </header>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-charcoal-600">Asignador: {assigner?.name ?? 'Sistema'}</div>
                          <div className="flex items-center gap-2">
                            {/* Only assignee can start/complete their tasks */}
                            {isAssignee && task.status === 'pendiente' && (
                              <Button label="Iniciar" variant="primary" onClick={() => simulateStartTask(task.id)} />
                            )}
                            {isAssignee && task.status === 'en_progreso' && (
                              <Button label="Finalizar" variant="secondary" onClick={() => simulateCompleteTask(task.id)} />
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>

              <aside className="col-span-1 rounded-2xl border border-charcoal-100 bg-surface p-4">
                <h4 className="text-lg font-semibold text-charcoal-900">Crear tarea</h4>
                <p className="text-sm text-charcoal-500 mt-1">Designa nuevas tareas a administrativos o auxiliares según tu rol.</p>
                <div className="mt-3 grid gap-3">
                  <select id="assignee-select" className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2 text-charcoal-900">
                    <option value="">Selecciona destinatario</option>
                    {dataset.users
                      .filter((u) => {
                        if (!user) return false
                        const allowed = user.role === 'super_admin' ? ['administrativo', 'auxiliar'] : user.role === 'encargado' ? ['administrativo', 'auxiliar'] : user.role === 'administrativo' ? ['auxiliar'] : []
                        return allowed.includes(u.role)
                      })
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} — {formatRoleLabel(u.role)}
                        </option>
                      ))}
                  </select>
                  <input id="task-title" placeholder="Descripción de la tarea" className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2 text-charcoal-900" />
                  <Button
                    label="Asignar"
                    variant="primary"
                    onClick={() => {
                      const sel = document.getElementById('assignee-select') as HTMLSelectElement | null
                      const input = document.getElementById('task-title') as HTMLInputElement | null
                      const assigneeId = sel?.value ?? ''
                      const title = input?.value ?? ''
                      if (!assigneeId || !title.trim()) return alert('Selecciona destinatario y describe la tarea')
                      simulateAssignTask(assigneeId, title.trim())
                      if (input) input.value = ''
                      if (sel) sel.value = ''
                    }}
                  />
                </div>
              </aside>
            </div>
          </Panel>
        )
      default:
        // Show full labs panel only to super_admin; other roles see a focused summary of their assigned lab
        if (user.role === 'super_admin') {
          return (
            <Panel title="Laboratorios">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Panel</p>
                  <h3 className="text-2xl font-semibold text-charcoal-900">Acceso rápido</h3>
                </div>
                {user.role === 'super_admin' && <Button label="Crear laboratorio" variant="secondary" />}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {labs.map((lab) => (
                  <article
                    key={lab.id}
                    className={`rounded-2xl border p-5 transition hover:border-primary-400 ${
                      selectedLabId === lab.id ? 'border-primary-500 shadow-glow' : 'border-charcoal-100'
                    }`}
                  >
                    <header className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">{lab.code}</p>
                        <h4 className="text-xl font-semibold text-charcoal-900">{lab.name}</h4>
                      </div>
                      <StatusBadge label={lab.status} />
                    </header>
                    <p className="text-sm text-charcoal-500">{lab.location}</p>
                    <p className="text-sm text-charcoal-500">Encargado: {lab.lead}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button label="Entrar" variant="secondary" onClick={() => handleLabQuickSelect(lab.id)} Icon={EnterIcon} />
                      <Button label="Inventario" variant="ghost" Icon={InventoryIcon} />
                      {/* Show assign/change manager per lab */}
                      {user.role === 'super_admin' && (
                        <div>
                          {lab.managerId ? (
                            <Button label="Cambiar encargado" variant="ghost" Icon={AssignIcon} />
                          ) : (
                            <Button label="Asignar encargado" variant="secondary" Icon={AssignIcon} />
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          )
        }

        // Non-admin: show a compact information panel about the assigned laboratory
        return (
          <Panel title="Información del laboratorio">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Resumen</p>
                <h3 className="text-2xl font-semibold text-charcoal-900">{selectedLab?.name ?? '—'}</h3>
                <p className="text-sm text-charcoal-500">{selectedLab?.location ?? ''}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border p-5 bg-white">
                <h4 className="text-sm text-charcoal-400">Estado</h4>
                <div className="mt-2 flex items-center justify-between">
                  <StatusBadge label={selectedLab?.status ?? 'operativo'} />
                  <p className="text-lg font-semibold text-charcoal-900">Capacidad: {selectedLab?.capacity ?? '—'}</p>
                </div>
                <p className="mt-2 text-sm text-charcoal-500">Encargado: {selectedLab?.lead ?? '—'}</p>
              </article>

              <article className="rounded-2xl border p-5 bg-white">
                <h4 className="text-sm text-charcoal-400">Inventario</h4>
                <p className="mt-2 text-lg font-semibold text-charcoal-900">{selectedLab?.inventory.length ?? 0} items</p>
                <p className="mt-2 text-sm text-charcoal-500">Disponibles: {selectedLab ? selectedLab.inventory.reduce((s, i) => s + i.available, 0) : 0}</p>
              </article>

              <article className="rounded-2xl border p-5 bg-white">
                <h4 className="text-sm text-charcoal-400">Usuarios activos</h4>
                <p className="mt-2 text-lg font-semibold text-charcoal-900">{selectedLab ? selectedLab.users.filter((u) => u.status === 'activo').length : 0}</p>
                <p className="mt-2 text-sm text-charcoal-500">Total usuarios: {selectedLab?.users.length ?? 0}</p>
              </article>

              <article className="rounded-2xl border p-5 bg-white">
                <h4 className="text-sm text-charcoal-400">Horarios</h4>
                <p className="mt-2 text-lg font-semibold text-charcoal-900">{selectedLab?.schedules.length ?? 0}</p>
                <p className="mt-2 text-sm text-charcoal-500">Reservas: {selectedLab?.reservations.length ?? 0}</p>
              </article>
            </div>
          </Panel>
        )
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-6">
        {actionMessage && (
          <div className="rounded-2xl border border-primary-100 bg-primary-50 px-6 py-4 text-sm text-primary-700 shadow-sm">
            {actionMessage}
          </div>
        )}
        {activeSection === 'overview' && (
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">Visión general</p>
                <h1 className="text-3xl font-semibold text-charcoal-900">
                  {selectedLab ? selectedLab.name : 'Todos los laboratorios'}
                </h1>
                <p className="text-sm text-charcoal-500">
                  {selectedLab
                    ? 'Explora inventario, usuarios, reportes y registros dinámicos de este laboratorio.'
                    : 'Navega entre todos los laboratorios y filtra la información por módulo.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Admin: when inside a specific lab show a quick exit control; admins choose lab by entering a card */}
                {user.role === 'super_admin' && selectedLabId !== 'all' && (
                  <Button
                    label="Salir del laboratorio"
                    variant="ghost"
                    onClick={() => {
                      setSelectedLabId('all')
                      setActiveSection('overview')
                    }}
                  />
                )}

                {/* Non-admins: show assigned lab name */}
                {user.role !== 'super_admin' && (
                  <div className="min-w-[200px]">
                    <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">Laboratorio</p>
                    <div className="mt-2 rounded-full bg-charcoal-50 px-4 py-2 text-sm font-medium text-charcoal-900">
                      {selectedLab?.name ?? 'Sin laboratorio asignado'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <SummaryCard key={card.label} label={card.label} value={card.value} description={card.description} />
              ))}
            </div>
          </Panel>
        )}

        {!actionsRequireLab && (
          <Panel title="Acciones rápidas">
            <div className="flex flex-wrap gap-3">
              <Button label="Registro de préstamos" variant="primary" onClick={simulateInventoryAudit} disabled={actionsRequireLab} Icon={LoanIcon} />
              <Button label="Registro de Soporte" variant="secondary" onClick={simulateSupport} Icon={SupportIcon} />
              <Button label="Registro de Objetos perdidos" variant="ghost" onClick={simulateLostObject} Icon={InventoryIcon} />
              <Button label="Registro de Reservas" variant="ghost" onClick={simulateReservation} disabled={actionsRequireLab} Icon={CalendarIcon} />
            </div>
          </Panel>
        )}

        {renderSection()}
      </div>
    </section>
  )
}

export default DashboardPage
