import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAssetStore from '@/store/assetStore';
import AssetService from '@/services/assetService';
import { Asset, FilterCategory, FilterValue } from '@/types/asset.types';

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
  filterCategories: FilterCategory[];
  filterValues: FilterValue[];
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

  // Use a single effect to fetch data instead of multiple queries
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingAssets(true);
        
        // Fetch assets
        const assetsData = await AssetService.getAssets();
        setAssets(assetsData);
        
        // Fetch categories
        const categoriesData = await AssetService.getFilterCategories();
        setFilterCategories(categoriesData);
        
        // Fetch values
        const valuesData = await AssetService.getFilterValues();
        setFilterValues(valuesData);
        
        setIsLoadingAssets(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err as Error);
        setIsLoadingAssets(false);
      }
    };
    
    fetchData();
  }, [setAssets, setFilterCategories, setFilterValues, setIsLoadingAssets]);
  
  // When assets or filter state changes, apply filters
  const filteredAssets = useMemo(() => {
    // Handle case where assets might be undefined or null
    if (!assets || !Array.isArray(assets)) {
      return [];
    }
    
    let result = [...assets];
    
    // Apply search query filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        (Array.isArray(asset.tags) && asset.tags.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(query)
        )) ||
        (asset.metadata && asset.metadata.description && 
         asset.metadata.description.toLowerCase().includes(query))
      );
    }
    
    // Apply selected filter values
    if (selectedFilterValues && selectedFilterValues.length > 0) {
      result = result.filter(asset => 
        Array.isArray(asset.filterAssignments) && 
        asset.filterAssignments.some(assignment => 
          assignment && selectedFilterValues.includes(assignment.filterValueId)
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
  
  // No need for this effect since we're directly setting loading state in our fetch useEffect
  
  return {
    assets,
    filteredAssets,
    isLoading: isLoadingAssets,
    error,
    searchQuery,
    setSearchQuery,
    selectedFilterValues,
    setSelectedFilterValues,
    clearFilters,
    filterCategories,
    filterValues
  };
};

export default useAssetFilters;