import { motion } from 'framer-motion';
import { Smartphone, Shield, Stethoscope, Clock } from 'lucide-react';

const features = [
  {
    icon: <Smartphone className="h-10 w-10" />,
    title: 'Instant NFC Tap Access',
    description: 'Access patient records instantly with a simple tap of an NFC card, eliminating paperwork and delays.',
    color: 'bg-gradient-to-br from-primary-100 to-primary-200',
    iconColor: 'text-primary-600'
  },
  {
    icon: <Stethoscope className="h-10 w-10" />,
    title: 'Role-Based Dashboards',
    description: 'Tailored interfaces for doctors, nurses, and patients, showing only the information relevant to each role.',
    color: 'bg-gradient-to-br from-secondary-100 to-secondary-200',
    iconColor: 'text-secondary-600'
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: 'End-to-End Encryption',
    description: 'Your health data is secure with enterprise-grade encryption and strict access controls.',
    color: 'bg-gradient-to-br from-success-100 to-success-200',
    iconColor: 'text-success-600'
  },
  {
    icon: <Clock className="h-10 w-10" />,
    title: 'Real-Time Updates',
    description: 'All changes to patient records are updated in real-time across all authorized devices.',
    color: 'bg-gradient-to-br from-warning-100 to-warning-200',
    iconColor: 'text-warning-600'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transforming Healthcare with Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform streamlines patient care with modern solutions designed for healthcare professionals and patients.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className={`p-6 ${feature.color}`}>
                <div className={`${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}