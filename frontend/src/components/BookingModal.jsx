import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, User, Video } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const BookingModal = ({ puja, isOpen, onClose }) => {
  const { token, user } = useAuth()
  const [pandits, setPandits] = useState([])
  const [formData, setFormData] = useState({
    pandit_id: '',
    scheduled_at: '',
    address: '',
    is_virtual: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [paymentMode, setPaymentMode] = useState('auto') // auto | mock | razorpay
  const [razorpayReady, setRazorpayReady] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Fetch available pandits
      axios.get('/api/pandits').then(res => {
        setPandits(res.data)
        // Don't auto-select, let user choose
      }).catch(err => {
        console.error('Error fetching pandits:', err)
        setError('Failed to load pandits. Please try again.')
      })

      // Load Razorpay script dynamically
      const existing = document.getElementById('razorpay-checkout-js')
      if (!existing) {
        const script = document.createElement('script')
        script.id = 'razorpay-checkout-js'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => setRazorpayReady(true)
        script.onerror = () => setRazorpayReady(false)
        document.body.appendChild(script)
      } else {
        setRazorpayReady(true)
      }
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create booking
      const bookingResponse = await axios.post('/api/bookings', {
        puja_type_id: puja.id,
        pandit_id: formData.pandit_id,
        scheduled_at: formData.scheduled_at,
        address: formData.address,
        is_virtual: formData.is_virtual
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const bookingId = bookingResponse.data.id
      
      // Try real Razorpay flow first if script is ready
      if (razorpayReady) {
        try {
          const orderRes = await axios.post('/api/payments/razorpay/order', {
            booking_id: bookingId,
            provider: 'razorpay'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })

          const { key_id, order, amount, user: userInfo } = orderRes.data

          const options = {
            key: key_id,
            amount: order.amount,
            currency: order.currency,
            name: 'Har Ghar Pooja',
            description: puja.name_en,
            image: puja.image_url,
            order_id: order.id,
            prefill: {
              name: userInfo?.name || user?.name || 'Devotee',
              contact: userInfo?.phone || user?.phone || ''
            },
            notes: {
              puja_id: puja.id,
              booking_id: bookingId
            },
            theme: { color: '#FF6B35' },
            handler: async function (response) {
              try {
                await axios.post('/api/payments/razorpay/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }, {
                  headers: { Authorization: `Bearer ${token}` }
                })

                setSuccess(true)
                setTimeout(() => {
                  onClose()
                  window.location.href = '/dashboard'
                }, 1200)
              } catch (verifyErr) {
                setError(verifyErr.response?.data?.detail || 'Payment verification failed')
                setLoading(false)
              }
            },
            modal: {
              ondismiss: () => {
                setLoading(false)
              }
            }
          }

          const rz = new window.Razorpay(options)
          rz.open()
          return
        } catch (orderErr) {
          // Fallback to mock if Razorpay not configured
          setPaymentMode('mock')
        }
      }

      // Mock fallback flow
      const paymentResponse = await axios.post('/api/payments/create', {
        booking_id: bookingId,
        provider: 'razorpay'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const paymentId = paymentResponse.data.id
      await axios.post(`/api/payments/complete/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setSuccess(true)
      setTimeout(() => {
        onClose()
        window.location.href = '/dashboard'
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed. Please try again.')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Puja</h2>
            <p className="text-xl text-primary-600 mb-6">{puja.name_local} - ₹{puja.default_price || 0}</p>

            {success ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Successful!</h3>
                <p className="text-gray-600">Redirecting to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Virtual or In-Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puja Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition"
                      style={{ borderColor: !formData.is_virtual ? '#FF6B35' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        checked={!formData.is_virtual}
                        onChange={() => setFormData({ ...formData, is_virtual: false })}
                        className="mr-2"
                      />
                      <MapPin className="w-5 h-5 mr-2" />
                      In-Person
                    </label>
                    <label className="flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition"
                      style={{ borderColor: formData.is_virtual ? '#FF6B35' : '#e5e7eb' }}>
                      <input
                        type="radio"
                        checked={formData.is_virtual}
                        onChange={() => setFormData({ ...formData, is_virtual: true })}
                        className="mr-2"
                      />
                      <Video className="w-5 h-5 mr-2" />
                      Virtual
                    </label>
                  </div>
                </div>

                {/* Select Pandit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Select Pandit
                  </label>
                  <select
                    value={formData.pandit_id}
                    onChange={(e) => setFormData({ ...formData, pandit_id: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                    disabled={pandits.length === 0}
                  >
                    <option value="">Select a Pandit</option>
                    {pandits.length === 0 ? (
                      <option value="" disabled>Loading pandits...</option>
                    ) : (
                      pandits.map(pandit => (
                        <option key={pandit.id} value={pandit.id}>
                          {pandit.user?.name || 'Unknown'} - {pandit.city}, {pandit.state}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                {/* Address (only for in-person) */}
                {!formData.is_virtual && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your complete address"
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required={!formData.is_virtual}
                    />
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">₹{puja.default_price ? puja.default_price.toLocaleString('en-IN') : '0'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Duration: {puja.duration_minutes || 120} minutes
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-4 rounded-xl hover:bg-primary-600 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? 'Processing...' : `Pay ₹${puja.default_price ? puja.default_price.toLocaleString('en-IN') : '0'} & Book Now`}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  {paymentMode === 'mock' || !razorpayReady
                    ? 'Mock payment mode active: Booking will be confirmed instantly'
                    : 'Secure payment powered by Razorpay'}
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BookingModal
