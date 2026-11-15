
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import DashboardPage from '../pages/DashboardPage'
import AllTasksPage from '../pages/AllTasksPage'
import SchedulePage from '../pages/SchedulePage'
import NotificationsPage from '../pages/NotificationsPage'
import CategoriesPage from '../pages/CategoriesPage'
import SettingsPage from '../pages/SettingsPage'

import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public pages */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected pages */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tasks" element={<AllTasksPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes