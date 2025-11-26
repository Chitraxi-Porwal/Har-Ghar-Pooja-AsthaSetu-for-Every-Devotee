import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/sections/Services';
import PricingGrid from '../components/sections/PricingGrid';
import Testimonials from '../components/sections/Testimonials';
import Footer from '../components/layout/Footer';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Home = () => {
  const [pujasData, setPujasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    axios.get('/api/pujas')
      .then(res => {
        setPujasData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleBookNow = (puja) => {
    setSelectedPuja(puja);
    setShowBookingModal(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form:', contactForm);
    alert('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" size="lg" className="mb-4">
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bridging Faith with Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AsthaSetu brings the divine experience to your home. Book traditional rituals, 
              consult trusted Pandits, and participate in live virtual pujas with ease. 
              Our mission is to merge tradition with technology, making spiritual services 
              accessible to everyone, everywhere.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { emoji: '🛕', title: 'Authentic Rituals', desc: 'Traditional Vedic ceremonies performed by experienced pandits' },
              { emoji: '🙏', title: 'Trusted Pandits', desc: 'Verified and experienced pandits from across India' },
              { emoji: '🌐', title: 'Virtual & In-Person', desc: 'Choose between virtual or in-person puja services' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hoverable className="text-center h-full">
                  <CardContent className="py-8">
                    <div className="text-6xl mb-4">{item.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Pricing Section */}
      <PricingGrid onBookNow={handleBookNow} />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="primary" size="lg" className="mb-4">
              Get In Touch
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        rows="4"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <Button type="submit" fullWidth size="lg" icon={Send} iconPosition="right">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600">
                        <Phone className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+91 99999 99999</p>
                      <p className="text-sm text-gray-500 mt-1">Mon-Sun: 6:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600">
                        <Mail className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">info@hargharpooja.com</p>
                      <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600">
                        <MapPin className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">123 Temple Street</p>
                      <p className="text-gray-600">New Delhi, India 110001</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary-50 to-orange-50 border-primary-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Need Immediate Assistance?</h3>
                  <p className="text-gray-600 mb-4">Our support team is available 24/7</p>
                  <Button as="a" href="tel:+919999999999" variant="primary" size="lg" fullWidth>
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Booking Modal */}
      {selectedPuja && (
        <BookingModal
          puja={selectedPuja}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPuja(null);
          }}
        />
      )}

      {/* Loading Overlay */}
      {loading && <LoadingSpinner fullScreen />}
    </div>
  );
};

export default Home;
