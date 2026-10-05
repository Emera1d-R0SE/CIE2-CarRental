import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets, menuLinks } from '../assets/assets'
import { useApp } from '../context/AppContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, setShowLogin } = useApp()
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const isHome = location.pathname === '/'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative ${isHome ? 'bg-light' : 'bg-white'}`}>
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9" />
      </Link>

      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-8">
        {menuLinks.map((link, i) => (
          <Link key={i} to={link.path} className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary' : ''}`}>
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-2 border border-borderColor px-4 py-2 rounded-full text-sm text-gray-400">
          <img src={assets.search_icon} className="h-4 w-4" alt="" />
          <input type="text" placeholder="Search cars" className="outline-none bg-transparent w-28 text-gray-600 placeholder-gray-400 text-sm" />
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            {user.role === 'owner' && (
              <Link to="/owner" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            )}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-8 h-8 rounded-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#E2E8F0" />
                  <circle cx="32" cy="24" r="10" fill="#94A3B8" />
                  <path d="M12 52c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="#94A3B8" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white border border-borderColor rounded-xl shadow-xl py-2 w-44 z-50">
                  <button
                    onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-light transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/my-bookings'); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-light transition-colors"
                  >
                    My Bookings
                  </button>
                  <div className="border-t border-borderColor my-1" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-gray-600 hover:text-primary">
              List cars
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-full transition-all"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <button className="sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <img src={open ? assets.close_icon : assets.menu_icon} className="h-6 w-6" alt="" />
      </button>

      {open && (
        <div className={`absolute top-full left-0 right-0 flex flex-col gap-4 p-6 border-t border-borderColor z-50 ${isHome ? 'bg-light' : 'bg-white'}`}>
          {menuLinks.map((link, i) => (
            <Link key={i} to={link.path} onClick={() => setOpen(false)} className="text-sm font-medium">{link.name}</Link>
          ))}
          {user ? (
            <>
              {user.role === 'owner' && <Link to="/owner" onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>}
              <button onClick={() => { logout(); setOpen(false) }} className="text-left text-sm font-medium text-red-500">Logout</button>
            </>
          ) : (
            <button onClick={() => { setShowLogin(true); setOpen(false) }} className="px-6 py-2 bg-primary text-white text-sm rounded-full w-fit">Login</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar
