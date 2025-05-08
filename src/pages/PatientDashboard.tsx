import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, User, Settings, LogOut, 
  Calendar, Activity, Pill, LineChart, 
  Heart, Thermometer, Clock, Share2, ChevronLeft
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import NFCWriter from '../components/nfc/NFCWriter';

// Mock data for charts
const generateMockData = (days: number, baseValue: number, variance: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1).toISOString().split('T')[0];
    return {
      date,
      value: baseValue + Math.random() * variance * 2 - variance
    };
  });
};

const bloodPressureData = generateMockData(7, 120, 10);
const heartRateData = generateMockData(7, 75, 8);
const temperatureData = generateMockData(7, 98.6, 0.5);

// Mock appointments
const appointments = [
  { id: 1, date: '2025-08-15T10:00:00', doctor: 'Dr. Sarah Johnson', type: 'General Checkup' },
  { id: 2, date: '2025-08-22T14:30:00', doctor: 'Dr. Michael Chen', type: 'Vaccination' },
];

// Mock medications
const medications = [
  { id: 1, name: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours', remaining: 6 },
  { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', remaining: 12 },
];

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login/patient');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Smartphone className="h-6 w-6 text-primary" />
                <span className="ml-2 font-bold text-lg">HealthcareNFC</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2"
                onClick={() => setActivePanel('share')}
              >
                <Share2 className="h-4 w-4" />
                Share Records
              </Button>
              
              <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative">
                <Settings className="h-5 w-5" />
              </button>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {userData?.displayName?.charAt(0) || 'P'}
                </div>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{userData?.displayName || 'Patient'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white overflow-hidden shadow-lg">
            <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {userData?.displayName?.split(' ')[0] || 'Patient'}!
              </h1>
              <p className="text-primary-50 mb-4">
                Your health records at your fingertips. Here's your latest health summary.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setActivePanel('appointments')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Appointments
                </Button>
                <Button 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setActivePanel('medications')}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Medications
                </Button>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Blood Pressure Card */}
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Blood Pressure</h3>
                      <p className="text-sm text-gray-500">Last 7 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">120/80</div>
                    <div className="text-sm text-success-500">Normal</div>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={['dataMin - 10', 'dataMax + 10']}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} mmHg`, 'Blood Pressure']}
                        labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heart Rate Card */}
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-error-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-error-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Heart Rate</h3>
                      <p className="text-sm text-gray-500">Last 7 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">72 BPM</div>
                    <div className="text-sm text-success-500">Normal</div>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={['dataMin - 5', 'dataMax + 5']}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} BPM`, 'Heart Rate']}
                        labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#EF4444" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Temperature Card */}
              <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center">
                      <Thermometer className="h-5 w-5 text-warning-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Temperature</h3>
                      <p className="text-sm text-gray-500">Last 7 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">98.6°F</div>
                    <div className="text-sm text-success-500">Normal</div>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}°F`, 'Temperature']}
                        labelFormatter={(date) => format(parseISO(date as string), 'MMM d, yyyy')}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#F59E0B" 
                        activeDot={{ r: 6 }} 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                <li className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-medium text-gray-900">Annual Physical</h3>
                        <span className="text-sm text-gray-500">3 days ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Completed annual physical examination with Dr. Sarah Johnson. 
                        All results within normal ranges.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                      <Activity className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-medium text-gray-900">Blood Test Results</h3>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Blood test results have been added to your records. 
                        Click to view the detailed report.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                      <Pill className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-medium text-gray-900">Prescription Renewal</h3>
                        <span className="text-sm text-gray-500">2 weeks ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Dr. Chen renewed your prescription for Lisinopril. 
                        Ready for pickup at your pharmacy.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="px-4 py-3 bg-gray-50 text-center text-sm">
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  View all activity
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sliding Panels */}
      {activePanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
          onClick={closePanel}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 mr-2"
                  onClick={closePanel}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activePanel === 'appointments' && 'Upcoming Appointments'}
                  {activePanel === 'medications' && 'Medications'}
                  {activePanel === 'share' && 'Share Health Records'}
                </h2>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 70px)' }}>
              {activePanel === 'appointments' && (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{appointment.type}</h3>
                        <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          Confirmed
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {format(parseISO(appointment.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {format(parseISO(appointment.date), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold mr-2">
                          {appointment.doctor.split(' ')[1].charAt(0)}
                        </div>
                        <span className="text-gray-800">{appointment.doctor}</span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Reschedule
                        </Button>
                        <Button size="sm" className="flex-1 bg-primary-500 text-white">
                          Check In
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full">
                    Schedule New Appointment
                  </Button>
                </div>
              )}

              {activePanel === 'medications' && (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div key={medication.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                        <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </div>
                      </div>
                      <div className="text-gray-700 mb-1">
                        {medication.dosage}
                      </div>
                      <div className="text-gray-500 text-sm mb-3">
                        {medication.frequency}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Remaining: <span className="font-medium">{medication.remaining} days</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Request Refill
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-3">
                      Talk to your doctor before starting any new medications
                    </p>
                    <Button variant="outline" className="w-full">
                      View Medication History
                    </Button>
                  </div>
                </div>
              )}

              {activePanel === 'share' && (
                <div className="space-y-6">
                  <div className="text-gray-600">
                    <p className="mb-4">
                      Share your health records securely with healthcare providers or family members.
                    </p>
                  </div>

                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-primary-800 mb-2">
                      NFC Card Setup
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Write your patient ID to an NFC card for quick access to your records.
                    </p>
                    
                    <NFCWriter
                      urlToWrite={`${window.location.origin}/login/patient?id=${user?.uid || 'demo-patient-id'}`}
                      className="py-2"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Share Options
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Healthcare Provider</div>
                            <div className="text-sm text-gray-500">Share with your doctor</div>
                          </div>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <Users className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Family Member</div>
                            <div className="text-sm text-gray-500">Share with a trusted family member</div>
                          </div>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Export Records</div>
                            <div className="text-sm text-gray-500">Download a copy of your records</div>
                          </div>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}