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
    const { bannerID, firstName, lastName, homeAddress, idPicture, phoneNumber, email } = payload;

    if (!bannerID || !firstName || !lastName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'bannerID, firstName, and lastName are required' })
      };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      'INSERT INTO `user` (bannerID, firstName, lastName, homeAddress, idPicture, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bannerID, firstName, lastName, homeAddress || null, idPicture || null, phoneNumber || null, email || null]
    );

    const [rows] = await connection.execute('SELECT * FROM `user` WHERE bannerID = ?', [bannerID]);

    return { statusCode: 201, headers, body: JSON.stringify(rows[0]) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message + "Error"}) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};