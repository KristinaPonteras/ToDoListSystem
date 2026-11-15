
import api from './api'

export const requestPasswordReset = async (email: string) => {
    const response = await api.post('/forgot-password', {
        email,
    })

    return response.data
}

export const resetUserPassword = async (data: {
    token: string
    email: string
    password: string
    password_confirmation: string
}) => {
    const response = await api.post('/reset-password', data)

    return response.data
}
