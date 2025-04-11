import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderService } from '../services/FolderService';
import { FolderCreateParams, FolderType } from '../services/db/types';

/**
 * Hook providing mutations for folder operations
 */
export function useFolderMutations() {
  const queryClient = useQueryClient();

  const createFolder = useMutation({
    mutationFn: (params: FolderCreateParams) => FolderService.createFolder(params),
    onSuccess: (newFolder: FolderType) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folders', newFolder.parentId] });
    }
  });

  const updateFolder = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      FolderService.updateFolder(id, name),
    onSuccess: (updatedFolder: FolderType) => {
      queryClient.setQueryData(['folder', updatedFolder.id], updatedFolder);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folders', updatedFolder.parentId] });
    }
  });

  const moveFolder = useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId: string | null }) => 
      FolderService.moveFolder(id, newParentId),
    onSuccess: (movedFolder: FolderType, variables) => {
      queryClient.setQueryData(['folder', movedFolder.id], movedFolder);
      
      // We need to invalidate both the old and new parent's child folders
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      
      // Get the old folder to find its old parent
      const oldFolder = queryClient.getQueryData<FolderType>(['folder', variables.id]);
      if (oldFolder?.parentId) {
        queryClient.invalidateQueries({ queryKey: ['folders', oldFolder.parentId] });
      }
      
      // Invalidate the new parent's children
      if (variables.newParentId) {
        queryClient.invalidateQueries({ queryKey: ['folders', variables.newParentId] });
      }
    }
  });

  const deleteFolder = useMutation({
    mutationFn: (id: string) => FolderService.deleteFolder(id),
    onSuccess: (_data, id) => {
      // Get the folder to find its parent
      const folder = queryClient.getQueryData<FolderType>(['folder', id]);
      
      queryClient.removeQueries({ queryKey: ['folder', id] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      
      // Invalidate the parent's children
      if (folder?.parentId) {
        queryClient.invalidateQueries({ queryKey: ['folders', folder.parentId] });
      }
    }
  });

  return {
    createFolder,
    updateFolder,
    moveFolder,
    deleteFolder
  };
}