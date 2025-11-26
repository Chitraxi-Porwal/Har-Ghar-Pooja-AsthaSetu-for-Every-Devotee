import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Calendar, Users, DollarSign, Check, X, Clock, MapPin, Video, Phone, Mail, User as UserIcon, TrendingUp } from 'lucide-react'

const PanditDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0, total_earnings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'pandit') {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, token, navigate])

  const fetchData = async () => {
    try {
      // Get pandit profile
      const profileRes = await axios.get('/api/pandits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const panditProfile = profileRes.data.find(p => p.user.id === user.id)
      
      if (!panditProfile) {
        console.error('Pandit profile not found')
        setLoading(false)
        return
      }

      // Fetch pandit's bookings
      const bookingsRes = await axios.get(`/api/pandits/${panditProfile.id}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(bookingsRes.data)

      // Calculate stats
      const pending = bookingsRes.data.filter(b => b.status === 'pending').length
      const confirmed = bookingsRes.data.filter(b => b.status === 'confirmed').length
      const completed = bookingsRes.data.filter(b => b.status === 'completed').length
      const total_earnings = bookingsRes.data
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0)

      setStats({ pending, confirmed, completed, total_earnings })
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      fetchData() // Refresh data
    } catch (err) {
      console.error(err)
      alert('Failed to update booking status')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pandit Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name} 🙏 - Manage your bookings and schedule</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕉️</div>
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-12 h-12 opacity-80" />
                  <TrendingUp className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-yellow-100 text-sm font-medium mb-1">Pending</h3>
                <p className="text-4xl font-bold">{stats.pending}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Check className="w-12 h-12 opacity-80" />
                  <TrendingUp className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-green-100 text-sm font-medium mb-1">Confirmed</h3>
                <p className="text-4xl font-bold">{stats.confirmed}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-12 h-12 opacity-80" />
                  <TrendingUp className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-blue-100 text-sm font-medium mb-1">Completed</h3>
                <p className="text-4xl font-bold">{stats.completed}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-12 h-12 opacity-80" />
                  <TrendingUp className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-orange-100 text-sm font-medium mb-1">Total Earnings</h3>
                <p className="text-4xl font-bold">₹{stats.total_earnings.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-orange-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">My Bookings</h2>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map(booking => (
                      <div key={booking.id} className="bg-white border-2 border-orange-200 rounded-2xl overflow-hidden hover:border-orange-400 hover:shadow-2xl transition-all">
                        {/* Header with Puja Name and Status */}
                        <div className="bg-gradient-to-r from-primary-500 to-orange-600 px-6 py-4 flex justify-between items-center">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{booking.puja_type.name_local}</h3>
                            <p className="text-orange-100">{booking.puja_type.name_en}</p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                            booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                            booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                            booking.status === 'completed' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="p-6">
                          {/* Customer Information Section */}
                          {booking.user && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
                              <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                                  {booking.user.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                                    <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                                    Customer Details
                                  </h4>
                                  <p className="text-sm text-gray-600">Booking ID: {booking.id.substring(0, 8)}...</p>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                  <UserIcon className="w-5 h-5 mr-3 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-800">{booking.user.name}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                                  <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-800">{booking.user.phone}</p>
                                  </div>
                                </div>
                                
                                {booking.user.email && (
                                  <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                      <p className="text-xs text-gray-500">Email</p>
                                      <p className="font-semibold text-gray-800">{booking.user.email}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {booking.user.city && (
                                  <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                      <p className="text-xs text-gray-500">Location</p>
                                      <p className="font-semibold text-gray-800">{booking.user.city}, {booking.user.state}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Booking Details Section */}
                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-5 mb-6 border-2 border-orange-200">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                              Booking Details
                            </h4>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                <Calendar className="w-5 h-5 mr-3 text-orange-600" />
                                <div>
                                  <p className="text-xs text-gray-500">Date & Time</p>
                                  <p className="font-semibold text-gray-800">
                                    {new Date(booking.scheduled_at).toLocaleString('en-IN', {
                                      dateStyle: 'medium',
                                      timeStyle: 'short'
                                    })}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                <DollarSign className="w-5 h-5 mr-3 text-orange-600" />
                                <div>
                                  <p className="text-xs text-gray-500">Payment</p>
                                  <p className="font-semibold text-gray-800 text-xl">₹{booking.price.toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                {booking.is_virtual ? (
                                  <><Video className="w-5 h-5 mr-3 text-orange-600" />
                                  <div>
                                    <p className="text-xs text-gray-500">Type</p>
                                    <p className="font-semibold text-gray-800">Virtual Puja</p>
                                  </div></>
                                ) : (
                                  <><MapPin className="w-5 h-5 mr-3 text-orange-600" />
                                  <div>
                                    <p className="text-xs text-gray-500">Type</p>
                                    <p className="font-semibold text-gray-800">In-Person</p>
                                  </div></>
                                )}
                              </div>
                              
                              <div className="flex items-center bg-white/70 p-3 rounded-lg">
                                <Clock className="w-5 h-5 mr-3 text-orange-600" />
                                <div>
                                  <p className="text-xs text-gray-500">Duration</p>
                                  <p className="font-semibold text-gray-800">{booking.puja_type.duration_minutes || 120} minutes</p>
                                </div>
                              </div>
                            </div>
                            
                            {booking.address && (
                              <div className="mt-4 bg-white/70 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Address</p>
                                <p className="font-semibold text-gray-800 flex items-start">
                                  <MapPin className="w-5 h-5 mr-2 text-orange-600 flex-shrink-0 mt-0.5" />
                                  {booking.address}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                                >
                                  <Check className="w-5 h-5 mr-2" />
                                  Accept Booking
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                                >
                                  <X className="w-5 h-5 mr-2" />
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'completed')}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                              >
                                <Check className="w-5 h-5 mr-2" />
                                Mark as Completed
                              </button>
                            )}
                            {booking.status === 'completed' && (
                              <div className="flex-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 py-3 px-6 rounded-xl flex items-center justify-center font-semibold">
                                <Check className="w-5 h-5 mr-2" />
                                Completed Successfully
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PanditDashboard
