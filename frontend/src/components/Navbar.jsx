import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Home, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  // Check if we're on a dashboard page
  const isDashboardPage = ['/dashboard', '/admin', '/pandit'].includes(location.pathname)

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🕉️</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Har Ghar Pooja</span>
              <span className="text-xs text-primary-600 -mt-1">AsthaSetu</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!isDashboardPage && (
              <>
                <a href="/#home" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Home</a>
                <a href="/#about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">About</a>
                <a href="/#services" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Services</a>
                <a href="/#pricing" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Pricing</a>
                <a href="/#contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Contact</a>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                {isDashboardPage ? (
                  <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                ) : (
                  <Link 
                    to={user.role === 'admin' ? '/admin' : user.role === 'pandit' ? '/pandit' : '/dashboard'} 
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-600">Hi, {user.name?.split(' ')[0]}</span>
                <button 
                  onClick={logout} 
                  className="bg-gradient-to-r from-primary-500 to-orange-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-primary-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md hover:bg-gray-100">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!isDashboardPage && (
              <>
                <a href="/#home" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">Home</a>
                <a href="/#about" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">About</a>
                <a href="/#services" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">Services</a>
                <a href="/#pricing" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">Pricing</a>
              </>
            )}
            {user ? (
              <>
                {isDashboardPage ? (
                  <Link to="/" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                ) : (
                  <Link 
                    to={user.role === 'admin' ? '/admin' : user.role === 'pandit' ? '/pandit' : '/dashboard'}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <div className="px-3 py-2 text-sm text-gray-500">Logged in as {user.name}</div>
                <button onClick={logout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-md">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
