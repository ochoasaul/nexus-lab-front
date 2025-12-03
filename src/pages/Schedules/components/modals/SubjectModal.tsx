import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { SCHEDULE_TIMES } from '@/constants/scheduleTimes'

interface Classroom {
  id: string | number
  name: string
}

interface SubjectData {
  id?: string | number
  name: string
  teacher: string
  classroom: string
  schedule: string
  daysType: string
  startDate: string
  endDate: string
  state?: 'active' | 'inactive'
}

interface SubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<SubjectData, 'id' | 'state'>) => void
  subject?: SubjectData | null
  classrooms?: Classroom[]
  isLoadingClassrooms?: boolean
}

const DAYS_TYPE_OPTIONS = [
  { value: 'Modular', label: 'Modular' },
  { value: 'Viernes-Sábado', label: 'Friday-Saturday' },
  { value: 'Martes-Jueves', label: 'Tuesday-Thursday' },
  { value: 'Lunes-Miércoles', label: 'Monday-Wednesday' },
  { value: 'Sábado', label: 'Saturday' },
]

export function SubjectModal({
  isOpen,
  onClose,
  onSubmit,
  subject,
  classrooms = [],
  isLoadingClassrooms = false,
}: SubjectModalProps) {
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')
  const [classroomId, setClassroomId] = useState<string>('')
  const [schedule, setSchedule] = useState<string>('')
  const [daysType, setDaysType] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (subject) {
      setName(subject.name)
      setTeacher(subject.teacher)
      // We need to find the classroom ID based on the name if possible, or just use the name if it matches
      // For now assuming classroom is stored as name in subject data but we need ID for select
      // Ideally subject data should have classroomId.
      // Let's try to find the classroom by name in the classrooms list
      const foundClassroom = classrooms.find(c => c.name === subject.classroom)
      setClassroomId(foundClassroom ? String(foundClassroom.id) : '')

      setSchedule(subject.schedule)
      setDaysType(subject.daysType)
      setStartDate(subject.startDate)
      setEndDate(subject.endDate)
    } else {
      resetForm()
    }
  }, [subject, isOpen, classrooms])

  const resetForm = () => {
    setName('')
    setTeacher('')
    setClassroomId('')
    setSchedule('')
    setDaysType('')
    setStartDate('')
    setEndDate('')
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Subject name is required')
      return
    }
    if (!teacher.trim()) {
      setError('Teacher name is required')
      return
    }
    if (!classroomId) {
      setError('You must select a classroom')
      return
    }
    if (!schedule) {
      setError('You must select a schedule')
      return
    }
    if (!daysType) {
      setError('You must select the days type')
      return
    }
    if (!startDate) {
      setError('Start date is required')
      return
    }
    if (!endDate) {
      setError('End date is required')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date')
      return
    }

    setIsSubmitting(true)
    try {
      const selectedClassroom = classrooms.find(c => String(c.id) === classroomId)
      await onSubmit({
        name: name.trim(),
        teacher: teacher.trim(),
        classroom: selectedClassroom?.name || '',
        schedule,
        daysType,
        startDate,
        endDate,
      })
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error saving subject')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={subject ? 'Edit Subject' : 'Add Subject'}
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Subject Name */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Subject Name <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ex: Programming I"
            required
          />
        </div>

        {/* Teacher Name */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Teacher Name <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ex: Dr. John Doe"
            required
          />
        </div>

        {/* Classroom */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Classroom <span className="text-primary-600">*</span>
          </label>
          {isLoadingClassrooms ? (
            <p className="text-sm text-charcoal-500">Loading classrooms...</p>
          ) : (
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              required
            >
              <option value="">Select classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={String(classroom.id)}>
                  {classroom.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Schedule <span className="text-primary-600">*</span>
          </label>
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          >
            <option value="">Select schedule</option>
            {SCHEDULE_TIMES.map((time) => (
              <option key={time.id} value={time.label}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        {/* Days Type */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Days Type <span className="text-primary-600">*</span>
          </label>
          <select
            value={daysType}
            onChange={(e) => setDaysType(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          >
            <option value="">Select days type</option>
            {DAYS_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Start Date <span className="text-primary-600">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              End Date <span className="text-primary-600">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label={subject ? 'Save Changes' : 'Add Subject'}
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Saving..."
          />
        </div>
      </form>
    </Modal>
  )
}

