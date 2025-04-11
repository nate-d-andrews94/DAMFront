export type AssetType = {
  id: string;
  filename: string;
  folderId: string | null;
  filePath: string;
  fileSize: number;
  mimeType: string;
  extension: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  tags?: TagType[];
  thumbnails?: ThumbnailType[];
};

export type FolderType = {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TagType = {
  id: string;
  name: string;
  createdAt: Date;
  categories?: FilterCategoryType[];
};

export type FilterCategoryType = {
  id: string;
  name: string;
  createdAt: Date;
  tags?: TagType[];
};

export type ThumbnailType = {
  id: string;
  assetId: string;
  size: 'small' | 'medium' | 'large';
  width: number;
  height: number;
  filePath: string;
  createdAt: Date;
};

// Request/response types for API endpoints
export type AssetCreateParams = {
  filename: string;
  folderId?: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  extension: string;
  metadata?: Record<string, any>;
};

export type AssetQueryParams = {
  search?: string;
  folderId?: string;
  tags?: string[];
  mimeTypes?: string[];
  sortBy?: 'filename' | 'createdAt' | 'updatedAt' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

export type FolderCreateParams = {
  name: string;
  parentId?: string;
};

export type TagCreateParams = {
  name: string;
  categoryIds?: string[];
};

export type FilterCategoryCreateParams = {
  name: string;
};
