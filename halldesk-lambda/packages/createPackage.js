import mysql from 'mysql2/promise';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-2' });

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

    const packageID = result.insertId;
    let emailSent = false;

    // Send email notification to the resident
    const senderEmail = process.env.SENDER_EMAIL;
    if (senderEmail) {
      try {
        const [userRows] = await connection.execute(
          'SELECT email, firstName, lastName FROM `user` WHERE bannerID = ?',
          [ownerBannerID]
        );

        if (userRows.length > 0 && userRows[0].email) {
          const resident = userRows[0];
          const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });

          const emailCommand = new SendEmailCommand({
            Source: senderEmail,
            Destination: { ToAddresses: [resident.email] },
            Message: {
              Subject: { Data: '📦 You have a package at the front desk!' },
              Body: {
                Html: {
                  Data: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                      <div style="background: #6c47ff; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 20px;">📦 Package Notification</h1>
                      </div>
                      <div style="border: 1px solid #e0e0e0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
                        <p style="font-size: 16px;">Hi <strong>${resident.firstName}</strong>,</p>
                        <p>A package has been logged for you at the front desk.</p>
                        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                          <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Tracking #</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${trackingID || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Description</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${type || 'Package'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Date Received</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${today}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px; font-weight: bold; color: #555;">Logged By</td>
                            <td style="padding: 8px;">${staffName}</td>
                          </tr>
                        </table>
                        <p>Please bring your <strong>student ID</strong> to pick it up during desk hours.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="color: #999; font-size: 12px; margin: 0;">— HallDesk Team</p>
                      </div>
                    </div>
                  `
                }
              }
            }
          });

          await sesClient.send(emailCommand);
          await connection.execute(
            'UPDATE packages SET emailSent = 1 WHERE uniqueID = ?',
            [packageID]
          );
          emailSent = true;
        }
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr.message);
        // Don't fail the whole request — the package is still logged
      }
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        packageID,
        staffName,
        emailSent,
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
