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

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Join with user table to get resident name and building/room via resident table
    const [rows] = await connection.execute(`
      SELECT
        p.uniqueID,
        p.owner,
        p.trackingID,
        p.receivedDate,
        p.emailSent,
        p.pickedUp,
        p.type,
        p.requiresForwarding,
        u.firstName,
        u.lastName,
        u.phoneNumber,
        r.roomID,
        r.building
      FROM packages p
      LEFT JOIN \`user\` u ON p.owner = u.bannerID
      LEFT JOIN (
        SELECT residentID, roomID, building
        FROM resident
        GROUP BY residentID
      ) r ON p.owner = r.residentID
      ORDER BY p.receivedDate DESC, p.uniqueID DESC
    `);

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
