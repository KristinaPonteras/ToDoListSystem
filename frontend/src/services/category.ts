
import api from './api'

export interface Category {
    id: number
    user_id: number
    name: string
    description: string | null
    color: string
    created_at: string
    updated_at: string
}

export interface CategoryData {
    name: string
    description: string
    color: string
}

interface CategoryResponse {
    message?: string
    categories?: Category[]
    category?: Category
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<CategoryResponse>('/categories')
    return response.data.categories ?? []
}

export const createCategory = async (data: CategoryData) => {
    const response = await api.post<CategoryResponse>('/categories', data)
    return response.data.category!
}

export const updateCategory = async (
    id: number,
    data: CategoryData,
) => {
    const response = await api.put<CategoryResponse>(`/categories/${id}`, data)
    return response.data.category!
}

export const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`)
}
