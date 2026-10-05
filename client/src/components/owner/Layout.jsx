import { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, Navigate, Link, useNavigate } from 'react-router-dom'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { useApp } from '../../context/AppContext'

// Generic user icon — no face
const UserIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#E2E8F0" />
    <circle cx="32" cy="24" r="10" fill="#94A3B8" />
    <path d="M12 52c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#94A3B8" />
  </svg>
)

const Layout = () => {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return <Navigate to="/" replace />
  if (user.role !== 'owner') return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen bg-light">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-borderColor flex flex-col py-6 px-4 shrink-0">

        {/* Logo + back to site */}
        <div className="mb-6 px-2 flex items-center justify-between">
          <Link to="/">
            <img src={assets.logo} alt="logo" className="h-8" />
          </Link>
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
            title="Back to site"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Exit
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {ownerMenuLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              end={link.path === '/owner'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-light'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? link.coloredIcon : link.icon} className="h-5 w-5" alt="" />
                  {link.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section at bottom */}
        <div className="mt-auto pt-4 border-t border-borderColor relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(p => !p)}
            className="flex items-center gap-3 px-2 w-full hover:bg-light rounded-xl py-2 transition-colors"
          >
            <UserIcon className="w-9 h-9 rounded-full shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
            {/* chevron */}
            <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {/* Dropdown — opens upward */}
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-borderColor rounded-xl shadow-xl py-2 z-50">
              <button
                onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-light transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </button>
              <button
                onClick={() => { navigate('/'); setDropdownOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-light transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Site
              </button>
              <div className="border-t border-borderColor my-1" />
              <button
                onClick={() => { logout(); navigate('/'); setDropdownOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
