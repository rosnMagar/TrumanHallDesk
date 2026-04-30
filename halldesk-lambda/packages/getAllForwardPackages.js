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

    const [rows] = await connection.execute(`
      SELECT
        fp.uniqueID,
        fp.owner,
        fp.building,
        fp.description,
        fp.trackingID,
        fp.address,
        fp.receivedDate,
        fp.emailSent,
        fp.pickedUp,
        fp.reason,
        fp.instructions,
        fp.worker,
        u.firstName AS workerFirstName,
        u.lastName AS workerLastName
      FROM forward_packages fp
      LEFT JOIN \`user\` u ON fp.worker = u.bannerID
      ORDER BY fp.receivedDate DESC, fp.uniqueID DESC
    `);

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
