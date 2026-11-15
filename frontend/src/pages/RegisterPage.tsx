
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ClipboardList,
    User,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    Heart,
} from 'lucide-react'
import { registerUser } from '../services/auth'
import axios from 'axios'

function RegisterPage() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        try {
            setLoading(true)

            const response = await registerUser({
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            })

            setSuccess(response.message)

            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errors = err.response?.data?.errors

                if (errors) {
                    const firstError = Object.values(errors).flat()[0]
                    setError(String(firstError))
                } else {
                    setError(
                        err.response?.data?.message ||
                        'Registration failed. Please try again.'
                    )
                }
            } else {
                setError('Unable to connect to the server.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
            <section className="w-full max-w-md bg-[#F6EFFB] px-8 py-8 text-center sm:px-12">

                <div className="mb-5">
                    <div className="mb-2 flex justify-center">
                        <ClipboardList
                            size={50}
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

                <div className="mb-5">
                    <h2 className="font-serif text-xl font-bold italic text-gray-800">
                        Create an Account ♡
                    </h2>
                    <p className="font-serif text-sm italic text-gray-600">
                        Fill in the details below to get started!
                    </p>
                </div>

                <form className="space-y-3" onSubmit={handleRegister}>
                    <div className="flex items-center rounded-md bg-white px-3">
                        <User size={17} className="shrink-0 text-[#A56BCB]" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div className="flex items-center rounded-md bg-white px-3">
                        <Mail size={17} className="shrink-0 text-[#A56BCB]" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
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
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#8955B5]"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>

                    <div className="flex items-center rounded-md bg-white px-3">
                        <LockKeyhole size={17} className="shrink-0 text-[#A56BCB]" />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-[#8955B5]"
                            aria-label="Toggle confirm password visibility"
                        >
                            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>

                    {error && (
                        <p className="rounded-md bg-red-100 px-3 py-2 text-left text-xs text-red-600">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="rounded-md bg-green-100 px-3 py-2 text-left text-xs text-green-700">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-[#8955B5] py-3 text-sm font-semibold text-white transition hover:bg-[#75439F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#DCCCEB]" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="h-px flex-1 bg-[#DCCCEB]" />
                </div>

                <p className="text-xs text-gray-500">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-[#8955B5] underline"
                    >
                        Log in
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default RegisterPage