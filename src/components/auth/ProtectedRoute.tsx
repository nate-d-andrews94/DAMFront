import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    action: string;
    resourceType: string;
    resourceId?: string;
  };
}

/**
 * Component to protect routes that require authentication
 * Optionally checks for specific permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, isInitialized, hasPermission } = useAuth();
  const location = useLocation();
  
  // Wait until auth is initialized
  if (!isInitialized) {
    return <LoadingScreen message="Loading authentication..." />;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check for required permission
  if (requiredPermission) {
    const { action, resourceType, resourceId } = requiredPermission;
    
    if (!hasPermission(action, resourceType, resourceId)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;