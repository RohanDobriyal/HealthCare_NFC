import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, User, Mail, Phone, Calendar, Lock, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import NFCWriter from '../components/nfc/NFCWriter';

const steps = [
  { name: 'Personal Info', description: 'Your basic information' },
  { name: 'Contact Details', description: 'How we can reach you' },
  { name: 'Account Setup', description: 'Create your login credentials' },
  { name: 'NFC Card Setup', description: 'Optional: Setup your NFC card' }
];

export default function RegisterPatientPage() {
  const navigate = useNavigate();
  const { registerPatient } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation
  const isPersonalInfoValid = firstName.length > 0 && lastName.length > 0 && dateOfBirth.length > 0;
  const isContactValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.length > 9;
  const isPasswordValid = password.length >= 6 && password === confirmPassword;

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return isPersonalInfoValid;
      case 1: return isContactValid;
      case 2: return isPasswordValid;
      case 3: return true; // NFC setup is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) return;
    
    setIsRegistering(true);
    setError(null);
    
    try {
      // Register the patient
      const fullName = `${firstName} ${lastName}`;
      const patientId = await registerPatient(email, password, fullName);
      setPatientId(patientId);
      
      if (currentStep === steps.length - 1) {
        // Last step, registration complete
        setRegistrationComplete(true);
      } else {
        // Move to next step
        handleNext();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">HealthcareNFC</span>
          </Link>
          <nav>
            <Link to="/" className="text-gray-600 hover:text-gray-900">Back to Home</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <h1 className="text-2xl font-bold text-center">Patient Registration</h1>
              <p className="mt-2 opacity-90 text-center">Create your account to access healthcare services</p>
              
              {/* Progress steps */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`flex-1 ${index < steps.length - 1 ? 'relative' : ''}`}
                    >
                      <div 
                        className={`flex flex-col items-center ${index !== currentStep ? 'opacity-70' : ''}`}
                      >
                        <div 
                          className={`h-10 w-10 rounded-full flex items-center justify-center border-2 border-white ${
                            index < currentStep ? 'bg-white text-primary-600' : 
                            index === currentStep ? 'border-white' : 'bg-white/30'
                          }`}
                        >
                          {index < currentStep ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className={index === currentStep ? 'text-white' : ''}>{index + 1}</span>
                          )}
                        </div>
                        <div className="text-xs mt-2 text-center hidden sm:block">
                          {step.name}
                        </div>
                      </div>
                      
                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div 
                          className={`absolute top-5 left-1/2 w-full h-0.5 ${
                            index < currentStep ? 'bg-white' : 'bg-white/30'
                          }`}
                        >
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              {registrationComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
                  <p className="text-gray-600 mb-6">
                    Your patient account has been successfully created.
                  </p>
                  <div className="flex space-x-4 justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/login/patient')}
                    >
                      Go to Login
                    </Button>
                    <Button 
                      onClick={() => navigate('/dashboard/patient')}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Contact Details */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                          <p className="text-sm text-error-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Please enter a valid email address
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            className="pl-10"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Account Setup */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="password"
                            type="password"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        {password && password.length < 6 && (
                          <p className="text-sm text-error-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Password must be at least 6 characters
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            id="confirmPassword"
                            type="password"
                            className="pl-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                          <p className="text-sm text-error-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Passwords do not match
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: NFC Setup (Optional) */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 py-4"
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900">NFC Card Setup</h3>
                        <p className="text-gray-600 mt-2">
                          Configure your NFC card for instant access to your health records
                        </p>
                      </div>

                      {patientId ? (
                        <NFCWriter
                          urlToWrite={`${window.location.origin}/login/patient?id=${patientId}`}
                          onSuccess={() => setRegistrationComplete(true)}
                          className="py-6"
                        />
                      ) : (
                        <div className="flex flex-col items-center py-8">
                          <Button
                            type="submit"
                            disabled={isRegistering}
                            className="mb-4"
                          >
                            {isRegistering ? 'Creating Account...' : 'Create Account First'}
                          </Button>
                          <p className="text-sm text-gray-600">
                            You need to create your account before setting up your NFC card
                          </p>
                        </div>
                      )}
                      <AlertCircle>
                        <div>
                          write the amount u want tot work in
                        </div>
                      </AlertCircle>
                      <div className="text-center text-sm text-gray-600">
                        <p>Don't have an NFC card? No problem!</p>
                        <p>You can set it up later or continue without it.</p>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="p-3 bg-error-50 border border-error-200 text-error-500 rounded-md text-sm flex items-center gap-2 mt-4">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className={currentStep === 0 ? 'invisible' : ''}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    
                    {currentStep < 2 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!isStepValid() || isRegistering}
                      >
                        {currentStep === 2 ? (
                          isRegistering ? 'Creating Account...' : 'Create Account'
                        ) : (
                          'Skip & Complete'
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login/patient" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}