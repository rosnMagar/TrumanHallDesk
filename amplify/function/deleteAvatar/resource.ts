import { defineFunction } from '@aws-amplify/backend';

export const deleteAvatar = defineFunction({
  name: 'deleteAvatar',
  entry: './handler.ts',
});