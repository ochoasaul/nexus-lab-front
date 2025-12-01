import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { eventService, type EventItem } from '@/services/eventService'
import { useToastStore } from '@/store/toastStore'
import { EventRegistrationModal } from '../components/modals/EventRegistrationModal'
import { EditEventModal } from '../components/modals/EditEventModal'

export function EventsTab() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const data = await eventService.getAll()
      setEvents(data)
    } catch (error: any) {
      addToast(error.message || 'Error loading events', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      await eventService.create(data)
      await loadEvents()
      setIsCreateModalOpen(false)
      addToast('Event registered successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error registering event', 'error')
      throw error
    }
  }

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      await eventService.update(id, data)
      await loadEvents()
      setIsEditModalOpen(false)
      setSelectedEvent(null)
      addToast('Event updated successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error updating event', 'error')
      throw error
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await eventService.remove(id)
      await loadEvents()
      addToast('Event deleted successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error deleting event', 'error')
    }
  }

  const handleEdit = (event: EventItem) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Event Management</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Event Registrations</h3>
        </div>
        <Button
          label="Register Event"
          variant="secondary"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">No event registrations found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-charcoal-100 bg-white p-4"
            >
              <header className="mb-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-charcoal-900">{event.nombre}</h4>
                </div>
              </header>
              <div className="space-y-2 text-sm text-charcoal-600">
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(event.fecha_evento).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {event.hora_inicio} - {event.hora_fin}
                </p>
                {event.aulas && event.aulas.length > 0 && (
                  <p>
                    <span className="font-medium">Classrooms:</span>{' '}
                    {event.aulas.map(a => a.nombre).join(', ')}
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  label="Edit"
                  variant="ghost"
                  onClick={() => handleEdit(event)}
                  className="text-xs"
                />
                <Button
                  label="Delete"
                  variant="ghost"
                  onClick={() => handleDelete(event.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <EventRegistrationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      {selectedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedEvent(null)
          }}
          event={selectedEvent}
          onSubmit={handleUpdate}
        />
      )}
    </>
  )
}

