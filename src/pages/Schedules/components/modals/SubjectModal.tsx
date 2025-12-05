import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { SCHEDULE_TIMES } from '@/constants/scheduleTimes'
import { teacherService, type Teacher } from '@/services/teacherService'

interface Classroom {
  id: string | number
  name: string
}

interface SubjectData {
  id?: string | number
  name: string
  teacher: {
    id: string | number
    person: {
      first_name: string
      last_name: string
    }
  }
  teacher_id?: string
  classroom: {
    id: string | number
    name: string
  }
  classroom_id?: string
  schedule: string
  daysType: string
  startDate: string
  endDate: string
  state?: 'active' | 'inactive'
  requirements?: string
}

interface SubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
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
  const [teacherId, setTeacherId] = useState('')
  const [classroomId, setClassroomId] = useState<string>('')
  const [schedule, setSchedule] = useState<string>('')
  const [daysType, setDaysType] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [requirements, setRequirements] = useState<{ name: string; completed: boolean }[]>([])
  const [newRequirement, setNewRequirement] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Teacher Search State
  const [teacherQuery, setTeacherQuery] = useState('')
  const [teacherResults, setTeacherResults] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isSearchingTeacher, setIsSearchingTeacher] = useState(false)

  useEffect(() => {
    if (subject) {
      setName(subject.name)

      // Teacher
      if (subject.teacher) {
        setTeacherQuery(`${subject.teacher.person?.first_name} ${subject.teacher.person?.last_name}`)
        setTeacherId(String(subject.teacher.id))
        // We can set selectedTeacher if we want to preserve the object, 
        // but we need to match Teacher interface. 
        // The subject.teacher structure matches what we need for display.
        // We might need to cast or ensure types match.
        // For now, just setting query and ID is enough for the form logic (which uses teacherId or selectedTeacher.id)
      }

      // Classroom
      if (subject.classroom) {
        setClassroomId(String(subject.classroom.id))
      } else if (subject.classroom_id) {
        // Fallback if we only have ID
        const foundClassroom = classrooms.find(c => String(c.id) === subject.classroom_id)
        setClassroomId(foundClassroom ? String(foundClassroom.id) : subject.classroom_id)
      }

      setSchedule(subject.schedule)
      setDaysType(subject.daysType)
      setStartDate(subject.startDate)
      setEndDate(subject.endDate)
      try {
        setRequirements(subject.requirements ? JSON.parse(subject.requirements) : [])
      } catch {
        setRequirements([])
      }
    } else {
      resetForm()
    }
  }, [subject, isOpen, classrooms])

  // Teacher Search Effect
  useEffect(() => {
    if (!teacherQuery.trim() || selectedTeacher) {
      setTeacherResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsSearchingTeacher(true)
      try {
        const results = await teacherService.search(teacherQuery.trim(), 1, 10)
        setTeacherResults(results)
      } catch (err) {
        console.error('Error searching teachers:', err)
      } finally {
        setIsSearchingTeacher(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [teacherQuery, selectedTeacher])

  const resetForm = () => {
    setName('')
    setTeacherId('')
    setTeacherQuery('')
    setSelectedTeacher(null)
    setClassroomId('')
    setSchedule('')
    setDaysType('')
    setStartDate('')
    setEndDate('')
    setRequirements([])
    setNewRequirement('')
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Subject name is required')
      return
    }
    // For teacher, we need either selectedTeacher or teacherId (if editing and not changed)
    // But since we use search, we should enforce selection or valid ID.
    if (!selectedTeacher && !teacherId && !teacherQuery) {
      setError('Teacher is required')
      return
    }

    // If we have a query but no ID/Selection, it's invalid unless it matches existing.
    // Let's assume we need a valid ID.
    const finalTeacherId = selectedTeacher?.id || teacherId
    if (!finalTeacherId) {
      setError('Please select a valid teacher from the list')
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
        teacher_id: Number(finalTeacherId),
        classroom_id: Number(classroomId),
        schedule,
        daysType,
        startDate,
        endDate,
        requirements: JSON.stringify(requirements),
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Subject Name */}
          <div className="md:col-span-2">
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

          {/* Teacher Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Teacher <span className="text-primary-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedTeacher ? `${selectedTeacher.person?.first_name} ${selectedTeacher.person?.last_name}` : teacherQuery}
                onChange={(e) => {
                  setTeacherQuery(e.target.value)
                  setSelectedTeacher(null) // Clear selection on edit
                  setTeacherId('')
                }}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                placeholder="Search teacher..."
                autoComplete="off"
              />
              {isSearchingTeacher && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {teacherResults.length > 0 && !selectedTeacher && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-charcoal-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {teacherResults.map((teacher) => (
                    <button
                      key={teacher.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-charcoal-50 text-sm"
                      onClick={() => {
                        setSelectedTeacher(teacher)
                        setTeacherQuery(`${teacher.person?.first_name} ${teacher.person?.last_name}`)
                        setTeacherResults([])
                      }}
                    >
                      <div className="font-medium">{teacher.person?.first_name} {teacher.person?.last_name}</div>
                      <div className="text-xs text-charcoal-500">ID: {teacher.person?.identity_card}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
          <div className="md:col-span-2">
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

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Requirements
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              className="flex-1 rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              placeholder="Add requirement"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (newRequirement.trim()) {
                    setRequirements([...requirements, { name: newRequirement.trim(), completed: false }])
                    setNewRequirement('')
                  }
                }
              }}
            />
            <Button
              type="button"
              label="Add"
              variant="secondary"
              onClick={() => {
                if (newRequirement.trim()) {
                  setRequirements([...requirements, { name: newRequirement.trim(), completed: false }])
                  setNewRequirement('')
                }
              }}
              disabled={!newRequirement.trim()}
            />
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-charcoal-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {subject ? (
                    <input
                      type="checkbox"
                      checked={req.completed}
                      onChange={() => {
                        const newReqs = [...requirements]
                        newReqs[index].completed = !newReqs[index].completed
                        setRequirements(newReqs)
                      }}
                      className="w-4 h-4 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                    />
                  ) : null}
                  <span className={`text-sm ${req.completed ? 'text-charcoal-400 line-through' : 'text-charcoal-700'}`}>
                    {req.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequirements(requirements.filter((_, i) => i !== index))}
                  className="text-charcoal-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
            {requirements.length === 0 && (
              <p className="text-sm text-charcoal-400 text-center py-2">No requirements added</p>
            )}
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

