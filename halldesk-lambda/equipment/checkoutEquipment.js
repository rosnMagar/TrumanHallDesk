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
    const body = JSON.parse(event.body || '{}');
    const { equipmentID, bannerID } = body;

    if (!equipmentID || !bannerID) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing equipmentID or bannerID' }) };
    }

    // 1. Get Cognito ID from Authorization header
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

    // 2. Query userToBanner to get the desk worker's bannerID
    const [mappingRows] = await connection.execute(
      'SELECT bannerID FROM userToBanner WHERE userID = ?',
      [cognitoID]
    );

    if (mappingRows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Cognito user not mapped to any bannerID in userToBanner' }) };
    }
    const workerBannerID = mappingRows[0].bannerID;

    // 3. Find the workerID from deskWorker table
    const [workers] = await connection.execute(
      'SELECT workerID FROM deskWorker WHERE workerID = ?',
      [workerBannerID]
    );

    let workerID = null;
    if (workers.length > 0) {
      workerID = workers[0].workerID;
    } else {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Logged in user is not a desk worker' }) };
    }

    // 4. Find residentID for the equipment owner
    const [residents] = await connection.execute(
      'SELECT residentID FROM resident WHERE residentID = ?',
      [bannerID]
    );

    if (residents.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Resident not found for the provided bannerID' }) };
    }

    const residentID = residents[0].residentID;

    await connection.execute(
      'UPDATE equipment SET currentOwner = ?, checkoutTime = NOW(), checkoutStaff = ? WHERE equipmentID = ?',
      [residentID, workerID, equipmentID]
    );

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, equipmentID }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};