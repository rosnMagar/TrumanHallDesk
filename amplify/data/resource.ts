import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { uploadAvatar } from '../function/uploadAvatar/resource';
import { getPresignedUrl } from '../function/getPresignedUrl/resource';
import { deleteAvatar } from '../function/deleteAvatar/resource';

const schema = a.schema({
  User: a
    .model({
      id: a.id().required(),
      email: a.string(),
      name: a.string(),
      avatarS3Key: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),

  uploadAvatar: a
    .mutation()
    .arguments({
      userId: a.string(),
      imageContent: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(uploadAvatar)),

  getAvatarUrl: a
    .query()
    .arguments({
      userId: a.string(),
      s3Key: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(getPresignedUrl)),

  deleteAvatar: a
    .mutation()
    .arguments({
      userId: a.string(),
      s3Key: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(deleteAvatar)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
