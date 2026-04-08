import type { Handler } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

declare const env: {
  STORAGE_PROFILEPICTURES_BUCKET_NAME: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const handler: Handler = async (event) => {
  const { userId, imageContent } = event.arguments;

  if (!imageContent || !userId) {
    throw new Error('Missing required arguments: userId and imageContent');
  }

  const buffer = Buffer.from(imageContent, 'base64');
  
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  const detectedMimeType = detectMimeType(buffer);
  if (!ALLOWED_MIME_TYPES.includes(detectedMimeType)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`);
  }

  const s3Key = `profiles/${userId}/avatar.jpg`;

  const s3Client = new S3Client({ region: 'us-east-2' });
  
  const command = new PutObjectCommand({
    Bucket: env.STORAGE_PROFILEPICTURES_BUCKET_NAME,
    Key: s3Key,
    Body: buffer,
    ContentType: detectedMimeType,
  });

  await s3Client.send(command);

  return s3Key;
};

function detectMimeType(buffer: Buffer): string {
  const signature = buffer.toString('hex', 0, 4);
  
  if (signature === '89504e47') {
    return 'image/png';
  }
  if (signature === 'ffd8ffe0' || signature === 'ffd8ffe1' || signature === 'ffd8ffe2') {
    return 'image/jpeg';
  }
  if (signature.startsWith('52494646') && buffer.toString('hex', 8, 12) === '57454250') {
    return 'image/webp';
  }
  
  return 'application/octet-stream';
}