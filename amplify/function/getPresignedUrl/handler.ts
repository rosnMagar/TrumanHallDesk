import type { Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const URL_EXPIRY_SECONDS = 3600;

export const handler: Handler = async (event) => {
  const { userId, s3Key, bucketName } = event.arguments;

  if (!userId && !s3Key) {
    throw new Error('Missing required arguments: userId and s3Key');
  }

  const key = s3Key || `profiles/${userId}/avatar.jpg`;

  const s3Client = new S3Client({ region: 'us-east-2' });

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { 
    expiresIn: URL_EXPIRY_SECONDS 
  });

  return signedUrl;
};