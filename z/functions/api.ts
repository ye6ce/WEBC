
// This is a Netlify function (requires @neondatabase/serverless)
import { neon } from '@neondatabase/serverless';

export const handler = async (event: any) => {
  // Only handle GET and POST
  const { httpMethod, queryStringParameters, body } = event;
  const sql = neon(process.env.DATABASE_URL || '');

  try {
    if (httpMethod === 'GET') {
      const { action } = queryStringParameters || {};
      if (action === 'get') {
        const rows = await sql`SELECT data FROM store_config WHERE id = 1`;
        return {
          statusCode: 200,
          body: JSON.stringify(rows[0]?.data || {}),
        };
      }
    }

    if (httpMethod === 'POST') {
      const payload = JSON.parse(body || '{}');
      const { action, email, pass, data } = payload;

      if (action === 'verify') {
        const authorized = email === process.env.ADMIN_EMAIL && pass === process.env.ADMIN_PASSWORD;
        return {
          statusCode: 200,
          body: JSON.stringify({ authorized }),
        };
      }

      if (action === 'save') {
        await sql`
          UPDATE store_config 
          SET data = ${data}, updated_at = CURRENT_TIMESTAMP 
          WHERE id = 1
        `;
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true }),
        };
      }
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
