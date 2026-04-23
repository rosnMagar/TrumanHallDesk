import { defineStorage } from '@aws-amplify/backend';
import { uploadAvatar } from '../function/uploadAvatar/resource';
import { getPresignedUrl } from '../function/getPresignedUrl/resource';
import { deleteAvatar } from '../function/deleteAvatar/resource';

export const storage = defineStorage({
  name: 'profilePictures',
  access: (allow) => ({
    'profiles/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.resource(uploadAvatar).to(['write']),
      allow.resource(getPresignedUrl).to(['read']),
      allow.resource(deleteAvatar).to(['delete']),
    ],
  }),
});