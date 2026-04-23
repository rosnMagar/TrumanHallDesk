import mysql from 'mysql2/promise';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export const handler = async (event) => {
  let connection;

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { bannerID } = body;

    if (!bannerID) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing bannerID' }) };
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
        r.residentID,
        u.firstName,
        u.lastName,
        u.phoneNumber
      FROM resident r
      JOIN \`user\` u ON r.\`user\` = u.bannerID
      WHERE u.bannerID = ?`,
      [bannerID]
    );

    if (rows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Resident not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(rows[0]) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};