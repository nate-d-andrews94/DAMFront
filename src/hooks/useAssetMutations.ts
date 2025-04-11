import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetService } from '../services/AssetService';
import { AssetCreateParams, AssetType } from '../services/db/types';

/**
 * Hook providing mutations for asset operations
 */
export function useAssetMutations() {
  const queryClient = useQueryClient();

  const createAsset = useMutation({
    mutationFn: (params: AssetCreateParams) => AssetService.createAsset(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  const updateAssetMetadata = useMutation({
    mutationFn: ({ id, metadata }: { id: string; metadata: Record<string, any> }) => 
      AssetService.updateAssetMetadata(id, metadata),
    onSuccess: (updatedAsset: AssetType) => {
      queryClient.setQueryData(['asset', updatedAsset.id], updatedAsset);
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  const addTagsToAsset = useMutation({
    mutationFn: ({ assetId, tagIds }: { assetId: string; tagIds: string[] }) => 
      AssetService.addTagsToAsset(assetId, tagIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['asset', variables.assetId] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  const removeTagsFromAsset = useMutation({
    mutationFn: ({ assetId, tagIds }: { assetId: string; tagIds: string[] }) => 
      AssetService.removeTagsFromAsset(assetId, tagIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['asset', variables.assetId] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  const deleteAsset = useMutation({
    mutationFn: (id: string) => AssetService.deleteAsset(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['asset', id] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  return {
    createAsset,
    updateAssetMetadata,
    addTagsToAsset,
    removeTagsFromAsset,
    deleteAsset
  };
}