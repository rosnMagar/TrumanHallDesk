import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-2' });

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent'
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const bannerID = event.pathParameters?.bannerID;
  const contentType = event.queryStringParameters?.contentType || 'image/jpeg';
  const fileExtension = event.queryStringParameters?.extension || 'jpg';

  if (!bannerID) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'bannerID is required' }) };
  }

  try {
    // Generate a unique filename for the new profile picture
    const fileName = `profile-pictures/${bannerID}-${Date.now()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600,
      signableHeaders: new Set(['content-type'])
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ uploadUrl, fileName })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
