
import {
    ClipboardList,
    LayoutDashboard,
    CalendarDays,
    Bell,
    Tags,
    Settings,
    LogOut,
    X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/auth'

type SidebarProps = {
    isOpen?: boolean
    onClose?: () => void
}

function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const navigate = useNavigate()

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'All Tasks', path: '/tasks', icon: ClipboardList },
        { name: 'Schedule', path: '/schedule', icon: CalendarDays },
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Categories', path: '/categories', icon: Tags },
        { name: 'Settings', path: '/settings', icon: Settings },
    ]

    const handleLogout = async () => {
        await logoutUser()
        onClose?.()
        navigate('/login', { replace: true })
    }

    return (
        <>
            {isOpen && (
                <button
                    onClick={onClose}
                    className="fixed inset-0 z-20 bg-black/30 lg:hidden"
                    aria-label="Close sidebar"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#F0E7F8] p-6 transition-transform lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="text-[#8955B5]" size={30} />
                        <span className="font-serif text-xl font-bold italic">
                            To Do List
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Menu
                </p>

                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive
                                        ? 'bg-[#8955B5] font-semibold text-white'
                                        : 'text-gray-600 hover:bg-white'
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {item.name}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="mt-6 border-t border-[#E2D4ED] pt-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-white"
                    >
                        <LogOut size={19} />
                        Log out
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
