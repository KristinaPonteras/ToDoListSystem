
import { useEffect, useState } from 'react'
import {
    Bell,
    Menu,
    CheckCheck,
    ClipboardList,
    Check,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/SideBar'
import { getTasks } from '../services/task'
import type { Task } from '../services/task'
import axios from 'axios'

type Notification = {
    id: number
    title: string
    message: string
    time: string
    read: boolean
    type: 'reminder' | 'completed' | 'pending'
}

function NotificationsPage() {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadNotifications = async () => {
        try {
            setError('')

            const tasks: Task[] = await getTasks()
            const today = new Date()
            const todayString = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, '0'),
                String(today.getDate()).padStart(2, '0'),
            ].join('-')

            const generated: Notification[] = tasks
                .filter((task) => task.due_date || task.status === 'completed')
                .map((task) => {
                    const dueDate = task.due_date
                    const isCompleted = task.status === 'completed'
                    const isOverdue =
                        !isCompleted && !!dueDate && dueDate < todayString

                    let title = 'Task Reminder'
                    let message = `Remember to complete ${task.title}.`
                    let type: Notification['type'] = 'reminder'

                    if (isCompleted) {
                        title = 'Task Completed'
                        message = `You completed ${task.title}.`
                        type = 'completed'
                    } else if (isOverdue) {
                        title = 'Overdue Task'
                        message = `${task.title} was due on ${dueDate}.`
                        type = 'pending'
                    } else if (dueDate === todayString) {
                        title = 'Due Today'
                        message = `${task.title} is scheduled for today.`
                        type = 'reminder'
                    } else {
                        message = `${task.title} is scheduled for ${dueDate}.`
                    }

                    return {
                        id: task.id,
                        title,
                        message,
                        time: dueDate || 'No due date',
                        read: false,
                        type,
                    }
                })
                .sort((a, b) => b.time.localeCompare(a.time))

            setNotifications(generated)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your task activities.',
                )
            } else {
                setError('Unable to load your task activities.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadNotifications()
    }, [])

    const unreadCount = notifications.filter(
        (notification) => !notification.read,
    ).length

    const markAsRead = (id: number) => {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification,
            ),
        )
    }

    const markAllAsRead = () => {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true,
            })),
        )
    }

    return (
        <div className="flex min-h-screen bg-[#FAF8FC] text-gray-800">
            <Sidebar
                isOpen={mobileMenu}
                onClose={() => setMobileMenu(false)}
            />

            <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
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
                                Notifications
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Stay updated with your tasks and activities.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/dashboard"
                        className="rounded-xl bg-white p-3 text-gray-600 shadow-sm hover:bg-[#F0E7F8]"
                        aria-label="Dashboard"
                    >
                        <ClipboardList size={21} />
                    </Link>
                </header>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="mb-6 rounded-2xl bg-[#EDE1F6] p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white p-3 text-[#8955B5]">
                            <Bell size={25} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">
                                Unread Notifications
                            </p>
                            <h2 className="text-3xl font-bold text-[#8955B5]">
                                {loading ? '...' : unreadCount}
                            </h2>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold">
                                Recent Task Activities
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                You have {notifications.length} task activities.
                            </p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="flex items-center gap-2 rounded-xl border border-[#E9E0F0] px-3 py-2 text-sm font-medium text-[#8955B5] hover:bg-[#F5EFF9] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CheckCheck size={17} />
                            Mark all read
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center text-sm text-gray-400">
                            Loading task activities...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#DCCBEA] py-12 text-center">
                            <Bell
                                size={35}
                                className="mx-auto mb-3 text-[#B99BD2]"
                            />
                            <p className="font-medium text-gray-600">
                                No notifications
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Your task activities will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${notification.read
                                            ? 'border-[#F0EAF5] bg-white'
                                            : 'border-[#E5D4F2] bg-[#FBF8FE]'
                                        }`}
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="mt-1 rounded-full bg-[#F0E7F8] p-2 text-[#8955B5]">
                                            <Bell size={17} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {notification.title}
                                                </p>

                                                {!notification.read && (
                                                    <span className="h-2 w-2 rounded-full bg-[#8955B5]" />
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {notification.message}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-400">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>

                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="shrink-0 rounded-lg p-2 text-[#8955B5] hover:bg-[#F0E7F8]"
                                            title="Mark as read"
                                            aria-label="Mark as read"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default NotificationsPage
