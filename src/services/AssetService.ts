import db from './db';
import { 
  AssetType, 
  AssetCreateParams, 
  AssetQueryParams,
  TagType
} from './db/types';

/**
 * Service for handling asset operations
 */
export class AssetService {
  /**
   * Create a new asset record
   */
  static async createAsset(params: AssetCreateParams): Promise<AssetType> {
    return db.transaction(async (client) => {
      // Insert the asset
      const [asset] = await client.query<AssetType>(
        `INSERT INTO assets 
         (filename, folder_id, file_path, file_size, mime_type, extension, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING 
           id, filename, folder_id as "folderId", file_path as "filePath", 
           file_size as "fileSize", mime_type as "mimeType", extension,
           metadata, created_at as "createdAt", updated_at as "updatedAt"`,
        [
          params.filename,
          params.folderId || null,
          params.filePath,
          params.fileSize,
          params.mimeType,
          params.extension,
          params.metadata || {}
        ]
      );
      
      return asset;
    });
  }

  /**
   * Get an asset by its ID
   */
  static async getAssetById(id: string): Promise<AssetType | null> {
    const [asset] = await db.query<AssetType>(
      `SELECT 
         id, filename, folder_id as "folderId", file_path as "filePath", 
         file_size as "fileSize", mime_type as "mimeType", extension,
         metadata, created_at as "createdAt", updated_at as "updatedAt"
       FROM assets
       WHERE id = $1`,
      [id]
    );

    if (!asset) return null;

    // Get asset tags
    const tags = await db.query<TagType>(
      `SELECT t.id, t.name, t.created_at as "createdAt"
       FROM tags t
       JOIN asset_tags at ON t.id = at.tag_id
       WHERE at.asset_id = $1`,
      [id]
    );

    // Get asset thumbnails
    const thumbnails = await db.query(
      `SELECT 
         id, asset_id as "assetId", size, width, height, 
         file_path as "filePath", created_at as "createdAt"
       FROM asset_thumbnails
       WHERE asset_id = $1`,
      [id]
    );

    return { ...asset, tags, thumbnails };
  }

  /**
   * Get assets with optional filtering
   */
  static async getAssets(params: AssetQueryParams = {}): Promise<{ assets: AssetType[], total: number }> {
    // Build the query conditions
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      conditions.push(`filename ILIKE $${paramIndex}`);
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    if (params.folderId) {
      conditions.push(`folder_id = $${paramIndex}`);
      queryParams.push(params.folderId);
      paramIndex++;
    }

    if (params.mimeTypes && params.mimeTypes.length > 0) {
      const placeholders = params.mimeTypes.map((_, i) => `$${paramIndex + i}`);
      conditions.push(`mime_type IN (${placeholders.join(', ')})`);
      queryParams.push(...params.mimeTypes);
      paramIndex += params.mimeTypes.length;
    }

    // Handle tag filtering with a subquery if needed
    if (params.tags && params.tags.length > 0) {
      conditions.push(
        `id IN (SELECT asset_id FROM asset_tags 
               WHERE tag_id IN (SELECT id FROM tags WHERE name = ANY($${paramIndex}::varchar[])))`
      );
      queryParams.push(params.tags);
      paramIndex++;
    }

    // Build the WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build the ORDER BY clause
    const sortField = params.sortBy || 'updated_at';
    const sortOrder = params.sortOrder || 'desc';
    const orderByClause = `ORDER BY ${sortField} ${sortOrder}`;

    // Add pagination
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

    // Get total count first
    const [countResult] = await db.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM assets ${whereClause}`,
      queryParams
    );

    // Get the assets
    const assets = await db.query<AssetType>(
      `SELECT 
         id, filename, folder_id as "folderId", file_path as "filePath", 
         file_size as "fileSize", mime_type as "mimeType", extension,
         metadata, created_at as "createdAt", updated_at as "updatedAt"
       FROM assets
       ${whereClause}
       ${orderByClause}
       ${paginationClause}`,
      queryParams
    );

    return { 
      assets, 
      total: parseInt(countResult.count) 
    };
  }

  /**
   * Update an asset's metadata
   */
  static async updateAssetMetadata(id: string, metadata: Record<string, any>): Promise<AssetType> {
    const [asset] = await db.query<AssetType>(
      `UPDATE assets
       SET metadata = $1
       WHERE id = $2
       RETURNING 
         id, filename, folder_id as "folderId", file_path as "filePath", 
         file_size as "fileSize", mime_type as "mimeType", extension,
         metadata, created_at as "createdAt", updated_at as "updatedAt"`,
      [metadata, id]
    );

    return asset;
  }

  /**
   * Add tags to an asset
   */
  static async addTagsToAsset(assetId: string, tagIds: string[]): Promise<void> {
    return db.transaction(async (client) => {
      // Create a values list for multi-row insert
      const valuesSql = tagIds.map((_, i) => `($1, $${i + 2})`).join(', ');
      
      await client.query(
        `INSERT INTO asset_tags (asset_id, tag_id)
         VALUES ${valuesSql}
         ON CONFLICT DO NOTHING`,
        [assetId, ...tagIds]
      );
    });
  }

  /**
   * Remove tags from an asset
   */
  static async removeTagsFromAsset(assetId: string, tagIds: string[]): Promise<void> {
    const placeholders = tagIds.map((_, i) => `$${i + 2}`).join(', ');
    
    await db.query(
      `DELETE FROM asset_tags
       WHERE asset_id = $1 AND tag_id IN (${placeholders})`,
      [assetId, ...tagIds]
    );
  }

  /**
   * Delete an asset
   */
  static async deleteAsset(id: string): Promise<void> {
    await db.query('DELETE FROM assets WHERE id = $1', [id]);
  }
}
