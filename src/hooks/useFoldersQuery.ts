import { useQuery } from '@tanstack/react-query';
import { FolderService } from '../services/FolderService';
import { FolderType } from '../services/db/types';

/**
 * Hook for fetching folders from the database
 */
export function useFoldersQuery(parentId?: string) {
  return useQuery<FolderType[]>({
    queryKey: ['folders', parentId],
    queryFn: () => FolderService.getFolders(parentId)
  });
}

/**
 * Hook for fetching a single folder by ID
 */
export function useFolderQuery(id: string | undefined) {
  return useQuery<FolderType | null>({
    queryKey: ['folder', id],
    queryFn: () => id ? FolderService.getFolderById(id) : Promise.resolve(null),
    enabled: !!id
  });
}