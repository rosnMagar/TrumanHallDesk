# S3 Profile Picture Storage - Implementation Status

## Completed

### 1. Storage Resource (`amplify/storage/resource.ts`)
- Defined via `defineStorage` with name `profilePictures`
- Access rules for `profiles/{entity_id}/*` paths
- Functions granted S3 access (write/read/delete)

### 2. Data Schema (`amplify/data/resource.ts`)
- `User` model: id, email, name, avatarS3Key
- `uploadAvatar` mutation: accepts userId, imageContent
- `getAvatarUrl` query: accepts userId, s3Key
- `deleteAvatar` mutation: placeholder

### 3. Lambda Functions
- **uploadAvatar**: validates MIME (jpeg/png/webp), 5MB max, uploads to `profiles/{userId}/avatar.jpg`
- **getPresignedUrl**: generates 1-hour presigned GET URL
- **deleteAvatar**: placeholder (not implemented)

### 4. Backend Registration (`amplify/backend.ts`)
- All resources registered

## Needs Work

### 1. Database Access (High Priority)
The upload function currently just returns the S3 key. Need to update User record manually:
```typescript
// Client must call both:
const { data } = await client.mutations.uploadAvatar({ userId, imageContent })
await client.models.User.update({ id: userId, avatarS3Key: data })
```
Alternatively: grant function access to Data resource for direct update.

### 2. User Model Alignment
Need to ensure User IDs match Cognito identity pool IDs for storage access rules to enforce "users can only modify their own avatar".

### 3. Frontend Integration
- Add file picker UI component
- Convert file to base64 before upload
- Handle upload flow (upload → update User)
- Fetch presigned URL on profile display

### 4. Bucket Name Handling
After `npx ampx sandbox`, bucket name is in `amplify_outputs.json`. Functions receive it via env var `STORAGE_PROFILEPICTURES_BUCKET_NAME`.

## Test Plan
1. Run `npx ampx sandbox`
2. Create test user in database
3. Upload image via mutation
4. Verify S3 object created
5. Fetch presigned URL
6. Verify URL works

## James Notes
Schema issue when testing using sandbox. Still working on changes.

```
11:26:14 AM ✔ Type checks completed in 8.11 seconds
11:26:14 AM [ERROR] [BackendBuildError] Unable to deploy due to CDK Assembly Error
  ∟ Caused by: [AssemblyError] Assembly builder failed
    ∟ Caused by: [InvalidSchemaError] Invalid identifier definition. Field id cannot be used in the identifier. Identifiers must reference required or DB-generated fields)
      ∟ Caused by: [Error] Invalid identifier definition. Field id cannot be used in the identifier. Identifiers must reference required or DB-generated fields)
    Resolution: Check your data schema definition for syntax and type errors.
Resolution: Check the Caused by error and fix any issues in your backend code
```
