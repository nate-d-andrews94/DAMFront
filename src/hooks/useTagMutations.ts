import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TagService } from '../services/TagService';
import { TagCreateParams, FilterCategoryCreateParams } from '../services/db/types';

/**
 * Hook providing mutations for tag and filter category operations
 */
export function useTagMutations() {
  const queryClient = useQueryClient();

  const createTag = useMutation({
    mutationFn: (params: TagCreateParams) => TagService.createTag(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      
      // If the tag was added to categories, invalidate those queries
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
    }
  });

  const updateTag = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      TagService.updateTag(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });

  const deleteTag = useMutation({
    mutationFn: (id: string) => TagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
      // Assets with this tag might need to be updated
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  const createFilterCategory = useMutation({
    mutationFn: (params: FilterCategoryCreateParams) => 
      TagService.createFilterCategory(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
    }
  });

  const updateFilterCategory = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      TagService.updateFilterCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
    }
  });

  const deleteFilterCategory = useMutation({
    mutationFn: (id: string) => TagService.deleteFilterCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'with-categories'] });
    }
  });

  const addTagsToCategory = useMutation({
    mutationFn: ({ categoryId, tagIds }: { categoryId: string; tagIds: string[] }) => 
      TagService.addTagsToCategory(categoryId, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'with-categories'] });
    }
  });

  const removeTagsFromCategory = useMutation({
    mutationFn: ({ categoryId, tagIds }: { categoryId: string; tagIds: string[] }) => 
      TagService.removeTagsFromCategory(categoryId, tagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
      queryClient.invalidateQueries({ queryKey: ['tags', 'with-categories'] });
    }
  });

  return {
    createTag,
    updateTag,
    deleteTag,
    createFilterCategory,
    updateFilterCategory,
    deleteFilterCategory,
    addTagsToCategory,
    removeTagsFromCategory
  };
}