import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import axios from 'axios'

// Generic user icon SVG — no face, just a silhouette
const UserIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#E2E8F0" />
    <circle cx="32" cy="24" r="10" fill="#94A3B8" />
    <path d="M12 52c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#94A3B8" />
  </svg>
)

const Profile = () => {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
  const [nameMsg, setNameMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  if (!user) return <Navigate to="/" replace />

  const handleNameUpdate = async (e) => {
    e.preventDefault()
    setNameLoading(true)
    setNameMsg('')
    try {
      const { data } = await axios.put('/api/auth/profile', { name: nameForm.name })
      if (data.success) setNameMsg('Name updated successfully!')
      else setNameMsg(data.message || 'Update failed')
    } catch {
      setNameMsg('Failed to update. Try again.')
    } finally {
      setNameLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setPwMsg('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg('New passwords do not match')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg('Password must be at least 6 characters')
      return
    }
    setPwLoading(true)
    try {
      const { data } = await axios.put('/api/auth/reset-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      if (data.success) {
        setPwMsg('Password changed successfully!')
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setPwMsg(data.message || 'Failed to change password')
      }
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const inputCls = 'w-full border border-borderColor rounded-xl px-4 py-3 text-sm outline-none focus:border-primary'

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 min-h-screen bg-light">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">My Profile</h1>
          <p className="text-gray-400 text-sm">Manage your account settings</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-borderColor p-8">
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-borderColor">
            <UserIcon className="w-20 h-20 rounded-full shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <span className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-medium capitalize ${
                user.role === 'owner' ? 'bg-blue-50 text-primary' : 'bg-green-50 text-green-600'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Update name */}
          <form onSubmit={handleNameUpdate} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Personal Information</h3>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
              <input
                type="text" required
                value={nameForm.name}
                onChange={e => setNameForm({ name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Email Address</label>
              <input
                type="email" value={user.email} disabled
                className={inputCls + ' bg-light text-gray-400 cursor-not-allowed'}
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            {nameMsg && (
              <p className={`text-sm px-4 py-2 rounded-lg ${nameMsg.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {nameMsg}
              </p>
            )}
            <button type="submit" disabled={nameLoading}
              className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60">
              {nameLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Reset password card */}
        <div className="bg-white rounded-2xl border border-borderColor p-8">
          <h3 className="font-semibold text-gray-700 mb-5">Change Password</h3>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {[
              { key: 'current', label: 'Current Password', field: 'currentPassword' },
              { key: 'new', label: 'New Password', field: 'newPassword' },
              { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword' },
            ].map(({ key, label, field }) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPw[key] ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={pwForm[field]}
                    onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                    className={inputCls + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showPw[key] ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
            {pwMsg && (
              <p className={`text-sm px-4 py-2 rounded-lg ${pwMsg.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {pwMsg}
              </p>
            )}
            <button type="submit" disabled={pwLoading}
              className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60">
              {pwLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full py-3 border border-red-200 text-red-500 hover:bg-red-50 font-medium rounded-xl transition-all text-sm bg-white"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
