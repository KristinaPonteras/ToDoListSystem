
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import {
    ClipboardList,
    LockKeyhole,
    Eye,
    EyeOff,
    Heart,
} from 'lucide-react'
import { resetUserPassword } from '../services/passwordReset'

function ResetPasswordPage() {
    const [searchParams] = useSearchParams()

    const token = searchParams.get('token') || ''
    const emailFromLink = searchParams.get('email') || ''

    const [email, setEmail] = useState(emailFromLink)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')
        setSuccess('')

        if (!token) {
            setError('Invalid or missing password reset link.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            const response = await resetUserPassword({
                token,
                email,
                password,
                password_confirmation: confirmPassword,
            })

            setSuccess(
                response.message || 'Your password has been reset successfully.'
            )

            setPassword('')
            setConfirmPassword('')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errors = err.response?.data?.errors

                setError(
                    errors
                        ? Object.values(errors).flat().join(' ')
                        : err.response?.data?.message || 'Unable to reset your password.'
                )
            } else {
                setError('Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
            <section className="w-full max-w-md bg-[#F6EFFB] px-8 py-12 text-center sm:px-12">
                <div className="mb-8">
                    <div className="mb-2 flex justify-center">
                        <ClipboardList
                            size={54}
                            strokeWidth={1.8}
                            className="text-[#8955B5]"
                        />
                    </div>

                    <h1 className="font-serif text-3xl font-black italic text-black">
                        Reset Password <Heart className="inline" size={19} />
                    </h1>

                    <p className="mt-2 font-serif text-sm italic text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="mb-2 block text-sm text-gray-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-md bg-white px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-[#8955B5]"
                        />
                    </div>

                    <div className="flex items-center rounded-md bg-white px-3">
                        <LockKeyhole size={17} className="shrink-0 text-[#A56BCB]" />

                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="New Password"
                            minLength={8}
                            required
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
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
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Confirm New Password"
                            minLength={8}
                            required
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
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
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            <p>{success}</p>
                            <Link
                                to="/login"
                                className="mt-2 inline-block font-semibold underline"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !!success}
                        className="w-full rounded-md bg-[#8955B5] py-3 text-sm font-semibold text-white transition hover:bg-[#75439F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <p className="mt-5 text-xs text-gray-500">
                    Remember your password?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-[#8955B5] underline"
                    >
                        Back to Login
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default ResetPasswordPage
