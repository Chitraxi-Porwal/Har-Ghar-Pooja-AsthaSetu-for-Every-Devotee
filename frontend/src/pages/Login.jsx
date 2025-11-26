import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(phone, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-orange-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕉️</div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600">Login to Har Ghar Pooja</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="919876543210"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-saffron-500 text-white py-3 rounded-lg hover:bg-saffron-600 font-semibold transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-saffron-600 hover:text-saffron-700 font-semibold">
              Register
            </Link>
          </p>
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
