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

const apiStack = backend.createStack('HallDeskApiStack');

// 1. REST API
const api = new RestApi(apiStack, 'HallDeskApi', {
  restApiName: 'halldesk-api',
  deployOptions: { stageName: 'prod' },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: ['Authorization', 'Content-Type'],
  },
});

// 2. Cognito authorizer
const userPool = backend.auth.resources.userPool;
const authorizer = new CognitoUserPoolsAuthorizer(apiStack, 'HallDeskAuthorizer', {
  cognitoUserPools: [userPool],
  authorizerName: 'HallDeskCognitoAuth',
});

const authOptions = {
  authorizer,
  authorizationType: AuthorizationType.COGNITO,
};

// 4. Output API URL
new CfnOutput(apiStack, 'HallDeskApiUrl', {
  value: api.url,
  description: 'API Gateway base URL',
});

