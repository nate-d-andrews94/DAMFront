-- Initialize DAM database schema

-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create folders table to organize assets
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, name)
);

-- Create assets table to store file metadata
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(127) NOT NULL,
  extension VARCHAR(20) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(folder_id, filename)
);

-- Create tags table for categorizing assets
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for assets and tags (many-to-many)
CREATE TABLE asset_tags (
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, tag_id)
);

-- Create filter categories for organizing tags
CREATE TABLE filter_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for tags and filter categories (many-to-many)
CREATE TABLE category_tags (
  category_id UUID REFERENCES filter_categories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (category_id, tag_id)
);

-- Create assets thumbnails table for different thumbnail sizes
CREATE TABLE asset_thumbnails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  size VARCHAR(20) NOT NULL, -- e.g., 'small', 'medium', 'large'
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(asset_id, size)
);

-- Create root folder
INSERT INTO folders (id, name, path) VALUES (uuid_generate_v4(), 'Root', '/');
