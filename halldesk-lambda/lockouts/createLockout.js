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

    // 1. Get residentID for owner
    const [residentRows] = await connection.execute('SELECT residentID FROM resident WHERE user = ?', [ownerBannerID]);
    if (residentRows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Resident not found for the provided Banner ID.' }) };
    }
    const residentID = residentRows[0].residentID;

    // 2. Get workerID for checkout staff
    const [workerRows] = await connection.execute('SELECT workerID FROM deskWorker WHERE user = ?', [checkoutBannerID]);
    if (workerRows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Desk worker not found for the current user.' }) };
    }
    const workerID = workerRows[0].workerID;

    // 3. Update phone number if provided
    if (phoneNumber) {
      await connection.execute('UPDATE `user` SET phoneNumber = ? WHERE bannerID = ?', [phoneNumber, ownerBannerID]);
    }

    // 4. Create lockout equipment entry
    const [insertResult] = await connection.execute(
      `INSERT INTO equipment (currentOwner, type, checkoutTime, checkoutStaff, description) 
       VALUES (?, 'keys', NOW(), ?, ?)`,
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
