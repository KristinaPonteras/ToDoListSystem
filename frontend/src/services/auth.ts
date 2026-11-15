
import api from './api'

export interface User {
    id: number
    name: string
    email: string
}

interface AuthResponse {
    message: string
    user: User
    token: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    password_confirmation: string
}

export interface LoginData {
    email: string
    password: string
}

export interface ProfileData {
    name: string
    email: string
}

export interface PasswordData {
    current_password: string
    password: string
    password_confirmation: string
}

export const registerUser = async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/register', data)

    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('auth_user', JSON.stringify(response.data.user))

    return response.data
}

export const loginUser = async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/login', data)

    localStorage.setItem('auth_token', response.data.token)
    localStorage.setItem('auth_user', JSON.stringify(response.data.user))

    return response.data
}

export const logoutUser = async () => {
    try {
        await api.post('/logout')
    } finally {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
    }
}

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem('auth_user')

    return user ? JSON.parse(user) as User : null
}

export const updateProfile = async (data: ProfileData): Promise<User> => {
    const response = await api.put<{ message: string; user: User }>('/profile', data)

    localStorage.setItem('auth_user', JSON.stringify(response.data.user))

    return response.data.user
}

export const changePassword = async (data: PasswordData) => {
    const response = await api.put<{ message: string }>('/change-password', data)

    return response.data
}
