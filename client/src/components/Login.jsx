import { useState } from 'react'
import { useApp } from '../context/AppContext'
import axios from 'axios'

const Login = () => {
  const { showLogin, setShowLogin, login } = useApp()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!showLogin) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin ? { email: form.email, password: form.password } : form
      const { data } = await axios.post(url, payload)
      if (data.success) {
        login(data.user, data.token)
        setShowLogin(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        ></button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isLogin ? 'Sign in to your account' : 'Join us to start renting cars'}
        </p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text" placeholder="Full Name" required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-borderColor rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            type="email" placeholder="Email address" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-borderColor rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password" placeholder="Password" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-borderColor rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
          />
          {!isLogin && (
            <select
              value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full border border-borderColor rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="user">User (Renter)</option>
              <option value="owner">Owner (List Cars)</option>
            </select>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dull text-white font-medium rounded-xl transition-all disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-primary font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
