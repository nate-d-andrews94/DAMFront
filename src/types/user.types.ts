export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  position?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'pending';
  groups: string[];
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: string[]; // User IDs
  permissions: Permission[];
}

export type PermissionAction = 'view' | 'download' | 'edit' | 'delete' | 'share' | 'upload' | 'manage_users' | 'manage_groups' | 'manage_permissions';

export type ResourceType = 'asset' | 'folder' | 'tag' | 'user' | 'group' | 'system';

export interface Permission {
  id: string;
  action: PermissionAction;
  resourceType: ResourceType;
  resourceId?: string; // Optional - if undefined, applies to all resources of the type
  conditions?: {
    departmentMatch?: boolean; // Only grant permission if user's department matches the asset's department
    creatorOnly?: boolean; // Only grant permission if user created the resource
    expiresAt?: string; // Permission expires after this date
    ipRestriction?: string[]; // Restrict to specific IP addresses
  };
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Pre-defined permission sets for roles
export const RolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { id: 'admin-all', action: 'view', resourceType: 'system' },
    { id: 'admin-manage', action: 'manage_users', resourceType: 'system' },
    { id: 'admin-groups', action: 'manage_groups', resourceType: 'system' },
    { id: 'admin-perms', action: 'manage_permissions', resourceType: 'system' }
  ],
  manager: [
    { id: 'manager-view', action: 'view', resourceType: 'asset' },
    { id: 'manager-download', action: 'download', resourceType: 'asset' },
    { id: 'manager-edit', action: 'edit', resourceType: 'asset' },
    { id: 'manager-share', action: 'share', resourceType: 'asset' },
    { id: 'manager-upload', action: 'upload', resourceType: 'asset' }
  ],
  editor: [
    { id: 'editor-view', action: 'view', resourceType: 'asset' },
    { id: 'editor-download', action: 'download', resourceType: 'asset' },
    { id: 'editor-edit', action: 'edit', resourceType: 'asset' },
    { id: 'editor-upload', action: 'upload', resourceType: 'asset' }
  ],
  viewer: [
    { id: 'viewer-view', action: 'view', resourceType: 'asset' },
    { id: 'viewer-download', action: 'download', resourceType: 'asset' }
  ]
};