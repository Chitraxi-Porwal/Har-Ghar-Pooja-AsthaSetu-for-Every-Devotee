import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Video, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils';

const pujaData = [
  { id: 1, name: 'पितृ शांति', nameEn: 'Pitru Shanti', price: 5100, duration: '3-4 hours', description: 'Peace for ancestors and forefathers' },
  { id: 2, name: 'नारायण बली', nameEn: 'Narayan Bali', price: 21000, duration: 'Full day', description: 'For prosperity and removing obstacles' },
  { id: 3, name: 'काल सर्प दोष', nameEn: 'Kaal Sarp Dosh', price: 4100, duration: '4-5 hours', description: 'Remedial puja for Kaal Sarp Dosha' },
  { id: 4, name: 'रुद्राभिषेक', nameEn: 'Rudrabhishek', price: '1100-11000', priceRange: [1100, 11000], duration: '1-3 hours', description: 'Lord Shiva worship with sacred offerings' },
  { id: 5, name: 'मंगल शांति', nameEn: 'Mangal Shanti', price: 3100, duration: '3-4 hours', description: 'Pacify Mars related issues' },
  { id: 6, name: 'भात पूजन', nameEn: 'Bhaat Pujan', price: 2100, duration: '2-3 hours', description: 'Traditional rice offering ceremony' },
  { id: 7, name: 'ग्रहण दोष शांति', nameEn: 'Grahan Dosh Shanti', price: 2100, duration: '3-4 hours', description: 'Remedies for eclipse related doshas' },
  { id: 8, name: 'नवग्रह शांति', nameEn: 'Navgraha Shanti', price: 2500, duration: '3-4 hours', description: 'Pacify all nine planets' },
  { id: 9, name: 'चांडाल दोष शांति', nameEn: 'Chandal Dosh Shanti', price: 2500, duration: '3-4 hours', description: 'Remedies for Chandala Dosha' },
  { id: 10, name: 'कुंभ विवाह', nameEn: 'Kumbh Vivah', price: 3500, duration: '4-5 hours', description: 'For delayed marriage' },
  { id: 11, name: 'अर्क विवाह', nameEn: 'Ark Vivah', price: 3100, duration: '3-4 hours', description: 'Alternative marriage rituals' },
  { id: 12, name: 'वास्तु पूजन', nameEn: 'Vastu Pujan', price: 11000, duration: 'Full day', description: 'House/business premises blessing' },
  { id: 13, name: 'ग्रह शांति', nameEn: 'Graha Shanti', price: 1100, duration: '2-3 hours', description: 'General planetary peace puja' },
  { id: 14, name: 'जप', nameEn: 'Jap', price: '1000-51000', priceRange: [1000, 51000], duration: 'Varies', description: 'Mantra chanting as per requirement' },
  { id: 15, name: 'वैवाहिक एवं मांगलिक पूजन', nameEn: 'Vaivahik evam Manglik Pujan', price: 11000, duration: 'Full day', description: 'Marriage and auspicious ceremonies' },
];

const PricingGrid = ({ onBookNow }) => {
  const [selectedPuja, setSelectedPuja] = useState(null);

  const handleBookNow = (puja) => {
    if (onBookNow) {
      onBookNow(puja);
    } else {
      // Fallback: scroll to booking section or open modal
      console.log('Book puja:', puja);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50">
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
            Our Services
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Puja Services & Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our authentic Vedic rituals performed by experienced pandits. 
            All pujas include complete samagri and personalized guidance.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pujaData.map((puja, index) => (
            <motion.div
              key={puja.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card 
                hoverable 
                className="h-full flex flex-col group cursor-pointer"
                onClick={() => setSelectedPuja(puja)}
              >
                <CardContent className="flex-1 flex flex-col">
                  {/* Puja Name */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {puja.name}
                    </h3>
                    <p className="text-sm text-gray-500">{puja.nameEn}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-primary-600">
                        {typeof puja.price === 'number' ? `₹${puja.price.toLocaleString('en-IN')}` : `₹${puja.price}`}
                      </span>
                      {puja.priceRange && (
                        <div className="ml-2 group/tooltip relative">
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                          <div className="invisible group-hover/tooltip:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                            Price varies based on ritual complexity
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 flex-1 line-clamp-2">
                    {puja.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 mb-6 text-sm">
                    <span className="inline-flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {puja.duration}
                    </span>
                    <span className="inline-flex items-center text-green-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      In-person
                    </span>
                    <span className="inline-flex items-center text-blue-600">
                      <Video className="h-4 w-4 mr-1" />
                      Virtual
                    </span>
                  </div>

                  {/* Book Button */}
                  <Button 
                    fullWidth 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookNow(puja);
                    }}
                    className="mt-auto"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Custom Puja CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary-50 to-orange-50 border-primary-200">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-6">
                We offer customized puja services tailored to your specific needs and requirements.
              </p>
              <Button variant="primary" size="lg" as="a" href="#contact">
                Contact Us for Custom Puja
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingGrid;
