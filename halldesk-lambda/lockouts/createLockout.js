import mysql from 'mysql2/promise';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent'
};

function extractSub(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
    return payload.sub;
  } catch {
    return null;
  }
}

export const handler = async (event) => {
  let connection;

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { ownerBannerID, checkoutBannerID, keyNumber, phoneNumber } = payload;

    if (!ownerBannerID || !checkoutBannerID || !keyNumber) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'ownerBannerID, checkoutBannerID, and keyNumber are required' })
      };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [residentRows] = await connection.execute('SELECT residentID FROM resident WHERE residentID = ?', [ownerBannerID]);
    if (residentRows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Resident not found for the provided Banner ID.' }) };
    }
    const residentID = residentRows[0].residentID;

    let workerBannerID = checkoutBannerID;
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const sub = extractSub(authHeader.slice(7));
      if (sub) {
        const [userToBannerRows] = await connection.execute('SELECT bannerID FROM userToBanner WHERE userID = ?', [sub]);
        if (userToBannerRows.length > 0) {
          workerBannerID = userToBannerRows[0].bannerID;
        }
      }
    }

    const [workerRows] = await connection.execute('SELECT workerID FROM deskWorker WHERE workerID = ?', [workerBannerID]);
    if (workerRows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Desk worker not found for the current user.' }) };
    }
    const workerID = workerRows[0].workerID;

    if (phoneNumber) {
      await connection.execute('UPDATE `user` SET phoneNumber = ? WHERE bannerID = ?', [phoneNumber, ownerBannerID]);
    }

    // Check if resident already has a key checked out
    const [existingKeys] = await connection.execute(
      `SELECT equipmentID, description FROM equipment WHERE currentOwner = ? AND type = 'keys' AND checkedOut = 'Y'`,
      [residentID]
    );
    if (existingKeys.length > 0) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          error: `This resident already has a key checked out (Key: ${existingKeys[0].description}, ID: ${existingKeys[0].equipmentID}). Please check it in first.`
        })
      };
    }

    const [insertResult] = await connection.execute(
      `INSERT INTO equipment (currentOwner, type, checkoutTime, checkoutStaff, description, checkedOut)
       VALUES (?, 'keys', NOW(), ?, ?, 'Y')`,
      [residentID, workerID, keyNumber]
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Lockout created successfully',
        equipmentID: insertResult.insertId
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
