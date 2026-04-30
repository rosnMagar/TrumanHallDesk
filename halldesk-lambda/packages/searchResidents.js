import mysql from 'mysql2/promise';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent'
};

export const handler = async (event) => {
  let connection;

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const params = event.queryStringParameters || {};
    const query = params.q;

    if (!query || query.length < 2) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Query must be at least 2 characters' }) };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute(
      `SELECT
        u.bannerID,
        u.lastName,
        u.firstName,
        u.email,
        u.phoneNumber,
        u.homeAddress,
        r.roomID,
        r.building,
        b.name AS buildingName
      FROM \`user\` u
      INNER JOIN resident r ON u.bannerID = r.residentID
      LEFT JOIN buildings b ON r.building = b.buildingID
      WHERE u.lastName LIKE ?
      ORDER BY u.lastName, u.firstName
      LIMIT 20`,
      [`${query}%`]
    );

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
