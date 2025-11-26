import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    puja: 'Griha Pravesh',
    comment: 'The pandit ji was very knowledgeable and performed the Griha Pravesh puja with great devotion. The entire process was smooth and professional. Highly recommended!',
    date: 'January 2024',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    puja: 'Satyanarayan Puja',
    comment: 'Excellent service! The virtual puja option was perfect for our family members living abroad. The pandit explained everything clearly and made the ceremony very meaningful.',
    date: 'December 2023',
  },
  {
    id: 3,
    name: 'Amit Patel',
    location: 'Ahmedabad',
    rating: 5,
    puja: 'Navgraha Shanti',
    comment: 'Very satisfied with the Navgraha Shanti puja. The pandit was punctual, well-prepared, and conducted the ritual with proper mantras. Great experience overall.',
    date: 'November 2023',
  },
  {
    id: 4,
    name: 'Sunita Verma',
    location: 'Bangalore',
    rating: 5,
    puja: 'Vastu Puja',
    comment: 'Professional and authentic service. The Vastu puja was performed according to all traditional guidelines. The team was courteous and helpful throughout.',
    date: 'October 2023',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    location: 'Jaipur',
    rating: 5,
    puja: 'Kaal Sarp Dosh Puja',
    comment: 'The Kaal Sarp Dosh puja was conducted with utmost sincerity. The pandit took time to explain the significance of each ritual. Very happy with the service.',
    date: 'September 2023',
  },
  {
    id: 6,
    name: 'Meera Iyer',
    location: 'Chennai',
    rating: 5,
    puja: 'Lakshmi Puja',
    comment: 'Wonderful experience! The pandit was very knowledgeable and made sure we understood the importance of each step. The puja brought positive energy to our home.',
    date: 'August 2023',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="primary" size="lg" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Devotees Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Read the experiences of thousands of satisfied families who have found peace and blessings through our services.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="w-full"
              >
                <Card className="bg-white shadow-xl">
                  <CardContent className="p-8 md:p-12">
                    {/* Quote Icon */}
                    <Quote className="h-12 w-12 text-primary-200 mb-6" />

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                      "{currentTestimonial.comment}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">{currentTestimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="primary">{currentTestimonial.puja}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{currentTestimonial.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(-1)}
              className="p-3 rounded-full bg-white shadow-md hover:bg-primary-50 hover:shadow-lg transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-primary-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-3 rounded-full bg-white shadow-md hover:bg-primary-50 hover:shadow-lg transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-primary-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { label: 'Happy Families', value: '5000+' },
            { label: 'Pujas Completed', value: '10,000+' },
            { label: 'Expert Pandits', value: '100+' },
            { label: 'Cities Covered', value: '50+' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
