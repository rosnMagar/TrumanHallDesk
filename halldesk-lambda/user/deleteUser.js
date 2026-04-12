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

  const bannerID = event.pathParameters?.bannerID;

  if (!bannerID) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'bannerID is required' }) };
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [result] = await connection.execute('DELETE FROM `user` WHERE bannerID = ?', [bannerID]);

    if (result.affectedRows === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'User not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'User deleted successfully' }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};