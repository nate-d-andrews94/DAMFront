import { v4 as uuidv4 } from 'uuid';
import {
  User,
  UserRole,
  UserCredentials,
  AuthResponse,
  Permission,
  RolePermissions
} from '@/types/user.types';

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    avatar: '/mock/avatars/admin.jpg',
    department: 'IT',
    position: 'System Administrator',
    createdAt: '2025-01-01T00:00:00Z',
    lastLogin: '2025-04-10T08:30:00Z',
    status: 'active',
    groups: ['admins']
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Marketing Manager',
    role: 'manager',
    avatar: '/mock/avatars/manager.jpg',
    department: 'Marketing',
    position: 'Marketing Manager',
    createdAt: '2025-01-10T00:00:00Z',
    lastLogin: '2025-04-09T12:45:00Z',
    status: 'active',
    groups: ['marketing', 'leadership']
  },
  {
    id: '3',
    email: 'editor@example.com',
    name: 'Content Editor',
    role: 'editor',
    avatar: '/mock/avatars/editor.jpg',
    department: 'Marketing',
    position: 'Content Specialist',
    createdAt: '2025-02-15T00:00:00Z',
    lastLogin: '2025-04-10T10:15:00Z',
    status: 'active',
    groups: ['marketing', 'content-team']
  },
  {
    id: '4',
    email: 'viewer@example.com',
    name: 'Sales Rep',
    role: 'viewer',
    avatar: '/mock/avatars/viewer.jpg',
    department: 'Sales',
    position: 'Sales Representative',
    createdAt: '2025-03-01T00:00:00Z',
    lastLogin: '2025-04-08T16:20:00Z',
    status: 'active',
    groups: ['sales']
  },
  {
    id: '5',
    email: 'pending@example.com',
    name: 'Pending User',
    role: 'viewer',
    department: 'Marketing',
    position: 'Intern',
    createdAt: '2025-04-05T00:00:00Z',
    status: 'pending',
    groups: []
  },
  {
    id: '6',
    email: 'inactive@example.com',
    name: 'Former Employee',
    role: 'viewer',
    department: 'Finance',
    position: 'Accountant',
    createdAt: '2025-01-15T00:00:00Z',
    lastLogin: '2025-02-28T09:10:00Z',
    status: 'inactive',
    groups: []
  }
];

// Mock group data
const mockGroups = [
  {
    id: 'admins',
    name: 'Administrators',
    description: 'System administrators with full access',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    members: ['1'],
    permissions: [
      { id: 'admin-all-system', action: 'view', resourceType: 'system' },
      { id: 'admin-manage-users', action: 'manage_users', resourceType: 'system' }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Team',
    description: 'All marketing department staff',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z',
    members: ['2', '3', '5'],
    permissions: [
      { id: 'marketing-asset-view', action: 'view', resourceType: 'asset' },
      { id: 'marketing-asset-download', action: 'download', resourceType: 'asset' },
      { id: 'marketing-asset-edit', action: 'edit', resourceType: 'asset' }
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership Team',
    description: 'Executive and management staff',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-02-10T00:00:00Z',
    members: ['2'],
    permissions: [
      { id: 'leadership-view-all', action: 'view', resourceType: 'asset' },
      { id: 'leadership-download-all', action: 'download', resourceType: 'asset' }
    ]
  },
  {
    id: 'sales',
    name: 'Sales Team',
    description: 'All sales department staff',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z',
    members: ['4'],
    permissions: [
      { id: 'sales-view-approved', action: 'view', resourceType: 'asset' },
      { id: 'sales-download-approved', action: 'download', resourceType: 'asset' }
    ]
  },
  {
    id: 'content-team',
    name: 'Content Team',
    description: 'Content creators and editors',
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
    members: ['3'],
    permissions: [
      { id: 'content-asset-edit', action: 'edit', resourceType: 'asset' },
      { id: 'content-asset-upload', action: 'upload', resourceType: 'asset' }
    ]
  }
];

// Simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Token storage keys
const TOKEN_KEY = 'dam_auth_token';
const USER_KEY = 'dam_user';
const TOKEN_EXPIRY_KEY = 'dam_token_expiry';

/**
 * Service for handling authentication and user management
 */
class AuthService {
  /**
   * Login with email and password
   */
  static async login(credentials: UserCredentials): Promise<AuthResponse> {
    await delay(800); // Simulate network request
    
    // Find user by email
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.status === 'active'
    );
    
    if (!user) {
      throw new Error('Invalid credentials or inactive account');
    }
    
    // In a real app, we would verify the password here
    // For demo, we'll assume any password works
    
    // Generate a token
    const token = `token_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000 * 24).toISOString(); // 24 hours
    
    // Update last login time
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    
    // Store auth data in localStorage
    this.setSession({
      user: updatedUser,
      token,
      expiresAt
    });
    
    return {
      user: updatedUser,
      token,
      expiresAt
    };
  }
  
  /**
   * Register a new user
   */
  static async register(userData: Partial<User> & UserCredentials): Promise<AuthResponse> {
    await delay(1000); // Simulate network request
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      role: userData.role || 'viewer',
      department: userData.department,
      position: userData.position,
      avatar: userData.avatar,
      createdAt: new Date().toISOString(),
      status: 'pending', // New users start as pending until approved
      groups: []
    };
    
    // Add to mock data
    mockUsers.push(newUser);
    
    // Generate a token
    const token = `token_${uuidv4()}`;
    const expiresAt = new Date(Date.now() + 3600 * 1000 * 24).toISOString(); // 24 hours
    
    // In a real app, this would be an API call and the token would not be returned immediately
    // since the user is pending approval
    
    return {
      user: newUser,
      token,
      expiresAt
    };
  }
  
  /**
   * Logout current user
   */
  static logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    
    // In a real app, we might also want to invalidate the token on the server
  }
  
  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiryStr) {
      return false;
    }
    
    // Check if token is expired
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    return expiry > now;
  }
  
  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  /**
   * Get authentication token
   */
  static getToken(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    return localStorage.getItem(TOKEN_KEY);
  }
  
  /**
   * Check if current user has permission
   */
  static hasPermission(
    action: Permission['action'],
    resourceType: Permission['resourceType'],
    resourceId?: string
  ): boolean {
    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }
    
    // Admins have all permissions
    if (user.role === 'admin') {
      return true;
    }
    
    // Get role-based permissions
    const rolePerms = RolePermissions[user.role] || [];
    
    // Check role permissions
    const hasRolePerm = rolePerms.some(p => {
      // Direct match on action and resource type
      if (p.action === action && p.resourceType === resourceType) {
        // If resourceId is specified, check that too
        if (resourceId && p.resourceId) {
          return p.resourceId === resourceId;
        }
        // If no resourceId check needed or permission applies to all
        return true;
      }
      return false;
    });
    
    if (hasRolePerm) {
      return true;
    }
    
    // ToDo: Check group permissions by fetching from API
    // For now, return false for non-admins without role permission
    return false;
  }
  
  /**
   * Update current user profile
   */
  static async updateProfile(userData: Partial<User>): Promise<User> {
    await delay(800); // Simulate network request
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    // Update user data
    const updatedUser = {
      ...currentUser,
      ...userData,
      // Don't allow updating these fields
      id: currentUser.id,
      role: currentUser.role,
      status: currentUser.status,
      createdAt: currentUser.createdAt
    };
    
    // Update in mock data
    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }
    
    // Update in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  }
  
  /**
   * Get all users (admin only)
   */
  static async getUsers(): Promise<User[]> {
    await delay(800); // Simulate network request
    
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    return [...mockUsers];
  }
  
  /**
   * Get user by ID (admin only)
   */
  static async getUserById(userId: string): Promise<User | null> {
    await delay(500); // Simulate network request
    
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    return mockUsers.find(u => u.id === userId) || null;
  }
  
  /**
   * Update user (admin only)
   */
  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    await delay(800); // Simulate network request
    
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      // Don't allow updating these fields
      id: mockUsers[userIndex].id,
      createdAt: mockUsers[userIndex].createdAt
    };
    
    mockUsers[userIndex] = updatedUser;
    
    // If updating the current user, update localStorage too
    if (userId === currentUser.id) {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  }
  
  /**
   * Store authentication data in localStorage
   */
  private static setSession(authData: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    localStorage.setItem(TOKEN_EXPIRY_KEY, authData.expiresAt);
  }
}

export default AuthService;