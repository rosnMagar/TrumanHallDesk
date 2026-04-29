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
    // Extract Cognito sub from JWT
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

    // Map Cognito sub → bannerID
    const [mappingRows] = await connection.execute(
      'SELECT bannerID FROM userToBanner WHERE userID = ?',
      [cognitoID]
    );

    if (mappingRows.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ isAdmin: false }) };
    }
    const bannerID = mappingRows[0].bannerID;

    // Check if bannerID exists in administrator table
    const [adminRows] = await connection.execute(
      'SELECT adminID, assignedBuilding, officeNumber FROM administrator WHERE `user` = ?',
      [bannerID]
    );

    if (adminRows.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ isAdmin: false }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        isAdmin: true,
        bannerID,
        assignedBuilding: adminRows[0].assignedBuilding,
        officeNumber: adminRows[0].officeNumber,
      })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};
