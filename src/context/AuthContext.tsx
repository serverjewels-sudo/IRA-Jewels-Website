import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loadingAuth: boolean; // support both
  logout: () => Promise<void>;
  
  // State helpers to ensure compile-time and runtime consistency across LuxeLoom pages
  isLoggedIn: boolean;
  customerName: string;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: (val: boolean) => void;
  setCustomerName: (val: string) => void;
  setLoadingAuth: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [customerName, setCustomerName] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const loggedIn = localStorage.getItem('luxeloom_admin_logged_in') === 'true';
    const loginTimeStr = localStorage.getItem('luxeloom_admin_logged_in_time');
    if (loggedIn && loginTimeStr) {
      const loginTime = new Date(loginTimeStr).getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - loginTime < sevenDaysMs) {
        return true;
      }
    }
    return false;
  });

  const initialized = useRef(false);

  // Synchronize user metadata changes securely to state
  const handleUserSessionSync = (currentUser: User | null) => {
    if (currentUser) {
      const metadata = currentUser.user_metadata || {};
      const name = metadata.full_name || metadata.name || metadata.display_name || currentUser.email?.split('@')[0] || 'Client';
      setCustomerName(name);
    } else {
      setCustomerName('');
    }
  };

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    initialized.current = true;

    const checkAdminQuery = async (email?: string) => {
      if (!email) return;
      try {
        const { data } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', email)
          .single();
        if (data) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('luxeloom_admin_logged_in', 'true');
          localStorage.setItem('luxeloom_admin_logged_in_time', new Date().toISOString());
        }
      } catch (err) {
        // Safe to ignore or console.warn when not an admin
      }
    };

    // Get initial session once
    supabase.auth.getSession().then(({ data: { session } }) => {
      const initialUser = session?.user ?? null;
      setUser(initialUser);
      handleUserSessionSync(initialUser);
      setLoading(false);
      if (initialUser?.email) {
        checkAdminQuery(initialUser.email);
      }
    }).catch((err) => {
      console.warn('Initial session lookup error:', err);
      setLoading(false);
    });

    // Single auth listener with cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          handleUserSessionSync(currentUser);
          setLoading(false);
          if (currentUser?.email) {
            checkAdminQuery(currentUser.email);
          }
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setCustomerName('');
          setIsAdminLoggedIn(false);
          localStorage.removeItem('luxeloom_admin_logged_in');
          localStorage.removeItem('luxeloom_admin_logged_in_time');
          setLoading(false);
        }
        if (event === 'TOKEN_REFRESHED') {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          handleUserSessionSync(currentUser);
          if (currentUser?.email) {
            checkAdminQuery(currentUser.email);
          }
        }
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Cleanup on unmount
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    setUser(null);
    setCustomerName('');
    setIsAdminLoggedIn(false);
    localStorage.removeItem('luxeloom_admin_logged_in');
    localStorage.removeItem('luxeloom_admin_logged_in_time');
    setLoading(true);
    await supabase.auth.signOut();
    window.location.replace('/');
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    loadingAuth: loading,
    logout,
    isLoggedIn: !!user,
    customerName,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    setIsLoggedIn: () => {},
    setCustomerName,
    setLoadingAuth: setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
