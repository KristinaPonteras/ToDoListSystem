
import { useEffect, useState, type FormEvent } from 'react'
import {
    Menu,
    Bell,
    Plus,
    Pencil,
    Trash2,
    Tags,
    X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/SideBar'
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory as deleteCategoryApi,
} from '../services/category'
import type { Category } from '../services/category'
import axios from 'axios'

function CategoriesPage() {
    const [mobileMenu, setMobileMenu] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState('#8955B5')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const loadCategories = async () => {
        try {
            setLoading(true)
            const data = await getCategories()
            setCategories(data)
            setError('')
        } catch {
            setError(
                'Unable to load categories. Please check your connection and log in again.',
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const resetForm = () => {
        setName('')
        setDescription('')
        setColor('#8955B5')
        setEditingId(null)
        setError('')
        setShowModal(false)
    }

    const openAddModal = () => {
        setName('')
        setDescription('')
        setColor('#8955B5')
        setEditingId(null)
        setError('')
        setShowModal(true)
    }

    const openEditModal = (category: Category) => {
        setEditingId(category.id)
        setName(category.name)
        setDescription(category.description || '')
        setColor(category.color)
        setError('')
        setShowModal(true)
    }

    const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!name.trim()) {
            setError('Please enter a category name.')
            return
        }

        const duplicate = categories.some(
            (category) =>
                category.name.toLowerCase() === name.trim().toLowerCase() &&
                category.id !== editingId,
        )

        if (duplicate) {
            setError('This category already exists.')
            return
        }

        try {
            setSaving(true)
            setError('')

            const categoryData = {
                name: name.trim(),
                description: description.trim(),
                color,
            }

            if (editingId !== null) {
                await updateCategory(editingId, categoryData)
            } else {
                await createCategory(categoryData)
            }

            resetForm()
            await loadCategories()
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const validationErrors = err.response?.data?.errors
                const firstError = validationErrors
                    ? Object.values(validationErrors).flat()[0]
                    : null

                setError(
                    typeof firstError === 'string'
                        ? firstError
                        : err.response?.data?.message ||
                        'Unable to save category.',
                )
            } else {
                setError('Something went wrong. Please try again.')
            }
        } finally {
            setSaving(false)
        }
    }

    const deleteCategory = async (id: number) => {
        if (
            !window.confirm(
                'Are you sure you want to delete this category?',
            )
        ) {
            return
        }

        try {
            await deleteCategoryApi(id)

            setCategories((previous) =>
                previous.filter((category) => category.id !== id),
            )
        } catch {
            window.alert(
                'Unable to delete category. Please try again.',
            )
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
                                Categories
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Organize your tasks into different categories.
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

                <section className="mb-6 rounded-2xl bg-[#EDE1F6] p-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white p-3 text-[#8955B5]">
                            <Tags size={25} />
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">
                                Total Categories
                            </p>
                            <h2 className="text-3xl font-bold text-[#8955B5]">
                                {categories.length}
                            </h2>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold">
                                My Categories
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Create and manage your task categories.
                            </p>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 rounded-xl bg-[#8955B5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#75449E]"
                        >
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>

                    {loading ? (
                        <p className="py-12 text-center text-sm text-gray-400">
                            Loading categories...
                        </p>
                    ) : error && categories.length === 0 ? (
                        <div className="py-10 text-center">
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                            <button
                                onClick={loadCategories}
                                className="mt-3 rounded-xl bg-[#8955B5] px-4 py-2 text-sm text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#DCCBEA] py-12 text-center">
                            <Tags
                                size={35}
                                className="mx-auto mb-3 text-[#B99BD2]"
                            />
                            <p className="font-medium text-gray-600">
                                No categories yet
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Create a category to organize your tasks.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="rounded-2xl border border-[#F0EAF5] p-5 transition hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div
                                                className="rounded-xl p-3"
                                                style={{
                                                    backgroundColor: `${category.color}20`,
                                                    color: category.color,
                                                }}
                                            >
                                                <Tags size={22} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="break-words font-bold text-gray-800">
                                                    {category.name}
                                                </h3>
                                                <p className="mt-1 break-words text-sm text-gray-500">
                                                    {category.description ||
                                                        'No description provided.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                onClick={() =>
                                                    openEditModal(category)
                                                }
                                                className="rounded-lg p-2 text-gray-400 hover:bg-[#F0E7F8] hover:text-[#8955B5]"
                                                aria-label={`Edit ${category.name}`}
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteCategory(category.id)
                                                }
                                                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                                aria-label={`Delete ${category.name}`}
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                        />
                                        <span className="text-xs text-gray-400">
                                            Category color
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingId !== null
                                        ? 'Edit Category'
                                        : 'Add Category'}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter your category information.
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

                        <form
                            onSubmit={saveCategory}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter category name"
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
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Enter category description"
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-[#E9E0F0] px-4 py-3 text-sm outline-none focus:border-[#8955B5]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(event) =>
                                            setColor(event.target.value)
                                        }
                                        className="h-10 w-14 cursor-pointer rounded-lg border border-[#E9E0F0] bg-white p-1"
                                    />
                                    <span className="text-sm text-gray-500">
                                        {color}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                                    {error}
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
                                            : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoriesPage
