# S3 Profile Picture Storage - Implementation Status

## Completed

### 1. Storage Resource (`amplify/storage/resource.ts`)
- Defined via `defineStorage` with name `profilePictures`
- Access rules for `profiles/{entity_id}/*` paths
- Functions granted S3 access (write/read/delete)

### 2. Data Schema (`amplify/data/resource.ts`)
- `User` model: id (required, auto-generated), email, name, avatarS3Key
- `uploadAvatar` mutation: accepts userId, imageContent (base64), returns s3Key
- `getAvatarUrl` query: accepts userId, s3Key, returns presigned URL
- `deleteAvatar` mutation: placeholder

### 3. Lambda Functions
- **uploadAvatar**: validates MIME (jpeg/png/webp), 5MB max, uploads to `profiles/{userId}/avatar.jpg`
- **getPresignedUrl**: generates 1-hour presigned GET URL
- **deleteAvatar**: placeholder (NOT IMPLEMENTED - returns fake success)

### 4. Backend Registration (`amplify/backend.ts`)
- All resources registered

### 5. Bucket Configuration (`amplify_outputs.json`)
- Bucket: `amplify-trumanhalldesk-ja-profilepicturesbucket46b-jf0dpo5msj41`
- Region: us-east-2

## Needs Work

### 1. deleteAvatar Lambda (High Priority)
Still a placeholder - does NOT actually delete from S3. Needs S3 DeleteObjectCommand implementation.

### 2. Frontend Integration (High Priority)
ZERO avatar-related code exists in frontend:
- No file picker component
- No upload handling
- No avatar display component
- No API client integration (Amplify Schema client not wired up)
- No base64 conversion utilities

### 3. Database Access
The upload function returns the S3 key. Client must manually update User record:
```typescript
const { data } = await client.mutations.uploadAvatar({ userId, imageContent })
await client.models.User.update({ id: userId, avatarS3Key: data })
```

### 4. Bucket Name Handling
`getPresignedUrl` Lambda requires bucketName argument. Need to inject via env var or helper.

## Test Plan
1. Run `npx ampx sandbox`
2. Create test user in database
3. Upload image via mutation
4. Verify S3 object created
5. Fetch presigned URL
6. Verify URL works
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
