
import { useEffect, useState } from 'react'
import {
    Bell,
    CheckCircle2,
    Clock,
    Menu,
    Plus,
    Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/SideBar'
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask as deleteTaskApi,
} from '../services/task'
import type { Task, TaskData } from '../services/task'
import axios from 'axios'

function DashboardPage() {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const today = new Date().toISOString().split('T')[0]

    const loadTasks = async () => {
        try {
            setError('')
            const data = await getTasks()
            setTasks(data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your tasks. Please try again.',
                )
            } else {
                setError('Unable to load your tasks.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const completedTasks = tasks.filter(
        (task) => task.status === 'completed',
    ).length

    const pendingTasks = tasks.filter(
        (task) => task.status === 'pending',
    ).length

    const todaysTasks = tasks.filter(
        (task) => task.due_date === today,
    )

    const toggleTask = async (task: Task) => {
        try {
            const data: TaskData = {
                title: task.title,
                description: task.description || '',
                category_id: task.category_id,
                due_date: task.due_date || '',
                due_time: task.due_time || '',
                priority: task.priority,
                status: task.status === 'completed' ? 'pending' : 'completed',
            }

            await updateTask(task.id, data)
            await loadTasks()
        } catch {
            setError('Unable to update the task. Please try again.')
        }
    }

    const deleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return
        }

        try {
            await deleteTaskApi(id)
            await loadTasks()
        } catch {
            setError('Unable to delete the task. Please try again.')
        }
    }

    const addTask = async () => {
        const title = window.prompt('Enter your new task:')

        if (!title?.trim()) return

        const data: TaskData = {
            title: title.trim(),
            description: '',
            category_id: null,
            due_date: today,
            due_time: '',
            priority: 'medium',
            status: 'pending',
        }

        try {
            setSaving(true)
            setError('')
            await createTask(data)
            await loadTasks()
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    'Unable to create the task. Please try again.',
                )
            } else {
                setError('Unable to create the task.')
            }
        } finally {
            setSaving(false)
        }
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
                            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                                Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Here's what's happening with your tasks today.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/notifications"
                        className="rounded-xl bg-white p-3 text-gray-600 shadow-sm transition hover:bg-[#F0E7F8]"
                        aria-label="Notifications"
                    >
                        <Bell size={21} />
                    </Link>
                </header>

                <section className="mb-8 rounded-2xl bg-[#EDE1F6] p-6 sm:p-8">
                    <p className="mb-2 text-sm font-medium text-[#8955B5]">
                        SMALL STEPS, BIG PROGRESS
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome back!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Stay organized and make today productive.
                    </p>
                </section>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500">Total Tasks</p>
                            <div className="rounded-xl bg-[#F0E7F8] p-3 text-[#8955B5]">
                                <CheckCircle2 size={21} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">
                            {loading ? '...' : tasks.length}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500">Pending Tasks</p>
                            <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                                <Clock size={21} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">
                            {loading ? '...' : pendingTasks}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-gray-500">Completed Tasks</p>
                            <div className="rounded-xl bg-green-50 p-3 text-green-600">
                                <CheckCircle2 size={21} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">
                            {loading ? '...' : completedTasks}
                        </p>
                    </div>
                </section>

                <section className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold">Today's Tasks</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Keep track of what you need to accomplish.
                            </p>
                        </div>

                        <button
                            onClick={addTask}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#75449E] disabled:opacity-60"
                        >
                            <Plus size={18} />
                            {saving ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-10 text-center text-sm text-gray-400">
                            Loading your tasks...
                        </div>
                    ) : todaysTasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#DCCBEA] py-10 text-center">
                            <p className="font-medium text-gray-600">
                                No tasks scheduled for today
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Add a task to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {todaysTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#F0EAF5] p-4"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => toggleTask(task)}
                                            className="h-5 w-5 accent-[#8955B5]"
                                        />

                                        <div className="min-w-0">
                                            <p
                                                className={`truncate text-sm font-semibold ${task.status === 'completed'
                                                        ? 'text-gray-400 line-through'
                                                        : 'text-gray-700'
                                                    }`}
                                            >
                                                {task.title}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {task.category?.name || 'Others'}
                                                {' · '}
                                                {task.due_time || 'No time set'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                        aria-label="Delete task"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Link
                        to="/tasks"
                        className="mt-5 inline-block text-sm font-semibold text-[#8955B5] hover:underline"
                    >
                        View all tasks →
                    </Link>
                </section>
            </main>
        </div>
    )
}

export default DashboardPage
