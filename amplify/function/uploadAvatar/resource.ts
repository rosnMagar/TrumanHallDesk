import { defineFunction } from '@aws-amplify/backend';

export const uploadAvatar = defineFunction({
  name: 'uploadAvatar',
  entry: './handler.ts',
});