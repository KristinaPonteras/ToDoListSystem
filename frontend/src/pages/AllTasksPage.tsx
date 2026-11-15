
import { useEffect, useState, type FormEvent } from 'react'
import {
    Bell,
    Menu,
    Plus,
    Search,
    Trash2,
    ClipboardList,
    Pencil,
    X,
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
import { getCategories } from '../services/category'
import type { Category } from '../services/category'
import axios from 'axios'

function AllTasksPage() {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const [tasks, setTasks] = useState<Task[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [dueTime, setDueTime] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [formError, setFormError] = useState('')

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')

            const [taskData, categoryData] = await Promise.all([
                getTasks(),
                getCategories(),
            ])

            setTasks(taskData)
            setCategories(categoryData)
        } catch {
            setError(
                'Unable to load your tasks. Please check your connection and log in again.',
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setCategoryId('')
        setDueDate('')
        setDueTime('')
        setPriority('medium')
        setEditingId(null)
        setFormError('')
        setShowModal(false)
    }

    const openAddModal = () => {
        resetForm()
        setShowModal(true)
    }

    const openEditModal = (task: Task) => {
        setEditingId(task.id)
        setTitle(task.title)
        setDescription(task.description || '')
        setCategoryId(task.category_id?.toString() || '')
        setDueDate(task.due_date || '')
        setDueTime(task.due_time || '')
        setPriority(task.priority)
        setFormError('')
        setShowModal(true)
    }

    const saveTask = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!title.trim()) {
            setFormError('Please enter a task title.')
            return
        }

        try {
            setSaving(true)
            setFormError('')

            const taskData: TaskData = {
                title: title.trim(),
                description: description.trim(),
                category_id: categoryId ? Number(categoryId) : null,
                due_date: dueDate || null,
                due_time: dueTime || null,
                priority,
                status:
                    editingId !== null
                        ? tasks.find((task) => task.id === editingId)?.status || 'pending'
                        : 'pending',
            }

            if (editingId !== null) {
                await updateTask(editingId, taskData)
            } else {
                await createTask(taskData)
            }

            resetForm()
            await loadData()
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const validationErrors = err.response?.data?.errors
                const firstError = validationErrors
                    ? Object.values(validationErrors).flat()[0]
                    : null

                setFormError(
                    typeof firstError === 'string'
                        ? firstError
                        : err.response?.data?.message || 'Unable to save task.',
                )
            } else {
                setFormError('Something went wrong. Please try again.')
            }
        } finally {
            setSaving(false)
        }
    }

    const toggleTask = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'

        const taskData: TaskData = {
            title: task.title,
            description: task.description || '',
            category_id: task.category_id,
            due_date: task.due_date,
            due_time: task.due_time,
            priority: task.priority,
            status: newStatus,
        }

        try {
            await updateTask(task.id, taskData)

            setTasks((previous) =>
                previous.map((item) =>
                    item.id === task.id
                        ? { ...item, status: newStatus }
                        : item,
                ),
            )
        } catch {
            window.alert('Unable to update task status. Please try again.')
        }
    }

    const deleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return
        }

        try {
            await deleteTaskApi(id)
            setTasks((previous) => previous.filter((task) => task.id !== id))
        } catch {
            window.alert('Unable to delete task. Please try again.')
        }
    }

    const filteredTasks = tasks.filter((task) => {
        const categoryName =
            task.category?.name ||
            categories.find((category) => category.id === task.category_id)?.name ||
            ''

        const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            categoryName.toLowerCase().includes(search.toLowerCase()) ||
            (task.description || '').toLowerCase().includes(search.toLowerCase())

        const matchesFilter =
            filter === 'All' ||
            (filter === 'Pending' && task.status === 'pending') ||
            (filter === 'Completed' && task.status === 'completed')

        return matchesSearch && matchesFilter
    })

    const pendingCount = tasks.filter(
        (task) => task.status === 'pending',
    ).length

    const completedCount = tasks.filter(
        (task) => task.status === 'completed',
    ).length

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
                                All Tasks
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage and organize all your tasks.
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

                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total Tasks</p>
                        <p className="mt-2 text-2xl font-bold">{tasks.length}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="mt-2 text-2xl font-bold">{pendingCount}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="mt-2 text-2xl font-bold">{completedCount}</p>
                    </div>
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold">My Tasks</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Your personal task list.
                            </p>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E]"
                        >
                            <Plus size={18} />
                            Add Task
                        </button>
                    </div>

                    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search tasks..."
                                className="w-full rounded-xl border border-[#E9E0F0] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8955B5]"
                            />
                        </div>

                        <select
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                            className="rounded-xl border border-[#E9E0F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                        >
                            <option value="All">All Tasks</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {loading ? (
                        <p className="py-12 text-center text-sm text-gray-400">
                            Loading tasks...
                        </p>
                    ) : error ? (
                        <div className="py-10 text-center">
                            <p className="text-sm text-red-500">{error}</p>
                            <button
                                onClick={loadData}
                                className="mt-3 rounded-xl bg-[#8955B5] px-4 py-2 text-sm text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-[#DCCBEA] py-12 text-center">
                                    <ClipboardList
                                        size={35}
                                        className="mx-auto mb-3 text-[#B99BD2]"
                                    />
                                    <p className="font-medium text-gray-600">
                                        No tasks found
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Try another search or add a new task.
                                    </p>
                                </div>
                            ) : (
                                filteredTasks.map((task) => {
                                    const categoryName =
                                        task.category?.name ||
                                        categories.find(
                                            (category) =>
                                                category.id === task.category_id,
                                        )?.name ||
                                        'Others'

                                    return (
                                        <div
                                            key={task.id}
                                            className="flex items-start justify-between gap-3 rounded-xl border border-[#F0EAF5] p-4"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => toggleTask(task)}
                                                    className="mt-1 h-5 w-5 accent-[#8955B5]"
                                                    aria-label={`Mark ${task.title} as ${task.status === 'completed'
                                                            ? 'pending'
                                                            : 'completed'
                                                        }`}
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

                                                    {task.description && (
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                        <span className="rounded-full bg-[#F4EDF9] px-3 py-1 text-[#8955B5]">
                                                            {categoryName}
                                                        </span>

                                                        {task.due_date && (
                                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500">
                                                                Due: {task.due_date}
                                                            </span>
                                                        )}

                                                        <span className="rounded-full bg-gray-100 px-3 py-1 capitalize text-gray-500">
                                                            {task.priority} priority
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-1">
                                                <button
                                                    onClick={() => openEditModal(task)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-[#F0E7F8] hover:text-[#8955B5]"
                                                    aria-label={`Edit ${task.title}`}
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                                    aria-label={`Delete ${task.title}`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </section>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
                    <div className="my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingId !== null ? 'Edit Task' : 'Add Task'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter your task information.
                                </p>
                            </div>

                            <button
                                onClick={resetForm}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveTask} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="Enter task title"
                                    required
                                    className="w-full rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    placeholder="Enter task description"
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(event) => setCategoryId(event.target.value)}
                                    className="w-full rounded-xl border border-[#E9E0F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                >
                                    <option value="">No category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(event) => setDueDate(event.target.value)}
                                        className="w-full rounded-xl border border-[#E9E0F0] px-3 py-3 text-sm outline-none focus:border-[#8955B5]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Due Time
                                    </label>
                                    <input
                                        type="time"
                                        value={dueTime}
                                        onChange={(event) => setDueTime(event.target.value)}
                                        className="w-full rounded-xl border border-[#E9E0F0] px-3 py-3 text-sm outline-none focus:border-[#8955B5]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Priority
                                </label>
                                <select
                                    value={priority}
                                    onChange={(event) =>
                                        setPriority(
                                            event.target.value as 'low' | 'medium' | 'high',
                                        )
                                    }
                                    className="w-full rounded-xl border border-[#E9E0F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {formError && (
                                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                                    {formError}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-[#E9E0F0] px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[#8955B5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? 'Saving...'
                                        : editingId !== null
                                            ? 'Save Changes'
                                            : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllTasksPage
