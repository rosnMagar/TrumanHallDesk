import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { uploadAvatar } from './function/uploadAvatar/resource';
import { getPresignedUrl } from './function/getPresignedUrl/resource';
import { deleteAvatar } from './function/deleteAvatar/resource';

defineBackend({
  auth,
  data,
  storage,
  uploadAvatar,
  getPresignedUrl,
  deleteAvatar,
});
