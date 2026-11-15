
import { useState } from 'react'
import {
    Menu,
    Bell,
    User,
    Lock,
    Palette,
    Save,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/SideBar'
import {
    getCurrentUser,
    updateProfile,
    changePassword as changePasswordApi,
} from '../services/auth'

function SettingsPage() {
    const [mobileMenu, setMobileMenu] = useState(false)

    const currentUser = getCurrentUser()

    const [fullName, setFullName] = useState(currentUser?.name ?? '')
    const [email, setEmail] = useState(currentUser?.email ?? '')

    const [emailNotifications, setEmailNotifications] = useState(
        localStorage.getItem('email_notifications') !== 'false'
    )
    const [taskReminders, setTaskReminders] = useState(
        localStorage.getItem('task_reminders') !== 'false'
    )
    const [completionNotifications, setCompletionNotifications] = useState(
        localStorage.getItem('completion_notifications') !== 'false'
    )

    const [theme, setTheme] = useState(
        localStorage.getItem('app_theme') || 'Light'
    )

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const getErrorMessage = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const errors = error.response?.data?.errors

            if (errors) {
                return Object.values(errors).flat().join('\n')
            }

            return error.response?.data?.message || 'Something went wrong.'
        }

        return 'Something went wrong. Please try again.'
    }

    const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setProfileLoading(true)

        try {
            const updatedUser = await updateProfile({
                name: fullName.trim(),
                email: email.trim(),
            })

            setFullName(updatedUser.name)
            setEmail(updatedUser.email)

            window.alert('Your profile has been updated successfully.')
        } catch (error) {
            window.alert(getErrorMessage(error))
        } finally {
            setProfileLoading(false)
        }
    }

    const saveNotifications = () => {
        localStorage.setItem('email_notifications', String(emailNotifications))
        localStorage.setItem('task_reminders', String(taskReminders))
        localStorage.setItem(
            'completion_notifications',
            String(completionNotifications)
        )

        window.alert('Notification preferences saved successfully.')
    }

    const saveTheme = (selectedTheme: string) => {
        setTheme(selectedTheme)
        localStorage.setItem('app_theme', selectedTheme)
    }

    const changePassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        if (newPassword.length < 8) {
            window.alert('Your new password must be at least 8 characters.')
            return
        }

        if (newPassword !== confirmPassword) {
            window.alert('Your new passwords do not match.')
            return
        }

        setPasswordLoading(true)

        try {
            await changePasswordApi({
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            })

            window.alert('Your password has been changed successfully.')

            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            window.alert(getErrorMessage(error))
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#FAF8FC] text-gray-800">
            <Sidebar
                isOpen={mobileMenu}
                onClose={() => setMobileMenu(false)}
            />

            <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenu(true)}
                            className="rounded-lg p-2 hover:bg-[#F0E7F8] lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu size={23} />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Settings
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage your account and application preferences.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/notifications"
                        className="rounded-xl bg-white p-3 text-gray-600 shadow-sm hover:bg-[#F0E7F8]"
                        aria-label="Notifications"
                    >
                        <Bell size={21} />
                    </Link>
                </header>

                <div className="space-y-6">

                    {/* Profile Settings */}
                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-[#F0E7F8] p-3 text-[#8955B5]">
                                <User size={22} />
                            </div>
                            <div>
                                <h2 className="font-bold">Profile Information</h2>
                                <p className="text-sm text-gray-500">
                                    Update your personal information.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={saveProfile} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={17} />
                                    {profileLoading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Notification Settings */}
                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-[#F0E7F8] p-3 text-[#8955B5]">
                                <Bell size={22} />
                            </div>
                            <div>
                                <h2 className="font-bold">Notification Preferences</h2>
                                <p className="text-sm text-gray-500">
                                    Choose which notifications you want to receive.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="flex cursor-pointer items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Receive updates through email.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(event) =>
                                        setEmailNotifications(event.target.checked)
                                    }
                                    className="h-5 w-5 accent-[#8955B5]"
                                />
                            </label>

                            <div className="border-t border-[#F0EAF5]" />

                            <label className="flex cursor-pointer items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">Task Reminders</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Receive reminders about upcoming tasks.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={taskReminders}
                                    onChange={(event) =>
                                        setTaskReminders(event.target.checked)
                                    }
                                    className="h-5 w-5 accent-[#8955B5]"
                                />
                            </label>

                            <div className="border-t border-[#F0EAF5]" />

                            <label className="flex cursor-pointer items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">Completion Notifications</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Receive updates when tasks are completed.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={completionNotifications}
                                    onChange={(event) =>
                                        setCompletionNotifications(event.target.checked)
                                    }
                                    className="h-5 w-5 accent-[#8955B5]"
                                />
                            </label>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={saveNotifications}
                                    className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E]"
                                >
                                    <Save size={17} />
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Settings */}
                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-[#F0E7F8] p-3 text-[#8955B5]">
                                <Palette size={22} />
                            </div>
                            <div>
                                <h2 className="font-bold">Appearance</h2>
                                <p className="text-sm text-gray-500">
                                    Choose your preferred application theme.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Theme
                            </label>
                            <select
                                value={theme}
                                onChange={(event) => saveTheme(event.target.value)}
                                className="w-full rounded-xl border border-[#E9E0F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#8955B5] sm:max-w-xs"
                            >
                                <option value="Light">Light</option>
                                <option value="Dark">Dark (coming later)</option>
                                <option value="System">System Default (coming later)</option>
                            </select>
                        </div>
                    </section>

                    {/* Password Settings */}
                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-[#F0E7F8] p-3 text-[#8955B5]">
                                <Lock size={22} />
                            </div>
                            <div>
                                <h2 className="font-bold">Change Password</h2>
                                <p className="text-sm text-gray-500">
                                    Update your account password.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={changePassword} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                    placeholder="Enter current password"
                                    required
                                    className="w-full rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Lock size={17} />
                                    {passwordLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </section>

                </div>
            </main>
        </div>
    )
}

export default SettingsPage
