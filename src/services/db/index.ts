import { Pool } from 'pg';

// Connection configuration from environment variables
const pool = new Pool({
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
  database: import.meta.env.VITE_DB_NAME || 'dam',
  user: import.meta.env.VITE_DB_USER || 'damuser',
  password: import.meta.env.VITE_DB_PASSWORD || 'dampassword',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
});

// Simple query method with error handling
export const query = async <T = any>(text: string, params?: any[]): Promise<T[]> => {
  try {
    const result = await pool.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
export const transaction = async <T = any>(
  callback: (client: any) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Shutdown helper for graceful application termination
export const shutdown = async (): Promise<void> => {
  await pool.end();
  console.log('Database pool has been closed');
};

export default {
  query,
  transaction,
  shutdown,
};
