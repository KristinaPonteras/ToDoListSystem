
import api from './api'

export interface Task {
    id: number
    user_id: number
    category_id: number | null
    title: string
    description: string | null
    due_date: string | null
    due_time: string | null
    priority: 'low' | 'medium' | 'high'
    status: 'pending' | 'completed'
    completed_at: string | null
    created_at: string
    updated_at: string
    category?: {
        id: number
        name: string
        color: string
    } | null
}

export interface TaskData {
    category_id: number | null
    title: string
    description: string
    due_date: string | null
    due_time: string | null
    priority: 'low' | 'medium' | 'high'
    status: 'pending' | 'completed'
}

interface TaskResponse {
    message?: string
    tasks?: Task[]
    task?: Task
}

export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get<TaskResponse>('/tasks')
    return response.data.tasks ?? []
}

export const getTask = async (id: number): Promise<Task> => {
    const response = await api.get<TaskResponse>(`/tasks/${id}`)
    return response.data.task!
}

export const createTask = async (data: TaskData): Promise<Task> => {
    const response = await api.post<TaskResponse>('/tasks', data)
    return response.data.task!
}

export const updateTask = async (
    id: number,
    data: TaskData,
): Promise<Task> => {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, data)
    return response.data.task!
}

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
}
