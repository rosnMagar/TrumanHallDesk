import mysql from 'mysql2/promise';

function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return null;
  }
}

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

    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Missing Authorization header' }) };
    }
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = parseJwt(token);
    if (!decodedToken) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid token' }) };
    }
    const cognitoID = decodedToken.sub || decodedToken.username;

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [mappingRows] = await connection.execute(
      'SELECT bannerID FROM userToBanner WHERE userID = ?',
      [cognitoID]
    );

    if (mappingRows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'User not found in userToBanner' }) };
    }
    const bannerId = mappingRows[0].bannerID;

    let query = 'SELECT id, bannerId, action, `at` FROM timeclock_punches WHERE bannerId = ?';
    const queryParams = [bannerId];

    if (date) {
      query += ' AND DATE(`at`) = ?';
      queryParams.push(date);
    } else {
      query += ' AND DATE(`at`) = CURDATE()';
    }

    query += ' ORDER BY `at` DESC';

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