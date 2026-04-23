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

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { equipmentID, bannerID } = body;

    if (!equipmentID || !bannerID) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing equipmentID or bannerID' }) };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [residents] = await connection.execute(
      'SELECT residentID FROM resident WHERE `user` = ?',
      [bannerID]
    );

    if (residents.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Resident not found' }) };
    }

    const residentID = residents[0].residentID;

    const [workers] = await connection.execute(
      'SELECT workerID FROM deskWorker WHERE `user` = ?',
      [bannerID]
    );

    let workerID = null;
    if (workers.length > 0) {
      workerID = workers[0].workerID;
    }

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