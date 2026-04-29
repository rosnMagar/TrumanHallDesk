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
    const { ownerBannerID, trackingID, type } = body;

    if (!ownerBannerID) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'ownerBannerID is required' }) };
    }

    // Get staff identity from JWT
    let staffName = 'Unknown';
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = parseJwt(token);
      if (decoded) {
        const cognitoID = decoded.sub || decoded.username;

        // We'll try to look up the staff name
        connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        });

        const [staffRows] = await connection.execute(
          `SELECT u.firstName, u.lastName
           FROM userToBanner utb
           INNER JOIN \`user\` u ON utb.bannerID = u.bannerID
           WHERE utb.userID = ?`,
          [cognitoID]
        );
        if (staffRows.length > 0) {
          staffName = `${staffRows[0].firstName} ${staffRows[0].lastName}`;
        }
      }
    }

    if (!connection) {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
    }

    // Insert the package
    const [result] = await connection.execute(
      `INSERT INTO packages (owner, trackingID, receivedDate, emailSent, pickedUp, type, requiresForwarding)
       VALUES (?, ?, CURDATE(), 0, 0, ?, 0)`,
      [ownerBannerID, trackingID || null, type || null]
    );

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        packageID: result.insertId,
        staffName,
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
