import { useQuery } from '@tanstack/react-query';
import { AssetService } from '../services/AssetService';
import { AssetQueryParams, AssetType } from '../services/db/types';

/**
 * Hook for fetching assets from the database with filtering and pagination
 */
export function useAssetsQuery(params: AssetQueryParams = {}) {
  return useQuery<{ assets: AssetType[], total: number }>({
    queryKey: ['assets', params],
    queryFn: () => AssetService.getAssets(params)
  });
}

/**
 * Hook for fetching a single asset by ID
 */
export function useAssetQuery(id: string | undefined) {
  return useQuery<AssetType | null>({
    queryKey: ['asset', id],
    queryFn: () => id ? AssetService.getAssetById(id) : Promise.resolve(null),
    enabled: !!id
  });
}