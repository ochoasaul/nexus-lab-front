import api from '@/services/api'

export interface TeacherAttendance {
    id: number
    date: string
    entry_time: string
    exit_time?: string
    state: string
    subject_teacher_id: number
}

export interface DailySchedule {
    id: number
    start_date: string
    end_date: string
    day_type: string
    schedule: string
    teacher: {
        person: {
            first_name: string
            last_name: string
        }
    }
    subject: {
        name: string
    }
    attendance: TeacherAttendance | null
}

export const teacherAttendanceService = {
    getDailySchedule: async () => {
        const { data } = await api.get<DailySchedule[]>('/teacher-attendance-management/today')
        return data
    },

    registerEntry: async (subjectTeacherId: number) => {
        const { data } = await api.post('/teacher-attendance-management/entry', { subject_teacher_id: String(subjectTeacherId) })
        return data
    },

    registerExit: async (attendanceId: number) => {
        const { data } = await api.patch(`/teacher-attendance-management/exit/${attendanceId}`)
        return data
    }
}
