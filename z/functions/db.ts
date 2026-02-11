
import { neon } from '@netlify/neon';

const sql = neon(process.env.DATABASE_URL!);

/**
 * DATABASE SCHEMA:
 * We use a single 'store_data' table with a key-value structure where 'data' is JSONB.
 * This allows for flexible storage of products, themes, and orders without 
 * complex migrations as the app evolves.
 */

async function ensureTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS store_data (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

export const handler = async (event: any) => {
  await ensureTable();
  const { httpMethod, body } = event;

  try {
    if (httpMethod === 'GET') {
      // Fetch all store components
      const rows = await sql`SELECT key, data FROM store_data`;
      const result = rows.reduce((acc: any, row: any) => {
        acc[row.key] = row.data;
        return acc;
      }, {});
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      };
    }

    if (httpMethod === 'POST') {
      const { key, data } = JSON.parse(body);
      
      if (!key || data === undefined) {
        return { statusCode: 400, body: 'Missing key or data' };
      }

      // Upsert logic: Update if key exists, otherwise insert
      await sql`
        INSERT INTO store_data (key, data, updated_at)
        VALUES (${key}, ${JSON.stringify(data)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE 
        SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
      `;

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error: any) {
    console.error('Database Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
