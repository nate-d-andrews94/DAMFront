import { useQuery } from '@tanstack/react-query';
import { TagService } from '../services/TagService';
import { TagType, FilterCategoryType } from '../services/db/types';

/**
 * Hook for fetching tags from the database
 */
export function useTagsQuery(categoryId?: string) {
  return useQuery<TagType[]>({
    queryKey: ['tags', categoryId],
    queryFn: () => TagService.getTags(categoryId)
  });
}

/**
 * Hook for fetching tags with their categories
 */
export function useTagsWithCategoriesQuery() {
  return useQuery<TagType[]>({
    queryKey: ['tags', 'with-categories'],
    queryFn: () => TagService.getTagsWithCategories()
  });
}

/**
 * Hook for fetching filter categories with their tags
 */
export function useFilterCategoriesQuery() {
  return useQuery<FilterCategoryType[]>({
    queryKey: ['filter-categories'],
    queryFn: () => TagService.getFilterCategories()
  });
}