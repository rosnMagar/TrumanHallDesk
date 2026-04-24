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
        e.equipmentID,
        e.type,
        e.description,
        e.checkoutTime,
        e.currentOwner,
        e.checkoutStaff,
        r.residentID,
        CONCAT(u.lastName, ', ', u.firstName) AS borrowerName,
        u.bannerID AS borrowerBannerID,
        u.phoneNumber AS borrowerPhone
      FROM equipment e
      LEFT JOIN resident r ON e.currentOwner = r.residentID
      LEFT JOIN \`user\` u ON r.\`user\` = u.bannerID
      ORDER BY e.equipmentID
    `);

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};