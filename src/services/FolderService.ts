import db from './db';
import { FolderType, FolderCreateParams } from './db/types';

/**
 * Service for handling folder operations
 */
export class FolderService {
  /**
   * Create a new folder
   */
  static async createFolder(params: FolderCreateParams): Promise<FolderType> {
    return db.transaction(async (client) => {
      let path = '/';
      
      // If this folder has a parent, we need to get the parent's path
      if (params.parentId) {
        const [parent] = await client.query<FolderType>(
          'SELECT path FROM folders WHERE id = $1',
          [params.parentId]
        );
        
        if (!parent) {
          throw new Error(`Parent folder with id ${params.parentId} not found`);
        }
        
        path = parent.path === '/' ? `/${params.name}` : `${parent.path}/${params.name}`;
      } else {
        path = `/${params.name}`;
      }
      
      // Insert the folder with the calculated path
      const [folder] = await client.query<FolderType>(
        `INSERT INTO folders (name, parent_id, path)
         VALUES ($1, $2, $3)
         RETURNING 
           id, name, parent_id as "parentId", path,
           created_at as "createdAt", updated_at as "updatedAt"`,
        [params.name, params.parentId || null, path]
      );
      
      return folder;
    });
  }

  /**
   * Get a folder by its ID
   */
  static async getFolderById(id: string): Promise<FolderType | null> {
    const [folder] = await db.query<FolderType>(
      `SELECT 
         id, name, parent_id as "parentId", path,
         created_at as "createdAt", updated_at as "updatedAt"
       FROM folders
       WHERE id = $1`,
      [id]
    );
    
    return folder || null;
  }

  /**
   * Get all folders with optional parent filtering
   */
  static async getFolders(parentId?: string): Promise<FolderType[]> {
    if (parentId) {
      return db.query<FolderType>(
        `SELECT 
           id, name, parent_id as "parentId", path,
           created_at as "createdAt", updated_at as "updatedAt"
         FROM folders
         WHERE parent_id = $1
         ORDER BY name ASC`,
        [parentId]
      );
    }
    
    return db.query<FolderType>(
      `SELECT 
         id, name, parent_id as "parentId", path,
         created_at as "createdAt", updated_at as "updatedAt"
       FROM folders
       ORDER BY path ASC`
    );
  }

  /**
   * Update a folder's name and recalculate the path
   */
  static async updateFolder(id: string, name: string): Promise<FolderType> {
    return db.transaction(async (client) => {
      // Get the current folder to check its parent
      const [folder] = await client.query<FolderType>(
        `SELECT id, name, parent_id as "parentId", path 
         FROM folders WHERE id = $1`,
        [id]
      );
      
      if (!folder) {
        throw new Error(`Folder with id ${id} not found`);
      }
      
      // Calculate the new path
      let newPath = '/';
      
      if (folder.parentId) {
        const [parent] = await client.query<FolderType>(
          'SELECT path FROM folders WHERE id = $1',
          [folder.parentId]
        );
        
        newPath = parent.path === '/' ? `/${name}` : `${parent.path}/${name}`;
      } else {
        newPath = `/${name}`;
      }
      
      // Update this folder with the new name and path
      const [updatedFolder] = await client.query<FolderType>(
        `UPDATE folders
         SET name = $1, path = $2
         WHERE id = $3
         RETURNING 
           id, name, parent_id as "parentId", path,
           created_at as "createdAt", updated_at as "updatedAt"`,
        [name, newPath, id]
      );
      
      // Update all child folder paths recursively
      const oldPathPrefix = folder.path;
      const newPathPrefix = updatedFolder.path;
      
      await client.query(
        `WITH RECURSIVE subfolders AS (
           SELECT id, name, parent_id, path
           FROM folders
           WHERE parent_id = $1
           UNION
           SELECT f.id, f.name, f.parent_id, f.path
           FROM folders f
           JOIN subfolders sf ON f.parent_id = sf.id
         )
         UPDATE folders
         SET path = regexp_replace(path, '^' || $2, $3)
         WHERE id IN (SELECT id FROM subfolders)`,
        [id, oldPathPrefix, newPathPrefix]
      );
      
      return updatedFolder;
    });
  }

  /**
   * Delete a folder and all its contents
   */
  static async deleteFolder(id: string): Promise<void> {
    // Folders cascade delete their children due to the ON DELETE CASCADE
    await db.query('DELETE FROM folders WHERE id = $1', [id]);
  }

  /**
   * Move a folder to a new parent
   */
  static async moveFolder(id: string, newParentId: string | null): Promise<FolderType> {
    return db.transaction(async (client) => {
      // Get the current folder
      const [folder] = await client.query<FolderType>(
        `SELECT id, name, parent_id as "parentId", path 
         FROM folders WHERE id = $1`,
        [id]
      );
      
      if (!folder) {
        throw new Error(`Folder with id ${id} not found`);
      }
      
      // Calculate the new path
      let newPath = '/';
      
      if (newParentId) {
        const [parent] = await client.query<FolderType>(
          'SELECT path FROM folders WHERE id = $1',
          [newParentId]
        );
        
        if (!parent) {
          throw new Error(`New parent folder with id ${newParentId} not found`);
        }
        
        // Check for circular reference
        if (folder.path.includes(parent.path) && parent.path !== '/') {
          throw new Error('Cannot move a folder to its own descendant');
        }
        
        newPath = parent.path === '/' ? `/${folder.name}` : `${parent.path}/${folder.name}`;
      } else {
        newPath = `/${folder.name}`;
      }
      
      // Update this folder with the new parent and path
      const [updatedFolder] = await client.query<FolderType>(
        `UPDATE folders
         SET parent_id = $1, path = $2
         WHERE id = $3
         RETURNING 
           id, name, parent_id as "parentId", path,
           created_at as "createdAt", updated_at as "updatedAt"`,
        [newParentId, newPath, id]
      );
      
      // Update all child folder paths recursively
      const oldPathPrefix = folder.path;
      const newPathPrefix = updatedFolder.path;
      
      await client.query(
        `WITH RECURSIVE subfolders AS (
           SELECT id, name, parent_id, path
           FROM folders
           WHERE parent_id = $1
           UNION
           SELECT f.id, f.name, f.parent_id, f.path
           FROM folders f
           JOIN subfolders sf ON f.parent_id = sf.id
         )
         UPDATE folders
         SET path = regexp_replace(path, '^' || $2, $3)
         WHERE id IN (SELECT id FROM subfolders)`,
        [id, oldPathPrefix, newPathPrefix]
      );
      
      return updatedFolder;
    });
  }
}
