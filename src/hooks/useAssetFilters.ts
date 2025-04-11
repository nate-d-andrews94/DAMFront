import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import useAssetStore from '@/store/assetStore';
import AssetService from '@/services/assetService';
import { Asset } from '@/types/asset.types';

interface UseAssetFiltersResult {
  assets: Asset[];
  filteredAssets: Asset[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilterValues: string[];
  setSelectedFilterValues: (values: string[]) => void;
  clearFilters: () => void;
}

const useAssetFilters = (): UseAssetFiltersResult => {
  const { 
    assets, 
    setAssets,
    isLoadingAssets,
    setIsLoadingAssets,
    filterCategories,
    setFilterCategories,
    filterValues,
    setFilterValues,
    selectedFilterValues,
    setSelectedFilterValues,
    searchQuery,
    setSearchQuery
  } = useAssetStore();
  
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch assets
  const { isLoading: isLoadingAssetData } = useQuery(
    'assets',
    () => AssetService.getAssets(),
    {
      onSuccess: (data) => {
        setAssets(data);
        setIsLoadingAssets(false);
      },
      onError: (err: Error) => {
        setError(err);
        setIsLoadingAssets(false);
      },
    }
  );
  
  // Fetch filter categories
  useQuery(
    'filterCategories',
    () => AssetService.getFilterCategories(),
    {
      onSuccess: (data) => {
        setFilterCategories(data);
      },
      onError: (err: Error) => {
        setError(err);
      },
    }
  );
  
  // Fetch filter values
  useQuery(
    'filterValues',
    () => AssetService.getFilterValues(),
    {
      onSuccess: (data) => {
        setFilterValues(data);
      },
      onError: (err: Error) => {
        setError(err);
      },
    }
  );
  
  // When assets or filter state changes, apply filters
  const filteredAssets = useMemo(() => {
    let result = [...assets];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (asset.metadata.description && asset.metadata.description.toLowerCase().includes(query))
      );
    }
    
    // Apply selected filter values
    if (selectedFilterValues.length > 0) {
      result = result.filter(asset => 
        asset.filterAssignments.some(assignment => 
          selectedFilterValues.includes(assignment.filterValueId)
        )
      );
    }
    
    return result;
  }, [assets, searchQuery, selectedFilterValues]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFilterValues([]);
  };
  
  // Set loading state
  useEffect(() => {
    setIsLoadingAssets(isLoadingAssetData);
  }, [isLoadingAssetData, setIsLoadingAssets]);
  
  return {
    assets,
    filteredAssets,
    isLoading: isLoadingAssets,
    error,
    searchQuery,
    setSearchQuery,
    selectedFilterValues,
    setSelectedFilterValues,
    clearFilters
  };
};

export default useAssetFilters;