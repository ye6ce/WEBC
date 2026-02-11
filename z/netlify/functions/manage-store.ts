import { neon } from '@neondatabase/serverless';

export const handler = async (event: any) => {
const sql = neon(process.env.NETLIFY_DATABASE_URL!);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// GET: Publicly fetch store data
if (event.httpMethod === 'GET') {
try {
const result = await sql`SELECT data FROM store_config WHERE id = 1`;
return {
statusCode: 200,
headers: { "Content-Type": "application/json" },
body: JSON.stringify(result[0]?.data || null),
};
} catch (err) {
return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
}
}

// POST: Securely save store data
if (event.httpMethod === 'POST') {
const { data, email, password } = JSON.parse(event.body);

// VERIFICATION LOGIC
if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
return {
statusCode: 401,
body: JSON.stringify({ error: "Invalid Admin Credentials" })
};
}

try {
await sql`
INSERT INTO store_config (id, data)
VALUES (1, ${data})
ON CONFLICT (id) DO UPDATE SET data = ${data}
`;
return { statusCode: 200, body: JSON.stringify({ message: "Global sync complete!" }) };
} catch (err) {
return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
}
}
};