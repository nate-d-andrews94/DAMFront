import db from './db';
import { TagType, TagCreateParams, FilterCategoryType, FilterCategoryCreateParams } from './db/types';

/**
 * Service for handling tag and filter category operations
 */
export class TagService {
  /**
   * Create a new tag
   */
  static async createTag(params: TagCreateParams): Promise<TagType> {
    return db.transaction(async (client) => {
      // Insert the tag
      const [tag] = await client.query<TagType>(
        `INSERT INTO tags (name)
         VALUES ($1)
         RETURNING id, name, created_at as "createdAt"`,
        [params.name]
      );
      
      // Associate with categories if provided
      if (params.categoryIds && params.categoryIds.length > 0) {
        const valuesSql = params.categoryIds.map((_, i) => `($1, $${i + 2})`).join(', ');
        
        await client.query(
          `INSERT INTO category_tags (tag_id, category_id)
           VALUES ${valuesSql}
           ON CONFLICT DO NOTHING`,
          [tag.id, ...params.categoryIds]
        );
      }
      
      return tag;
    });
  }

  /**
   * Get all tags, optionally filtered by category
   */
  static async getTags(categoryId?: string): Promise<TagType[]> {
    if (categoryId) {
      return db.query<TagType>(
        `SELECT t.id, t.name, t.created_at as "createdAt"
         FROM tags t
         JOIN category_tags ct ON t.id = ct.tag_id
         WHERE ct.category_id = $1
         ORDER BY t.name ASC`,
        [categoryId]
      );
    }
    
    return db.query<TagType>(
      `SELECT id, name, created_at as "createdAt"
       FROM tags
       ORDER BY name ASC`
    );
  }

  /**
   * Get tags with their categories
   */
  static async getTagsWithCategories(): Promise<TagType[]> {
    const tags = await db.query<TagType>(
      `SELECT id, name, created_at as "createdAt"
       FROM tags
       ORDER BY name ASC`
    );
    
    // For each tag, get its categories
    for (const tag of tags) {
      const categories = await db.query<FilterCategoryType>(
        `SELECT fc.id, fc.name, fc.created_at as "createdAt"
         FROM filter_categories fc
         JOIN category_tags ct ON fc.id = ct.category_id
         WHERE ct.tag_id = $1
         ORDER BY fc.name ASC`,
        [tag.id]
      );
      
      tag.categories = categories;
    }
    
    return tags;
  }

  /**
   * Update a tag
   */
  static async updateTag(id: string, name: string): Promise<TagType> {
    const [tag] = await db.query<TagType>(
      `UPDATE tags
       SET name = $1
       WHERE id = $2
       RETURNING id, name, created_at as "createdAt"`,
      [name, id]
    );
    
    return tag;
  }

  /**
   * Delete a tag
   */
  static async deleteTag(id: string): Promise<void> {
    await db.query('DELETE FROM tags WHERE id = $1', [id]);
  }

  /**
   * Create a new filter category
   */
  static async createFilterCategory(params: FilterCategoryCreateParams): Promise<FilterCategoryType> {
    const [category] = await db.query<FilterCategoryType>(
      `INSERT INTO filter_categories (name)
       VALUES ($1)
       RETURNING id, name, created_at as "createdAt"`,
      [params.name]
    );
    
    return category;
  }

  /**
   * Get all filter categories with their tags
   */
  static async getFilterCategories(): Promise<FilterCategoryType[]> {
    const categories = await db.query<FilterCategoryType>(
      `SELECT id, name, created_at as "createdAt"
       FROM filter_categories
       ORDER BY name ASC`
    );
    
    // For each category, get its tags
    for (const category of categories) {
      const tags = await db.query<TagType>(
        `SELECT t.id, t.name, t.created_at as "createdAt"
         FROM tags t
         JOIN category_tags ct ON t.id = ct.tag_id
         WHERE ct.category_id = $1
         ORDER BY t.name ASC`,
        [category.id]
      );
      
      category.tags = tags;
    }
    
    return categories;
  }

  /**
   * Update a filter category
   */
  static async updateFilterCategory(id: string, name: string): Promise<FilterCategoryType> {
    const [category] = await db.query<FilterCategoryType>(
      `UPDATE filter_categories
       SET name = $1
       WHERE id = $2
       RETURNING id, name, created_at as "createdAt"`,
      [name, id]
    );
    
    return category;
  }

  /**
   * Delete a filter category
   */
  static async deleteFilterCategory(id: string): Promise<void> {
    await db.query('DELETE FROM filter_categories WHERE id = $1', [id]);
  }

  /**
   * Add tags to a category
   */
  static async addTagsToCategory(categoryId: string, tagIds: string[]): Promise<void> {
    const valuesSql = tagIds.map((_, i) => `($1, $${i + 2})`).join(', ');
    
    await db.query(
      `INSERT INTO category_tags (category_id, tag_id)
       VALUES ${valuesSql}
       ON CONFLICT DO NOTHING`,
      [categoryId, ...tagIds]
    );
  }

  /**
   * Remove tags from a category
   */
  static async removeTagsFromCategory(categoryId: string, tagIds: string[]): Promise<void> {
    const placeholders = tagIds.map((_, i) => `$${i + 2}`).join(', ');
    
    await db.query(
      `DELETE FROM category_tags
       WHERE category_id = $1 AND tag_id IN (${placeholders})`,
      [categoryId, ...tagIds]
    );
  }
}
