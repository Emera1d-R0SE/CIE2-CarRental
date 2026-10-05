import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [carsLoaded, setCarsLoaded] = useState(false)

  const fetchCars = async (filters = {}) => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`/api/cars${params ? '?' + params : ''}`)
      if (data.success) {
        setCars(data.cars)
        setCarsLoaded(true)
      }
    } catch {
      setCarsLoaded(true) // mark loaded even on error so pages know to use dummy
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('token', userToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
  }

  const logout = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(({ data }) => { if (data.success) setUser(data.user) })
        .catch(() => logout())
    }
    fetchCars()
  }, [])

  return (
    <AppContext.Provider value={{ user, token, cars, loading, carsLoaded, showLogin, setShowLogin, fetchCars, login, logout, setCars }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
export default AppContext
