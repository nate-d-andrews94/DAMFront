import api from './api';
import { v4 as uuidv4 } from 'uuid';
import { Asset, FilterCategory, FilterValue } from '@/types/asset.types';

// Mock data for development
const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Sample Image 1.jpg',
    fileUrl: '/mock/sample1.jpg',
    thumbnailUrl: '/mock/sample1_thumb.jpg',
    fileType: 'jpg',
    mimeType: 'image/jpeg',
    size: 1024 * 1024 * 2.5, // 2.5MB
    uploadedBy: 'user1',
    uploadedAt: '2025-03-15T10:30:00Z',
    tags: ['sample', 'image', 'marketing'],
    folder: 'marketing',
    version: 1,
    metadata: {
      width: 1920,
      height: 1080,
      description: 'Sample marketing image'
    },
    filterAssignments: [
      {
        assetId: '1',
        filterValueId: '101',
        assignedAt: '2025-03-15T10:35:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Product Brochure.pdf',
    fileUrl: '/mock/brochure.pdf',
    thumbnailUrl: '/mock/brochure_thumb.jpg',
    fileType: 'pdf',
    mimeType: 'application/pdf',
    size: 1024 * 1024 * 3.2, // 3.2MB
    uploadedBy: 'user2',
    uploadedAt: '2025-03-10T14:20:00Z',
    tags: ['brochure', 'product', 'sales'],
    folder: 'sales',
    version: 2,
    metadata: {
      author: 'Marketing Team',
      createdAt: '2025-03-01T09:00:00Z',
      description: 'Product line brochure for Q2 2025'
    },
    filterAssignments: [
      {
        assetId: '2',
        filterValueId: '102',
        assignedAt: '2025-03-10T14:25:00Z'
      }
    ]
  }
];

const mockFilterCategories: FilterCategory[] = [
  {
    id: '1',
    name: 'Industry',
    description: 'Industry sector categories',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Document Type',
    description: 'Types of documents',
    createdAt: '2025-02-01T00:00:00Z'
  }
];

const mockFilterValues: FilterValue[] = [
  {
    id: '101',
    categoryId: '1',
    value: 'Healthcare',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '102',
    categoryId: '1',
    value: 'Technology',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '103',
    categoryId: '1',
    value: 'Finance',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '201',
    categoryId: '2',
    value: 'Brochure',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '202',
    categoryId: '2',
    value: 'Whitepaper',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: '203',
    categoryId: '2',
    value: 'Case Study',
    createdAt: '2025-02-01T00:00:00Z'
  }
];

// Simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Asset Service
export const AssetService = {
  // Get all assets
  getAssets: async (): Promise<Asset[]> => {
    try {
      // When API is ready:
      // const response = await api.get('/assets');
      // return response.data;
      
      // For development, return mock data with delay
      await delay(800);
      return mockAssets;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },
  
  // Get asset by ID
  getAssetById: async (id: string): Promise<Asset> => {
    try {
      // When API is ready:
      // const response = await api.get(`/assets/${id}`);
      // return response.data;
      
      // For development, return mock data with delay
      await delay(500);
      const asset = mockAssets.find(a => a.id === id);
      if (!asset) {
        throw new Error('Asset not found');
      }
      return asset;
    } catch (error) {
      console.error(`Error fetching asset ${id}:`, error);
      throw error;
    }
  },
  
  // Upload assets
  uploadAssets: async (files: File[], onProgress?: (fileName: string, progress: number) => void): Promise<Asset[]> => {
    try {
      // For development, simulate upload with delay and progress
      const createdAssets: Asset[] = [];
      
      for (const file of files) {
        // Simulate progress updates
        if (onProgress) {
          for (let progress = 0; progress <= 100; progress += 10) {
            onProgress(file.name, progress);
            await delay(200);
          }
        } else {
          await delay(1000);
        }
        
        // Create mock asset
        const newAsset: Asset = {
          id: uuidv4(),
          name: file.name,
          fileUrl: URL.createObjectURL(file),
          thumbnailUrl: '',
          fileType: file.name.split('.').pop() as string,
          mimeType: file.type,
          size: file.size,
          uploadedBy: 'current-user',
          uploadedAt: new Date().toISOString(),
          tags: [],
          folder: 'uploads',
          version: 1,
          metadata: {
            lastModified: new Date(file.lastModified).toISOString()
          },
          filterAssignments: []
        };
        
        createdAssets.push(newAsset);
      }
      
      return createdAssets;
      
      // When API is ready:
      // const formData = new FormData();
      // files.forEach(file => {
      //   formData.append('files', file);
      // });
      // 
      // const response = await api.post('/assets/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   },
      //   onUploadProgress: (progressEvent) => {
      //     if (onProgress && progressEvent.total) {
      //       const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //       onProgress(progress);
      //     }
      //   }
      // });
      // 
      // return response.data;
    } catch (error) {
      console.error('Error uploading assets:', error);
      throw error;
    }
  },
  
  // Get filter categories
  getFilterCategories: async (): Promise<FilterCategory[]> => {
    try {
      // When API is ready:
      // const response = await api.get('/filters/categories');
      // return response.data;
      
      // For development, return mock data with delay
      await delay(500);
      return mockFilterCategories;
    } catch (error) {
      console.error('Error fetching filter categories:', error);
      throw error;
    }
  },
  
  // Get filter values
  getFilterValues: async (): Promise<FilterValue[]> => {
    try {
      // When API is ready:
      // const response = await api.get('/filters/values');
      // return response.data;
      
      // For development, return mock data with delay
      await delay(500);
      return mockFilterValues;
    } catch (error) {
      console.error('Error fetching filter values:', error);
      throw error;
    }
  },
  
  // Create filter category
  createFilterCategory: async (category: Omit<FilterCategory, 'id' | 'createdAt'>): Promise<FilterCategory> => {
    try {
      // When API is ready:
      // const response = await api.post('/filters/categories', category);
      // return response.data;
      
      // For development, create mock category with delay
      await delay(500);
      return {
        id: uuidv4(),
        ...category,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating filter category:', error);
      throw error;
    }
  },
  
  // Create filter value
  createFilterValue: async (value: Omit<FilterValue, 'id' | 'createdAt'>): Promise<FilterValue> => {
    try {
      // When API is ready:
      // const response = await api.post('/filters/values', value);
      // return response.data;
      
      // For development, create mock value with delay
      await delay(500);
      return {
        id: uuidv4(),
        ...value,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating filter value:', error);
      throw error;
    }
  }
};

export default AssetService;