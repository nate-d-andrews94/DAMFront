import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthService from '@/services/AuthService';
import { User, UserCredentials, AuthResponse } from '@/types/user.types';

interface AuthContextProps {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: UserCredentials) => Promise<AuthResponse>;
  logout: () => void;
  register: (userData: Partial<User> & UserCredentials) => Promise<AuthResponse>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
  hasPermission: (action: string, resourceType: string, resourceId?: string) => boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        
        if (isAuth) {
          const currentUser = AuthService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Login with email and password
   */
  const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Logout current user
   */
  const logout = (): void => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  /**
   * Register a new user
   */
  const register = async (userData: Partial<User> & UserCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(userData);
      
      // In a real app, we might not set the user here if registration requires admin approval
      // For demo purposes, we'll update the state anyway
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update user profile
   */
  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Check if user has permission
   */
  const hasPermission = (action: string, resourceType: string, resourceId?: string): boolean => {
    return AuthService.hasPermission(action as any, resourceType as any, resourceId);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        isLoading,
        user,
        login,
        logout,
        register,
        updateProfile,
        hasPermission,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;