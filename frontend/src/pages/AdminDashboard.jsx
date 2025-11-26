import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Users, BookOpen, DollarSign, UserCheck, Check, X, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [pandits, setPandits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [statsRes, panditsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/pandits')
      ])
      setStats(statsRes.data)
      setPandits(panditsRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePandit = async (panditId, approved) => {
    try {
      await axios.patch(`/api/admin/pandits/${panditId}/approve`, { approved })
      fetchData()
    } catch (error) {
      alert('Failed to update pandit status')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🕉️</div>
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform operations and monitor performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-12 h-12 opacity-80" />
              <TrendingUp className="w-6 h-6 opacity-50" />
            </div>
            <h3 className="text-blue-100 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-4xl font-bold">{stats?.total_users || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="w-12 h-12 opacity-80" />
              <TrendingUp className="w-6 h-6 opacity-50" />
            </div>
            <h3 className="text-green-100 text-sm font-medium mb-1">Active Pandits</h3>
            <p className="text-4xl font-bold">{stats?.total_pandits || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-12 h-12 opacity-80" />
              <TrendingUp className="w-6 h-6 opacity-50" />
            </div>
            <h3 className="text-purple-100 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-4xl font-bold">{stats?.total_bookings || 0}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-12 h-12 opacity-80" />
              <TrendingUp className="w-6 h-6 opacity-50" />
            </div>
            <h3 className="text-orange-100 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-4xl font-bold">₹{stats?.total_revenue?.toLocaleString('en-IN') || 0}</p>
          </div>
        </div>

        {/* Pandit Management */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-orange-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Pandit Management</h2>
          </div>
          
          <div className="p-6">
            {pandits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No pandits registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Pandit</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pandits.map((pandit) => (
                      <tr key={pandit.id} className="hover:bg-orange-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-orange-600 flex items-center justify-center text-white font-bold mr-3">
                              {pandit.user?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{pandit.user?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{pandit.bio?.substring(0, 30) || 'Vedic priest'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700">{pandit.city}</div>
                          <div className="text-sm text-gray-500">{pandit.state}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{pandit.user?.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                            pandit.approved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {pandit.approved ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {!pandit.approved ? (
                              <button
                                onClick={() => handleApprovePandit(pandit.id, true)}
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all font-semibold text-sm"
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprovePandit(pandit.id, false)}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all font-semibold text-sm"
                              >
                                <X className="w-4 h-4" />
                                Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
