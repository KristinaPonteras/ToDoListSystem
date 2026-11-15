
import { useEffect, useState } from 'react'
import {
    Bell,
    Menu,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    CalendarDays,
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

function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function SchedulePage() {
    const today = new Date()

    const [mobileMenu, setMobileMenu] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1),
    )
    const [selectedDate, setSelectedDate] = useState(formatDate(today))
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

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

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const calendarDays = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ]

    const selectedTasks = tasks.filter(
        (task) => task.due_date === selectedDate,
    )

    const changeMonth = (direction: number) => {
        setCurrentMonth(new Date(year, month + direction, 1))
    }

    const addTask = async () => {
        const title = window.prompt('Enter task title:')
        if (!title?.trim()) return

        try {
            setSaving(true)
            setError('')

            const data: TaskData = {
                title: title.trim(),
                description: '',
                category_id: null,
                due_date: selectedDate,
                due_time: '',
                priority: 'medium',
                status: 'pending',
            }

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

    const toggleTask = async (task: Task) => {
        try {
            setError('')

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
            setError('')
            await deleteTaskApi(id)
            await loadTasks()
        } catch {
            setError('Unable to delete the task. Please try again.')
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
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Schedule
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Plan and organize your tasks by date.
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

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    {currentMonth.toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Select a date to view your tasks.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="rounded-lg border border-[#E9E0F0] p-2 hover:bg-[#F5EFF9]"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft size={19} />
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentMonth(
                                            new Date(today.getFullYear(), today.getMonth(), 1),
                                        )
                                        setSelectedDate(formatDate(today))
                                    }}
                                    className="rounded-lg border border-[#E9E0F0] px-3 py-2 text-sm hover:bg-[#F5EFF9]"
                                >
                                    Today
                                </button>

                                <button
                                    onClick={() => changeMonth(1)}
                                    className="rounded-lg border border-[#E9E0F0] p-2 hover:bg-[#F5EFF9]"
                                    aria-label="Next month"
                                >
                                    <ChevronRight size={19} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-3 grid grid-cols-7 text-center">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                                (day) => (
                                    <div
                                        key={day}
                                        className="py-2 text-xs font-semibold text-gray-400"
                                    >
                                        {day}
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} />
                                }

                                const dateString = formatDate(
                                    new Date(year, month, day),
                                )

                                const isSelected = selectedDate === dateString
                                const isToday = formatDate(today) === dateString
                                const hasTasks = tasks.some(
                                    (task) => task.due_date === dateString,
                                )

                                return (
                                    <button
                                        key={dateString}
                                        onClick={() => setSelectedDate(dateString)}
                                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${isSelected
                                                ? 'bg-[#8955B5] font-bold text-white'
                                                : isToday
                                                    ? 'border border-[#8955B5] font-semibold text-[#8955B5]'
                                                    : 'text-gray-700 hover:bg-[#F0E7F8]'
                                            }`}
                                    >
                                        {day}
                                        {hasTasks && (
                                            <span
                                                className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#8955B5]'
                                                    }`}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays
                                        size={19}
                                        className="text-[#8955B5]"
                                    />
                                    <h2 className="font-bold">Selected Date</h2>
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                                        'en-US',
                                        {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        },
                                    )}
                                </p>
                            </div>

                            <button
                                onClick={addTask}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E] disabled:opacity-60"
                            >
                                <Plus size={17} />
                                {saving ? 'Adding...' : 'Add Task'}
                            </button>
                        </div>

                        {loading ? (
                            <div className="py-12 text-center text-sm text-gray-400">
                                Loading your tasks...
                            </div>
                        ) : selectedTasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[#DCCBEA] py-12 text-center">
                                <CalendarDays
                                    size={34}
                                    className="mx-auto mb-3 text-[#B99BD2]"
                                />
                                <p className="font-medium text-gray-600">
                                    No tasks scheduled
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Add a task for this date.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedTasks.map((task) => (
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
                                                    className={`break-words text-sm font-semibold ${task.status === 'completed'
                                                            ? 'text-gray-400 line-through'
                                                            : 'text-gray-700'
                                                        }`}
                                                >
                                                    {task.title}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    {task.category?.name || 'Others'}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                            aria-label="Delete task"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}

export default SchedulePage
