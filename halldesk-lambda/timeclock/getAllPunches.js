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
    const date = params.date;

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    let query = `
      SELECT
        tp.id,
        tp.bannerId,
        tp.action,
        tp.\`at\`,
        u.firstName,
        u.lastName,
        COALESCE(dw.assignedBuilding, r.building, '') AS building
      FROM timeclock_punches tp
      LEFT JOIN \`user\` u ON tp.bannerId = u.bannerID
      LEFT JOIN deskWorker dw ON tp.bannerId = dw.workerID
      LEFT JOIN resident r ON tp.bannerId = r.residentID
    `;
    const queryParams = [];

    if (date) {
      query += ' WHERE DATE(tp.`at`) = ?';
      queryParams.push(date);
    } else {
      query += ' WHERE tp.`at` >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)';
    }

    query += ' ORDER BY tp.`at` DESC';

    const [rows] = await connection.execute(query, queryParams);

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};