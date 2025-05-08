import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, UserCircle, FileText } from 'lucide-react';

const steps = [
  {
    icon: <Smartphone className="h-12 w-12" />,
    title: 'Tap NFC Card',
    description: 'Simply tap your NFC card to a compatible smartphone or reader device.',
    color: 'text-primary-600'
  },
  {
    icon: <UserCircle className="h-12 w-12" />,
    title: 'Authenticate',
    description: 'Quickly verify your identity with secure, privacy-focused authentication.',
    color: 'text-secondary-600'
  },
  {
    icon: <FileText className="h-12 w-12" />,
    title: 'View Record',
    description: 'Access your complete medical history and latest health information instantly.',
    color: 'text-success-600'
  }
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access your health information in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`cursor-pointer relative rounded-xl p-8 ${
                activeStep === index 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white hover:shadow-md'
              } transition-all duration-300`}
              onClick={() => setActiveStep(index)}
            >
              {activeStep === index && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-xl"
                  initial={false}
                />
              )}
              <div className={`${step.color} mb-4`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                {activeStep === 0 && (
                  <img 
                    src="https://images.pexels.com/photos/7658668/pexels-photo-7658668.jpeg" 
                    alt="Person tapping NFC card to phone"
                    className="w-full h-full object-cover"
                  />
                )}
                {activeStep === 1 && (
                  <img 
                    src="https://images.pexels.com/photos/4021808/pexels-photo-4021808.jpeg" 
                    alt="Person authenticating on smartphone"
                    className="w-full h-full object-cover"
                  />
                )}
                {activeStep === 2 && (
                  <img 
                    src="https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg" 
                    alt="Doctor viewing patient record"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[activeStep].title}
                </h3>
                <p className="text-lg text-gray-600">
                  {steps[activeStep].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}