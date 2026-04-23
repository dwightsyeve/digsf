import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs, addDoc, serverTimestamp, getDocFromServer, onSnapshot } from 'firebase/firestore';
// auth, db, googleProvider, facebookProvider imports...
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase';
import { formatError } from '../lib/utils';

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  walletBalance?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Listen for real-time updates to the user document
        try {
          unsubscribeSnapshot = onSnapshot(doc(db, 'users', firebaseUser.uid), (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role || 'user',
                avatar: userData.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
                walletBalance: userData.walletBalance || 0,
              } as User);
            } else {
              // Initial sync for social login users without a doc yet
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                lastName: firebaseUser.displayName?.split(' ')[1] || '',
                role: 'user',
                avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
              });
            }
            setLoading(false);
          }, (error) => {
            console.error("User snapshot error:", error);
            // Fallback for offline or permission errors so app isn't stuck
            if (!user) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                lastName: firebaseUser.displayName?.split(' ')[1] || '',
                role: 'user',
              } as User);
            }
            setLoading(false);
          });
        } catch (err) {
          console.error("onSnapshot setup failed:", err);
          setLoading(false);
        }
      } else {
        setUser(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const signIn = async (email: string, password?: string) => {
    try {
      if (!password) throw new Error("Password required");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Check system settings for sign up bonus
      let settings = { signupBonusEnabled: true, signupBonusAmount: 2000 };
      try {
        const settingsDoc = await getDoc(doc(db, 'system', 'settings'));
        if (settingsDoc.exists()) settings = { ...settings, ...settingsDoc.data() };
      } catch (e) {
        // Silent fail for settings
      }
      
      const initialBalance = settings.signupBonusEnabled ? settings.signupBonusAmount : 0;

      const referralCode = firebaseUser.uid.substring(0, 6).toUpperCase();
      
      // Check for referral
      const referredBy = sessionStorage.getItem('referralCode') || new URLSearchParams(window.location.search).get('ref');

      const userData = {
        uid: firebaseUser.uid,
        email,
        firstName,
        lastName,
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
        createdAt: new Date().toISOString(),
        walletBalance: initialBalance,
        totalDeposited: 0,
        totalWithdrawn: 0,
        role: 'user',
        referralCode,
        referredBy: referredBy || null,
        referralEarnings: 0,
        bankDetails: {
          bankName: '',
          accountName: '',
          accountNumber: ''
        }
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Update Profile Details
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });

      sessionStorage.removeItem('referralCode');
      sessionStorage.setItem('isNewSignup', 'true');

      setUser({
        uid: firebaseUser.uid,
        email,
        firstName,
        lastName,
        role: 'user',
        avatar: userData.avatar
      });
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
      await syncUser(firebaseUser);
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, facebookProvider);
      await syncUser(firebaseUser);
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  const syncUser = async (firebaseUser: FirebaseUser) => {
    try {
      const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userSnapshot.exists()) {
        const names = firebaseUser.displayName?.split(' ') || ['User', ''];
        
        let settings = { signupBonusEnabled: true, signupBonusAmount: 2000, referralBonusAmount: 500 };
        try {
          const settingsDoc = await getDoc(doc(db, 'system', 'settings'));
          if (settingsDoc.exists()) settings = { ...settings, ...settingsDoc.data() };
        } catch (e) {
          console.warn("Settings lookup failed, using defaults", e);
        }

        const initialBalance = settings.signupBonusEnabled ? settings.signupBonusAmount : 0;
        const referralCode = firebaseUser.uid.substring(0, 6).toUpperCase();
        const referredBy = sessionStorage.getItem('referralCode') || new URLSearchParams(window.location.search).get('ref');

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName: names[0],
          lastName: names.slice(1).join(' '),
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
          createdAt: new Date().toISOString(),
          walletBalance: initialBalance,
          totalDeposited: 0,
          totalWithdrawn: 0,
          role: 'user',
          referralCode,
          referredBy: referredBy || null,
          referralEarnings: 0,
          bankDetails: {
            bankName: '',
            accountName: '',
            accountNumber: ''
          }
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        sessionStorage.removeItem('referralCode');
        sessionStorage.setItem('isNewSignup', 'true');
      }
    } catch (err) {
      console.error("syncUser failed:", err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      throw new Error(formatError(err));
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      signIn, 
      signUp,
      signInWithGoogle,
      signInWithFacebook,
      resetPassword,
      signOut, 
      isAuthenticated: !!user 
    }}>
      {!loading && children}
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
