import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center py-16 px-4 overflow-hidden bg-gradient-to-b from-white to-primary-50">
      {/* Background circle decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-primary-100/30 blur-3xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] rounded-full bg-secondary-100/30 blur-3xl"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
            Healthcare Innovation
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
        >
          <span className="block">Paperless, Instant,</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
            Secure Healthcare
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10"
        >
          Transform patient care with our NFC-enabled healthcare management system.
          Instant access to complete patient histories with just a tap of a card.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            asChild
            variant="gradient"
            size="xl"
            className="group relative overflow-hidden"
          >
            <Link to="/login/staff" className="relative z-10">
              Staff Portal
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="group relative overflow-hidden"
          >
            <Link to="/login/patient" className="relative z-10">
              Patient Portal
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <motion.div
                className="absolute inset-0 bg-primary-50"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl"
        >
          {[
            { label: 'Active Patients', value: '10,000+' },
            { label: 'Healthcare Providers', value: '500+' },
            { label: 'Daily Check-ins', value: '1,000+' },
            { label: 'Patient Satisfaction', value: '98%' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Foreground illustration */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 mt-16 w-full max-w-5xl"
      >
        <div className="relative w-full aspect-[16/9] bg-white rounded-lg shadow-xl overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg" 
            alt="Healthcare professionals using digital tablet" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
            <div className="p-6 text-white">
              <p className="text-xl font-medium">
                Modernizing healthcare with NFC technology
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-[10%] w-48 h-32 bg-white rounded-lg shadow-lg p-4 transform rotate-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="h-4 w-16 bg-primary-100 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded mt-2" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-[10%] w-48 h-32 bg-white rounded-lg shadow-lg p-4 transform -rotate-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="h-4 w-16 bg-secondary-100 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded mt-2" />
        </motion.div>
      </div>
    </section>
  );
}