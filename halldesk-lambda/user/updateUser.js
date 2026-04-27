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

  const bannerID = event.pathParameters?.bannerID;

  if (!bannerID) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'bannerID is required' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { firstName, lastName, homeAddress, idPicture, phoneNumber, email } = payload;

    const updates = [];
    const values = [];

    if (firstName !== undefined) { updates.push('firstName = ?'); values.push(firstName); }
    if (lastName !== undefined) { updates.push('lastName = ?'); values.push(lastName); }
    if (homeAddress !== undefined) { updates.push('homeAddress = ?'); values.push(homeAddress); }
    if (idPicture !== undefined) { updates.push('idPicture = ?'); values.push(idPicture); }
    if (phoneNumber !== undefined) { updates.push('phoneNumber = ?'); values.push(phoneNumber); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }

    if (updates.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No fields to update' }) };
    }

    values.push(bannerID);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(`UPDATE \`user\` SET ${updates.join(', ')} WHERE bannerID = ?`, values);

    const [rows] = await connection.execute('SELECT * FROM `user` WHERE bannerID = ?', [bannerID]);

    if (rows.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'User not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(rows[0]) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};