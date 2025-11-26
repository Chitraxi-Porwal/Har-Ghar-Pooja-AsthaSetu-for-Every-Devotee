import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Container from '../ui/Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Puja Booking', href: '/#pricing' },
      { name: 'Pandit Consultation', href: '/#services' },
      { name: 'Virtual Pooja', href: '/#services' },
      { name: 'Temple Services', href: '/#services' },
    ],
    company: [
      { name: 'About Us', href: '/#about' },
      { name: 'Contact', href: '/#contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'FAQs', href: '/faq' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Youtube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">🕉️</span>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">Har Ghar Pooja</span>
                  <span className="text-xs text-primary-400">AsthaSetu</span>
                </div>
              </Link>
              <p className="text-sm text-gray-400 mb-6 max-w-sm">
                Bringing divine blessings to your doorstep. Book authentic Vedic rituals and pujas with experienced pandits across India.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a href="tel:+919999999999" className="flex items-center text-sm hover:text-primary-400 transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  +91 99999 99999
                </a>
                <a href="mailto:info@hargharpooja.com" className="flex items-center text-sm hover:text-primary-400 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  info@hargharpooja.com
                </a>
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>123 Temple Street, New Delhi, India 110001</span>
                </div>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links & Newsletter */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="p-2 rounded-full bg-gray-800 hover:bg-primary-500 transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>

              {/* Newsletter */}
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-primary-500 text-sm"
                />
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© {currentYear} Har Ghar Pooja - AsthaSetu. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for devotees across India</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
