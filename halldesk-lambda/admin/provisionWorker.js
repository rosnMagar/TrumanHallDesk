import mysql from 'mysql2/promise';
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent'
};

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-2' });

function generateBannerID() {
  // Generate a random 9-digit number (e.g., 8xxxxxxxx)
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

export const handler = async (event) => {
  let connection;

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { firstName, lastName, email, assignedBuilding } = body;

    if (!firstName || !lastName || !email) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ error: 'firstName, lastName, and email are required' }) 
      };
    }

    const userPoolId = process.env.USER_POOL_ID;
    if (!userPoolId) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'USER_POOL_ID is not configured' }) };
    }

    // 1. Create Cognito User
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' }
      ],
      DesiredDeliveryMediums: ['EMAIL']
    });

    let cognitoResponse;
    try {
      cognitoResponse = await cognitoClient.send(createUserCommand);
    } catch (cognitoError) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Failed to create Cognito User', details: cognitoError.message }) };
    }

    const cognitoUser = cognitoResponse.User;
    const subAttribute = cognitoUser.Attributes.find(attr => attr.Name === 'sub');
    const cognitoID = subAttribute ? subAttribute.Value : null;

    if (!cognitoID) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to extract Cognito SUB' }) };
    }

    // 2. Generate Banner ID
    const bannerID = generateBannerID();

    // 3. Insert into MySQL (Transaction)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.beginTransaction();

    try {
      // Insert into user
      await connection.execute(
        'INSERT INTO user (bannerID, firstName, lastName, email) VALUES (?, ?, ?, ?)',
        [bannerID, firstName, lastName, email]
      );

      // Insert into userToBanner
      await connection.execute(
        'INSERT INTO userToBanner (userID, bannerID) VALUES (?, ?)',
        [cognitoID, bannerID]
      );

      // Insert into deskWorker
      await connection.execute(
        'INSERT INTO deskWorker (workerID, assignedBuilding) VALUES (?, ?)',
        [bannerID, assignedBuilding || null]
      );

      await connection.commit();
    } catch (dbError) {
      await connection.rollback();
      // If DB fails, optionally delete the Cognito user here to prevent orphans
      throw dbError;
    }

    return { 
      statusCode: 201, 
      headers, 
      body: JSON.stringify({ 
        message: 'Desk Worker provisioned successfully',
        bannerID,
        cognitoID
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
