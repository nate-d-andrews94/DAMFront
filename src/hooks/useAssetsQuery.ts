import { useQuery } from '@tanstack/react-query';
import AssetService from '@/services/assetService';
import { Asset as AssetType } from '@/types/asset.types';
import { AssetQueryParams } from '@/services/db/types';

/**
 * Hook for fetching assets from the database with filtering and pagination
 */
export function useAssetsQuery() {
  return useQuery<AssetType[]>({
    queryKey: ['assets'],
    queryFn: () => AssetService.getAssets()
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