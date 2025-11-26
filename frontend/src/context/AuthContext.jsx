import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      setUser(res.data)
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (phone, password) => {
    const res = await axios.post('/api/auth/login', { phone, password })
    setToken(res.data.access_token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.access_token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
  }

  const register = async (name, phone, password) => {
    const res = await axios.post('/api/auth/register', { name, phone, password })
    setToken(res.data.access_token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.access_token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
