import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { SCHEDULE_TIMES } from '@/constants/scheduleTimes'
import { type Teacher } from '@/services/teacherService'
import { useTeachers } from '@/hooks/useTeachers'
import { useCareers } from '@/hooks/useCareers'
import { subjectService, type Subject } from '@/services/subjectService'

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
      identity_card?: string
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
  subject_id?: string | number
}

interface SubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> | void
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
  // Form State
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

  // Subject Search/Create State
  const [subjectQuery, setSubjectQuery] = useState('')
  const [subjectResults, setSubjectResults] = useState<Subject[]>([])
  const [isSearchingSubject, setIsSearchingSubject] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isCreatingSubject, setIsCreatingSubject] = useState(false)
  const [selectedCareerId, setSelectedCareerId] = useState<string>('')

  // Hooks
  const { careers, isLoading: isLoadingCareers } = useCareers()
  const {
    searchQuery: teacherQuery,
    setSearchQuery: setTeacherQuery,
    searchResults: teacherResults,
    setSearchResults: setTeacherResults,
    isSearching: isSearchingTeacher,
    clearSearch: clearTeacherSearch
  } = useTeachers()

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const resetForm = () => {
    setSubjectQuery('')
    setSubjectResults([])
    setSelectedSubject(null)
    setIsCreatingSubject(false)
    setSelectedCareerId('')

    setTeacherId('')
    clearTeacherSearch()
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

  // Handle Subject Search
  useEffect(() => {
    const searchSubjects = async () => {
      if (!subjectQuery.trim() || selectedSubject) {
        setSubjectResults([])
        return
      }

      setIsSearchingSubject(true)
      try {
        const results = await subjectService.search(subjectQuery)
        setSubjectResults(results)
      } catch (err) {
        console.error('Error searching subjects:', err)
      } finally {
        setIsSearchingSubject(false)
      }
    }

    const timeoutId = setTimeout(searchSubjects, 300)
    return () => clearTimeout(timeoutId)
  }, [subjectQuery, selectedSubject])

  useEffect(() => {
    if (isOpen) {
      if (subject) {
        // Pre-fill existing assignment data
        // Note: 'subject' prop here is the Assignment data, which contains the subject info
        setSubjectQuery(subject.name)
        // We simulate a selected subject
        setSelectedSubject({ id: subject.subject_id || subject.id, name: subject.name } as Subject)

        // Teacher
        if (subject.teacher) {
          const teacherObj: Teacher = {
            id: Number(subject.teacher.id),
            person: {
              id: 0,
              first_name: subject.teacher.person.first_name,
              last_name: subject.teacher.person.last_name,
              identity_card: subject.teacher.person.identity_card || '',
            },
          } as unknown as Teacher
          setSelectedTeacher(teacherObj)
          setTeacherQuery(`${subject.teacher.person.first_name} ${subject.teacher.person.last_name}`)
          setTeacherId(String(subject.teacher.id))
        }

        // Classroom
        if (subject.classroom) {
          setClassroomId(String(subject.classroom.id))
        } else if (subject.classroom_id) {
          const foundClassroom = classrooms.find(c => String(c.id) === subject.classroom_id)
          setClassroomId(foundClassroom ? String(foundClassroom.id) : subject.classroom_id)
        }

        setSchedule(subject.schedule)
        setDaysType(subject.daysType)

        const formatDate = (dateString: string) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          return date.toISOString().split('T')[0]
        }

        setStartDate(formatDate(subject.startDate))
        setEndDate(formatDate(subject.endDate))

        try {
          if (typeof subject.requirements === 'string') {
            setRequirements(JSON.parse(subject.requirements))
          } else if (Array.isArray(subject.requirements)) {
            setRequirements(subject.requirements)
          } else {
            setRequirements([])
          }
        } catch {
          setRequirements([])
        }
      } else {
        resetForm()
      }
      setError(null)
    };
  }, [subject, isOpen, classrooms]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate Subject
    let finalSubjectId = selectedSubject?.id
    if (!finalSubjectId && !isCreatingSubject) {
      setError('Please select a subject or create a new one')
      return
    }
    if (isCreatingSubject && !selectedCareerId) {
      setError('Please select a career for the new subject')
      return
    }

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
      // Create subject if needed
      if (isCreatingSubject) {
        const newSubject = await subjectService.createSubject({
          name: subjectQuery.trim(),
          career_id: Number(selectedCareerId)
        })
        finalSubjectId = newSubject.id
      }

      await onSubmit({
        subject_id: Number(finalSubjectId),
        teacher_id: Number(finalTeacherId),
        classroom_id: Number(classroomId),
        schedule,
        day_type: daysType,
        start_date: startDate,
        end_date: endDate,
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
      title={subject ? 'Edit Subject Assignment' : 'Add Subject Assignment'}
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Subject Search/Create */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Subject <span className="text-primary-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={subjectQuery}
                onChange={(e) => {
                  setSubjectQuery(e.target.value)
                  setSelectedSubject(null)
                  setIsCreatingSubject(false)
                }}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                placeholder="Search subject..."
                autoComplete="off"
                disabled={!!subject} // Disable if editing assignment (usually we don't change subject of an assignment, but can be discussed)
              />
              {isSearchingSubject && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                </div>
              )}

              {/* Results Dropdown */}
              {!selectedSubject && subjectQuery && !isSearchingSubject && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-charcoal-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {subjectResults.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-charcoal-50 text-sm"
                      onClick={() => {
                        setSelectedSubject(s)
                        setSubjectQuery(s.name)
                        setSubjectResults([])
                        setIsCreatingSubject(false)
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                  {/* Create New Option */}
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-primary-50 text-sm text-primary-600 font-medium border-t border-charcoal-100"
                    onClick={() => {
                      setIsCreatingSubject(true)
                      setSelectedSubject(null)
                      setSubjectResults([])
                    }}
                  >
                    + Create "{subjectQuery}"
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Career Selection (Only if creating new subject) */}
          {isCreatingSubject && (
            <div className="md:col-span-2 bg-primary-50 p-4 rounded-xl border border-primary-100">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Select Career for New Subject <span className="text-primary-600">*</span>
              </label>
              {isLoadingCareers ? (
                <p className="text-sm text-charcoal-500">Loading careers...</p>
              ) : (
                <select
                  value={selectedCareerId}
                  onChange={(e) => setSelectedCareerId(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                  required
                >
                  <option value="">Select Career</option>
                  {careers.map((career) => (
                    <option key={career.id} value={career.id}>
                      {career.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

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
                  setSelectedTeacher(null)
                  setTeacherId('')
                }}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                placeholder="Search teacher..."
                autoComplete="off"
              />

              {isSearchingTeacher && !selectedTeacher && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                </div>
              )}

              {selectedTeacher && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeacher(null)
                    clearTeacherSearch()
                    setTeacherId('')
                  }}
                  className="absolute right-3 top-2.5 text-charcoal-400 hover:text-red-500 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {(teacherResults.length > 0 || (teacherQuery && !selectedTeacher && !isSearchingTeacher)) && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-charcoal-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {teacherResults.map((teacher) => (
                    <button
                      key={teacher.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-charcoal-50 text-sm"
                      onClick={() => {
                        setSelectedTeacher(teacher)
                        setTeacherResults([])
                        setTeacherQuery('')
                      }}
                    >
                      <div className="font-medium">{teacher.person?.first_name} {teacher.person?.last_name}</div>
                      <div className="text-xs text-charcoal-500">ID: {teacher.person?.identity_card}</div>
                    </button>
                  ))}
                  {teacherResults.length === 0 && teacherQuery && !isSearchingTeacher && (
                    <div className="px-4 py-2 text-sm text-charcoal-500">
                      No teachers found
                    </div>
                  )}
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
