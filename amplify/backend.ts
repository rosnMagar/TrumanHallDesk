import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import {
  RestApi,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
  Cors,
} from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
const backend = defineBackend({
  auth,
  data,
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

