
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    ClipboardList,
    Mail,
    Heart,
} from 'lucide-react'
import { requestPasswordReset } from '../services/passwordReset'

function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        setLoading(true)
        setMessage('')
        setError('')

        try {
            const response = await requestPasswordReset(email)

            setMessage(response.message || 'Password reset link requested. Check your email.')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errors = err.response?.data?.errors

                setError(
                    errors
                        ? Object.values(errors).flat().join(' ')
                        : err.response?.data?.message || 'Unable to request a password reset.'
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
                        Enter your email to reset password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="text-left">
                        <label className="mb-2 block text-sm text-gray-700">
                            Email Address
                        </label>

                        <div className="flex items-center rounded-md bg-white px-3">
                            <Mail size={17} className="shrink-0 text-[#A56BCB]" />

                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-[#8955B5] py-3 text-sm font-semibold text-white transition hover:bg-[#75439F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>

                <p className="mt-5 text-xs text-gray-500">
                    Remember your password?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-[#8955B5] underline"
                    >
                        Sign in
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default ForgotPasswordPage
