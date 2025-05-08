// src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  type User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseInit';

type UserRole = 'doctor' | 'nurse' | 'patient';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string, expectedRole: UserRole) => Promise<void>;
  loginWithGoogle: (expectedRole: UserRole) => Promise<void>;
  registerPatient: (email: string, password: string, name: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: userDoc.data().role as UserRole
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string, expectedRole: UserRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) throw new Error('No user profile found');

      const userData = userDoc.data();
      if (userData.role !== expectedRole && !(expectedRole === 'doctor' || expectedRole === 'nurse' ? ['doctor', 'nurse'].includes(userData.role) : false)) {
        await firebaseSignOut(auth);
        throw new Error('Unauthorized login attempt.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (expectedRole: UserRole) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: expectedRole,
          createdAt: serverTimestamp()
        });
      } else {
        const userData = userDoc.data();
        if (userData.role !== expectedRole && !(expectedRole === 'doctor' || expectedRole === 'nurse' ? ['doctor', 'nurse'].includes(userData.role) : false)) {
          await firebaseSignOut(auth);
          throw new Error('Unauthorized Google login attempt.');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const registerPatient = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'patient',
        createdAt: serverTimestamp()
      });

      await setDoc(doc(db, 'patients', user.uid), {
        id: user.uid,
        name,
        email: user.email,
        createdAt: serverTimestamp(),
        history: [],
        nfcProfileUrl: `${window.location.origin}/login/patient?id=${user.uid}`
      });

      return user.uid;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    loginWithEmail,
    loginWithGoogle,
    registerPatient,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
