import { defineFunction } from '@aws-amplify/backend';

export const getPresignedUrl = defineFunction({
  name: 'getPresignedUrl',
  entry: './handler.ts',
});