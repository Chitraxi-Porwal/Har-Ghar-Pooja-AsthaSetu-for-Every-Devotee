import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Users, Phone, BookOpen, Home } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const services = [
  {
    icon: Calendar,
    title: 'Puja Booking',
    description: 'Book authentic Vedic rituals and pujas with experienced pandits at your convenience.',
    features: ['Experienced Pandits', 'Complete Samagri', 'Flexible Timing', 'Affordable Pricing'],
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    icon: Video,
    title: 'Virtual Pooja',
    description: 'Participate in live pujas from anywhere in the world through our virtual platform.',
    features: ['Live Streaming', 'Interactive Session', 'HD Quality', 'Recording Available'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Users,
    title: 'Pandit Consultation',
    description: 'Get personalized guidance and consultation from learned pandits for your spiritual needs.',
    features: ['Expert Advice', 'Personalized Solutions', 'Muhurat Selection', 'Ritual Guidance'],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Home,
    title: 'Home Services',
    description: 'Pandits visit your home to perform pujas and ceremonies with all necessary arrangements.',
    features: ['Doorstep Service', 'Complete Setup', 'Timely Arrival', 'Professional Conduct'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: BookOpen,
    title: 'Ritual Guidance',
    description: 'Learn about various rituals, their significance, and proper methods of performing them.',
    features: ['Educational Content', 'Step-by-Step Guide', 'Video Tutorials', 'Expert Tips'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your queries and booking assistance.',
    features: ['Instant Response', 'Multiple Languages', 'Booking Assistance', 'Emergency Support'],
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            What We Offer
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive spiritual services designed to bring divine blessings to your life. 
            From traditional pujas to modern virtual ceremonies, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hoverable className="h-full">
                  <CardContent className="text-center">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.bgColor} mb-6`}>
                      <Icon className={`h-8 w-8 ${service.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button variant="outline" fullWidth as="a" href="#pricing">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Ready to book a puja or need consultation?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" as="a" href="#pricing">
              View Pricing
            </Button>
            <Button variant="outline" size="lg" as="a" href="#contact">
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
