import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import BookingModal from './BookingModal'

const PujaCard = ({ puja }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleBookClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowBooking(true)
    setShowDetails(false)
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-primary-100 hover:border-primary-300 transition-all"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={puja.image_url || 'https://images.unsplash.com/photo-1604514628550-47eb97ec64c9?w=800'}
            alt={puja.name_en}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{puja.name_local}</h3>
            <p className="text-sm text-gray-200">{puja.name_en}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{puja.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Clock className="w-4 h-4 mr-1" />
            <span>{puja.duration_minutes || 120} mins</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-bold text-primary-600">₹{puja.default_price.toLocaleString()}</span>
              {puja.min_price !== puja.max_price && (
                <p className="text-xs text-gray-500">Range: ₹{puja.min_price}-₹{puja.max_price}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition font-semibold shadow-md"
            >
              Read More
            </button>
            <button 
              onClick={handleBookClick}
              className="flex-1 border-2 border-primary-500 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition font-semibold"
            >
              Book Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Image */}
              <div className="relative h-64">
                <img src={puja.image_url} alt={puja.name_en} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-4xl font-bold text-white drop-shadow-lg">{puja.name_local}</h2>
                  <p className="text-xl text-gray-200">{puja.name_en}</p>
                </div>
              </div>

              <div className="p-8">
                {/* Price & Duration */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b">
                  <div>
                    <span className="text-4xl font-bold text-primary-600">₹{puja.default_price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{puja.duration_minutes || 120} minutes</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-primary-500" />
                    About This Puja
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{puja.description || puja.detailed_description}</p>
                </div>

                {/* Benefits */}
                {puja.benefits && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Benefits</h3>
                    <div className="bg-primary-50 p-6 rounded-xl">
                      <p className="text-gray-700 whitespace-pre-line">{puja.benefits}</p>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button 
                  onClick={handleBookClick}
                  className="w-full bg-primary-500 text-white py-4 rounded-xl hover:bg-primary-600 transition font-bold text-lg shadow-md"
                >
                  Book This Puja Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <BookingModal 
        puja={puja} 
        isOpen={showBooking} 
        onClose={() => setShowBooking(false)} 
      />
    </>
  )
}

export default PujaCard
