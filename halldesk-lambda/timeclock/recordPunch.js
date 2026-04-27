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

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    if (!action) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'action is required' }) };
    }

    if (action !== 'in' && action !== 'out') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'action must be "in" or "out"' }) };
    }

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

    const [workerRows] = await connection.execute(
      'SELECT workerID FROM deskWorker WHERE workerID = ?',
      [bannerId]
    );

    if (workerRows.length === 0) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'User is not a desk worker' }) };
    }

    const [lastPunch] = await connection.execute(
      'SELECT action FROM timeclock_punches WHERE bannerId = ? ORDER BY `at` DESC LIMIT 1',
      [bannerId]
    );

    if (lastPunch.length > 0) {
      const lastAction = lastPunch[0].action;
      if (action === 'in' && lastAction === 'in') {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Already clocked in' }) };
      }
      if (action === 'out' && lastAction !== 'in') {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Must clock in before clocking out' }) };
      }
    }

    const id = `punch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await connection.execute(
      'INSERT INTO timeclock_punches (id, bannerId, action, `at`) VALUES (?, ?, ?, UTC_TIMESTAMP())',
      [id, bannerId, action]
    );

    const [punch] = await connection.execute(
      'SELECT id, bannerId, action, `at` FROM timeclock_punches WHERE id = ?',
      [id]
    );

    return { statusCode: 201, headers, body: JSON.stringify(punch[0]) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};