import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Phone, Video } from 'lucide-react';
import Button from './ui/Button';

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center md:text-left"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 rounded-full mb-4">
              Experience Divine Bliss at Your Doorstep
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Traditional Pooja Services for Your <span className="text-primary-600">Home & Heart</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0">
              Book experienced pandits for authentic Vedic rituals, pujas, and ceremonies. 
              Connect with divine energy from the comfort of your home or at our sacred temples.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button as="a" href="#pricing" size="lg" className="group">
                Book a Pooja Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                as="a" 
                href="#contact" 
                variant="outline" 
                size="lg"
                className="border-primary-300 text-primary-700 hover:bg-primary-50"
              >
                Contact Us
              </Button>
            </div>
            
            <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 mr-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>Easy Online Booking</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mr-3">
                  <Phone className="h-5 w-5" />
                </div>
                <span>24/7 Support</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <Video className="h-5 w-5" />
                </div>
                <span>Virtual Pooja Available</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/hero-image.png" 
                alt="Har Ghar Pooja - AsthaSetu" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-100 rounded-full -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-100 rounded-full -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-primary-50 rounded-tr-full -z-10"></div>
    </section>
  );
};

export default Hero;
