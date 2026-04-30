import mysql from 'mysql2/promise';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({});

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
    const { owner, building, description, trackingID, address, reason, instructions } = body;

    if (!owner) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'owner (name) is required' }) };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get worker bannerID from JWT
    let workerBannerID = null;
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = parseJwt(token);
      if (decoded) {
        const cognitoID = decoded.sub || decoded.username;
        const [utbRows] = await connection.execute(
          'SELECT bannerID FROM userToBanner WHERE userID = ?',
          [cognitoID]
        );
        if (utbRows.length > 0) {
          const bannerID = utbRows[0].bannerID;
          const [dwRows] = await connection.execute(
            'SELECT workerID FROM deskWorker WHERE workerID = ?',
            [bannerID]
          );
          if (dwRows.length > 0) {
            workerBannerID = bannerID;
          }
        }
      }
    }

    const [result] = await connection.execute(
      `INSERT INTO forward_packages (owner, building, description, trackingID, address, receivedDate, emailSent, pickedUp, reason, instructions, worker)
       VALUES (?, ?, ?, ?, ?, CURDATE(), 0, 0, ?, ?, ?)`,
      [
        owner,
        building || null,
        description || null,
        trackingID || null,
        address || null,
        reason || 'Return to Sender',
        instructions || null,
        workerBannerID
      ]
    );

    // Fetch administrator emails
    let emailSent = false;
    try {
      const [adminRows] = await connection.execute(
        `SELECT u.email 
         FROM administrator a 
         JOIN \`user\` u ON a.user = u.bannerID 
         WHERE u.email IS NOT NULL AND u.email != ''`
      );
      
      const adminEmails = adminRows.map(r => r.email);
      
      if (adminEmails.length > 0 && process.env.SENDER_EMAIL) {
        const htmlBody = `
          <h2>New Package Forwarded/Returned</h2>
          <p>A package has been processed for forwarding or return.</p>
          <ul>
            <li><strong>Resident Name:</strong> ${owner}</li>
            <li><strong>Building:</strong> ${building || 'N/A'}</li>
            <li><strong>Tracking #:</strong> ${trackingID || 'N/A'}</li>
            <li><strong>Reason:</strong> ${reason || 'Return to Sender'}</li>
            <li><strong>Instructions:</strong> ${instructions || 'N/A'}</li>
          </ul>
        `;

        let sentCount = 0;
        for (const email of adminEmails) {
          try {
            const command = new SendEmailCommand({
              Source: process.env.SENDER_EMAIL,
              Destination: { ToAddresses: [email] },
              Message: {
                Subject: { Data: `HallDesk: New Package Forwarded (${owner})` },
                Body: { Html: { Data: htmlBody } }
              }
            });
            await sesClient.send(command);
            sentCount++;
          } catch (individualErr) {
            console.error(`Failed to send to ${email}:`, individualErr.message);
          }
        }
        
        if (sentCount > 0) {
          await connection.execute(
            'UPDATE forward_packages SET emailSent = 1 WHERE uniqueID = ?',
            [result.insertId]
          );
          emailSent = true;
        }
      }
    } catch (sesErr) {
      console.error('Failed to process admin notifications:', sesErr);
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        forwardID: result.insertId,
        emailSent
      })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
