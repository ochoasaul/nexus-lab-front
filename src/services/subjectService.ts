import api from './api'

export interface Subject {
    id: number | string
    name: string
    teacher: string
    classroom: string
    schedule: string
    daysType: string
    startDate: string
    endDate: string
    state?: 'active' | 'inactive'
    requirements?: string
}

export interface CreateSubjectDto extends Omit<Subject, 'id' | 'state'> { }
export interface UpdateSubjectDto extends Partial<Omit<Subject, 'id'>> { }

export const subjectService = {
    getAll: async (): Promise<Subject[]> => {
        const response = await api.get('/subject/assignment/all')
        return response.data
    },

    getById: async (id: number | string): Promise<Subject> => {
        // This endpoint might not exist yet for assignment, but for now we are not using it in the list view.
        // If needed, we should implement getAssignmentById in backend.
        // For now, let's leave it as is or assume we fetch all.
        const response = await api.get(`/subject/${id}`)
        return response.data
    },

    create: async (data: CreateSubjectDto): Promise<Subject> => {
        const response = await api.post('/subject/assignment', data)
        return response.data
    },

    update: async (id: number | string, data: UpdateSubjectDto): Promise<Subject> => {
        const response = await api.patch(`/subject/assignment/${id}`, data)
        return response.data
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/subject/${id}`)
    }
}
