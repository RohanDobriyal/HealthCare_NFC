import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, Users, Search, Bell, LogOut, 
  ChevronDown, Filter, User, PlusCircle,
  FileText, BarChart
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseInit';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import NFCReader from '../components/nfc/NFCReader';

interface Patient {
  id: string;
  name: string;
  email: string;
  lastVisit?: string;
  status?: 'Active' | 'Pending' | 'Inactive';
}

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNfcReader, setShowNfcReader] = useState(false);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsRef = collection(db, 'patients');
        const querySnapshot = await getDocs(patientsRef);
        
        const patientData: Patient[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Patient;
          patientData.push({
            id: doc.id,
            name: data.name,
            email: data.email,
            lastVisit: new Date().toISOString().split('T')[0], // Placeholder data
            status: 'Active' // Placeholder data
          });
        });
        
        setPatients(patientData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const handleNFCRead = (data: string) => {
    try {
      const url = new URL(data);
      const patientId = url.searchParams.get('id');
      
      if (patientId) {
        console.log('NFC read successful. Patient ID:', patientId);
        // Here you would typically navigate to the patient's record
        setShowNfcReader(false);
        // For this demo, we'll just log it
      }
    } catch (err) {
      console.error('Invalid NFC data format:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login/staff');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">HealthcareNFC</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </div>
          <a 
            href="#" 
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            Patients
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <BarChart className="h-5 w-5 mr-3 text-gray-500" />
            Analytics
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            Reports
          </a>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Settings
          </div>
          <a 
            href="#" 
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <User className="h-5 w-5 mr-3 text-gray-500" />
            Profile
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            Logout
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
              {userData?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{userData?.displayName || 'Staff User'}</p>
              <p className="text-xs text-gray-500">{userData?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between p-4">
          <div className="flex items-center">
            <button className="mr-2 md:hidden">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Patient Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error-500"></span>
            </button>
            
            <div className="md:hidden">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                {userData?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          {/* Actions Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => setShowNfcReader(!showNfcReader)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                {showNfcReader ? 'Hide NFC Reader' : 'Scan NFC Card'}
              </Button>
              <Button variant="default" className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* NFC Reader */}
          {showNfcReader && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white border border-primary-100 rounded-lg p-6"
            >
              <NFCReader 
                onRead={handleNFCRead}
                autoStart
              />
            </motion.div>
          )}
          
          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Patients</h2>
            </div>
            
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse inline-block">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mt-3 mx-auto"></div>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient, index) => (
                        <tr 
                          key={patient.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                                {patient.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                <div className="text-sm text-gray-500">ID: {patient.id.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${patient.status === 'Active' ? 'bg-success-100 text-success-800' : 
                                patient.status === 'Pending' ? 'bg-warning-100 text-warning-800' : 
                                'bg-gray-100 text-gray-800'}`}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="#" className="text-primary-600 hover:text-primary-900 mr-4">View</a>
                            <a href="#" className="text-primary-600 hover:text-primary-900">Edit</a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredPatients.length}</span> of{' '}
                <span className="font-medium">{patients.length}</span> patients
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}