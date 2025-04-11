import { create } from 'zustand';
import { Asset, FilterCategory, FilterValue } from '@/types/asset.types';

interface AssetState {
  // Assets
  assets: Asset[];
  isLoadingAssets: boolean;
  
  // Selected assets for batch operations
  selectedAssets: Asset[];
  
  // Filters
  filterCategories: FilterCategory[];
  filterValues: FilterValue[];
  selectedFilterValues: string[];
  
  // Search
  searchQuery: string;
  
  // Actions
  setAssets: (assets: Asset[]) => void;
  setIsLoadingAssets: (isLoading: boolean) => void;
  setFilterCategories: (categories: FilterCategory[]) => void;
  setFilterValues: (values: FilterValue[]) => void;
  setSelectedFilterValues: (selectedValues: string[]) => void;
  setSearchQuery: (query: string) => void;
  
  // Selection actions
  selectAsset: (asset: Asset) => void;
  deselectAsset: (assetId: string) => void;
  toggleAssetSelection: (asset: Asset) => void;
  clearSelectedAssets: () => void;
  
  // Upload
  uploadedFiles: File[];
  uploadProgress: Record<string, number>;
  isUploading: boolean;
  
  addUploadedFiles: (files: File[]) => void;
  removeUploadedFile: (fileName: string) => void;
  clearUploadedFiles: () => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  setIsUploading: (isUploading: boolean) => void;
}

const useAssetStore = create<AssetState>((set) => ({
  // Assets
  assets: [],
  isLoadingAssets: false,
  
  // Selected assets for batch operations
  selectedAssets: [],
  
  // Filters
  filterCategories: [],
  filterValues: [],
  selectedFilterValues: [],
  
  // Search
  searchQuery: '',
  
  // Upload
  uploadedFiles: [],
  uploadProgress: {},
  isUploading: false,
  
  // Actions
  setAssets: (assets) => set({ assets }),
  setIsLoadingAssets: (isLoading) => set({ isLoadingAssets: isLoading }),
  
  setFilterCategories: (categories) => set({ filterCategories: categories }),
  setFilterValues: (values) => set({ filterValues: values }),
  setSelectedFilterValues: (selectedValues) => set({ selectedFilterValues: selectedValues }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addUploadedFiles: (files) => 
    set((state) => ({ 
      uploadedFiles: [...state.uploadedFiles, ...files] 
    })),
    
  removeUploadedFile: (fileName) => 
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter(file => file.name !== fileName),
      uploadProgress: {
        ...state.uploadProgress,
        [fileName]: undefined
      }
    })),
    
  clearUploadedFiles: () => 
    set({ 
      uploadedFiles: [],
      uploadProgress: {} 
    }),
    
  setUploadProgress: (fileName, progress) => 
    set((state) => ({
      uploadProgress: {
        ...state.uploadProgress,
        [fileName]: progress
      }
    })),
    
  // Selection actions
  selectAsset: (asset) => set((state) => {
    // Only add the asset if it's not already selected
    if (!state.selectedAssets.some(a => a.id === asset.id)) {
      return { selectedAssets: [...state.selectedAssets, asset] };
    }
    return {};
  }),
  
  deselectAsset: (assetId) => set((state) => ({
    selectedAssets: state.selectedAssets.filter(a => a.id !== assetId)
  })),
  
  toggleAssetSelection: (asset) => set((state) => {
    const isSelected = state.selectedAssets.some(a => a.id === asset.id);
    if (isSelected) {
      return {
        selectedAssets: state.selectedAssets.filter(a => a.id !== asset.id)
      };
    } else {
      return {
        selectedAssets: [...state.selectedAssets, asset]
      };
    }
  }),
  
  clearSelectedAssets: () => set({ selectedAssets: [] }),
  
  setIsUploading: (isUploading) => set({ isUploading })
}));

export default useAssetStore;