import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Calendar, MapPin, Clock, Package, TrendingUp, Home } from 'lucide-react'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [pujas, setPujas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [bookingsRes, pujasRes] = await Promise.all([
        axios.get('/api/bookings/my-bookings'),
        axios.get('/api/pujas')
      ])
      setBookings(bookingsRes.data)
      setPujas(pujasRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      await axios.patch(`/api/bookings/${bookingId}/cancel`)
      fetchData()
    } catch (error) {
      alert('Failed to cancel booking')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}! 🙏</h1>
          <p className="text-gray-600">Manage your bookings and explore spiritual services</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold mt-1">{bookings.length}</p>
              </div>
              <Package className="w-12 h-12 opacity-30" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-3xl font-bold mt-1">{bookings.filter(b => b.status === 'completed').length}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-30" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pending</p>
                <p className="text-3xl font-bold mt-1">{bookings.filter(b => b.status === 'pending').length}</p>
              </div>
              <Clock className="w-12 h-12 opacity-30" />
            </div>
          </div>
        </div>
        {/* My Bookings Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-orange-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">My Bookings</h2>
          </div>
          
          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📿</div>
                <p className="text-gray-600 mb-4 text-lg">You haven't booked any pujas yet</p>
                <a href="/#services" className="bg-gradient-to-r from-primary-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all inline-block font-semibold">
                  Explore Services
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {booking.puja_type?.name_local || 'Puja'}
                        </h3>
                        <p className="text-sm text-gray-500">{booking.puja_type?.name_en}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                        booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                        booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                        booking.status === 'completed' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-gray-600 mb-4">
                      <div className="flex items-center bg-white/50 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                        <span className="text-sm font-medium">{new Date(booking.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      {booking.address && (
                        <div className="flex items-center bg-white/50 p-3 rounded-lg">
                          <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                          <span className="text-sm">{booking.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent">
                        ₹{booking.price ? booking.price.toLocaleString('en-IN') : '0'}
                      </div>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Book Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-orange-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Explore More Services</h2>
          </div>
          
          <div className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pujas.slice(0, 6).map((puja) => (
                <div key={puja.id} className="group bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow-md hover:shadow-2xl transition-all border-2 border-orange-100 hover:border-orange-400">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{puja.name_local}</h3>
                    <p className="text-sm text-gray-500">{puja.name_en}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent">
                      ₹{puja.default_price?.toLocaleString('en-IN')}
                    </span>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <a href="/#services" className="block w-full bg-gradient-to-r from-primary-500 to-orange-600 text-white py-3 rounded-xl hover:shadow-lg transition-all text-center font-semibold group-hover:scale-105">
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
