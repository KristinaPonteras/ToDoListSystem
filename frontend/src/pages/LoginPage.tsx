
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ClipboardList,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    Heart,
} from 'lucide-react'
import { loginUser } from '../services/auth'
import axios from 'axios'

function LoginPage() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        try {
            setLoading(true)

            await loginUser({
                email,
                password,
            })

            navigate('/dashboard')
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    'Invalid email or password. Please try again.'
                )
            } else {
                setError('Unable to connect to the server.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
            <section className="w-full max-w-md bg-[#F6EFFB] px-8 py-10 text-center sm:px-12">
                <div className="mb-7">
                    <div className="mb-2 flex justify-center">
                        <ClipboardList
                            size={54}
                            strokeWidth={1.8}
                            className="text-[#8955B5]"
                        />
                    </div>

                    <h1 className="font-serif text-3xl font-black italic text-black">
                        To Do List <Heart className="inline" size={19} />
                    </h1>

                    <p className="font-serif text-xs font-semibold italic text-gray-600">
                        small steps, big progress
                    </p>
                </div>

                <div className="mb-7">
                    <h2 className="font-serif text-xl font-bold italic text-gray-800">
                        Welcome,
                    </h2>
                    <p className="font-serif text-lg font-bold italic text-gray-800">
                        Let's get things done!
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="flex items-center rounded-md bg-white px-3">
                        <Mail size={17} className="shrink-0 text-[#A56BCB]" />
                        <input
                            type="email"
                            placeholder="Username or Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div className="flex items-center rounded-md bg-white px-3">
                        <LockKeyhole size={17} className="shrink-0 text-[#A56BCB]" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full bg-transparent px-3 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#8955B5]"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>

                    {error && (
                        <p className="rounded-md bg-red-100 px-3 py-2 text-left text-xs text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-[#8955B5] py-3 text-sm font-semibold text-white transition hover:bg-[#75439F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <div className="mt-4 space-y-4 text-xs">
                    <Link
                        to="/forgot-password"
                        className="block text-gray-500 underline hover:text-[#8955B5]"
                    >
                        Forgot Password?
                    </Link>

                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[#8955B5] underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default LoginPage
