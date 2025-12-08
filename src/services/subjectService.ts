import api from './api'

export interface Subject {
    id: number | string
    name: string
    teacher: {
        id: number | string
        person: {
            first_name: string
            last_name: string
        }
    }
    classroom: {
        id: number | string
        name: string
    }
    schedule: string
    daysType: string
    startDate: string
    endDate: string
    state?: 'active' | 'inactive'
    requirements?: string
    student_count?: number
}

export interface CreateSubjectDto extends Omit<Subject, 'id' | 'state'> { }
export interface UpdateSubjectDto extends Partial<Omit<Subject, 'id'>> { }

export const subjectService = {
    getAll: async (): Promise<Subject[]> => {
        const response = await api.get('/course-assignment-management/active')
        return response.data.map((item: any) => ({
            ...item,
            name: item.subject?.name || 'Sin nombre',
            daysType: item.day_type,
            startDate: item.start_date,
            endDate: item.end_date,
        }))
    },

    getById: async (id: number | string): Promise<Subject> => {
        // This endpoint might not exist yet for assignment, but for now we are not using it in the list view.
        // If needed, we should implement getAssignmentById in backend.
        // For now, let's leave it as is or assume we fetch all.
        const response = await api.get(`/course-assignment-management/${id}`)
        return response.data
    },

    create: async (data: CreateSubjectDto): Promise<Subject> => {
        const response = await api.post('/course-assignment-management', data)
        return response.data
    },

    update: async (id: number | string, data: UpdateSubjectDto): Promise<Subject> => {
        const response = await api.patch(`/course-assignment-management/${id}`, data)
        return response.data
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/course-assignment-management/${id}`)
    },

    search: async (query: string): Promise<Subject[]> => {
        const response = await api.get(`/subject/search`, { params: { q: query } })
        return response.data
    },

    createSubject: async (data: { name: string, career_id?: number }): Promise<Subject> => {
        const response = await api.post('/subject', data)
        return response.data
    },

    importAssignments: async (data: any[]): Promise<{ created: number, errors: any[], incompleteTeachers: any[] }> => {
        const response = await api.post('/course-assignment-management/import', data)
        return response.data
    }
}
