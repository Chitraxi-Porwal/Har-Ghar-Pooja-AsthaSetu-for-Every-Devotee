import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 mr-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 text-lg font-bold">
            {testimonial.name.charAt(0)}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {testimonial.name}
          </h4>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.comment}"</p>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {testimonial.puja && (
          <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-xs font-medium mr-2">
            {testimonial.puja}
          </span>
        )}
        <span>{testimonial.date}</span>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
