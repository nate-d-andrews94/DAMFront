export type AssetType = 'image' | 'document' | 'video' | 'audio' | 'other';

export type FileExtension = 
  | 'jpg' | 'jpeg' | 'png' | 'gif' | 'svg' | 'webp'  // Images
  | 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt'  // Documents
  | 'mp4' | 'webm' | 'mov' | 'avi'  // Videos
  | 'mp3' | 'wav' | 'ogg'  // Audio
  | string;  // Other types

export interface Asset {
  id: string;
  name: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileType: FileExtension;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  folder: string;
  version: number;
  metadata: AssetMetadata;
  filterAssignments: FilterAssignment[];
}

export interface AssetMetadata {
  description?: string;
  width?: number;
  height?: number;
  duration?: number;
  author?: string;
  createdAt?: string;
  lastModified?: string;
  customFields?: Record<string, string | number | boolean>;
}

export interface FilterCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface FilterValue {
  id: string;
  categoryId: string;
  value: string;
  createdAt: string;
}

export interface FilterAssignment {
  assetId: string;
  filterValueId: string;
  assignedAt: string;
}

export interface SharedLink {
  id: string;
  assetId: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  contextData?: Record<string, string>;
  token: string;
}

export interface AssetActivity {
  id: string;
  assetId: string;
  sharedLinkId?: string;
  action: 'view' | 'download' | 'share';
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  contextData?: Record<string, string>;
}