import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Video } from 'lucide-react';
import Button from '../ui/Button';

const PujaCard = ({ puja, className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 ${className}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {puja.name}
          </h3>
          <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
            ₹{puja.price}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {puja.description || 'Traditional puja ceremony with experienced pandit'}
        </p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {puja.duration || '2-3 hours'}
          </span>
          
          <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
            <MapPin className="h-4 w-4 mr-1" />
            In-person
          </span>
          
          <span className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400">
            <Video className="h-4 w-4 mr-1" />
            Virtual
          </span>
        </div>
        
        <Button fullWidth className="mt-auto">
          Book Now
        </Button>
      </div>
    </motion.div>
  );
};

export default PujaCard;
