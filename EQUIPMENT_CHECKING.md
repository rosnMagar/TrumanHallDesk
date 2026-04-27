# Equipment Check-In/Check-Out - Implementation Complete

## Implemented

### Backend (halldesk-lambda/equipment/)
- `getAllEquipment.js` - list all with borrower JOINs
- `checkoutEquipment.js` - set currentOwner, checkoutTime, checkoutStaff
- `checkinEquipment.js` - clear checkout fields
- `getResidentByBannerId.js` - autofill resident info
- `template.yaml` - 4 new Lambda functions + API routes

### Hooks (src/hooks/)
- `useEquipment.ts` - fetch all/available equipment
- `useCheckout.ts` - check out equipment
- `useCheckin.ts` - check in equipment
- `useResident.ts` - lookup resident by banner ID

### Frontend
- `src/api/client.ts` - checkoutEquipment, checkinEquipment, getResidentByBannerId
- `src/api/types.ts` - added borrower join fields
- `src/Components/ActionTable.tsx` - added actionButtons prop
- `src/Pages/EquipmentCheckOut.tsx` - uses hooks pattern

## TODOs (Cognito UUID migration)

- `src/api/client.ts:106` - workerID lookup uses bannerID
- `halldesk-lambda/equipment/checkoutEquipment.js` - workerID lookup

---

## Deployment Plan (for when ready)

### Prerequisites
1. RDS endpoint and credentials
2. AWS credentials configured
3. S3 bucket for SAM artifacts

### Deploy Commands
```bash
# Validate template
sam validate -t halldesk-lambda/template.yaml

# Package
sam package --s3-bucket <bucket> --output-template-file packaged.yaml

# Deploy
sam deploy --template-file packaged.yaml --stack-name TrumanHallDesk-Equipment \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides DBHost=<rds-endpoint>
```

### API Endpoints (after deploy)
- GET /equipment - list all
- POST /equipment/checkout - check out
- POST /equipment/checkin - check in
- POST /equipment/resident - lookup resident

### Frontend Config
Update `.env.local` with:
```
VITE_EQUIPMENT_API_URL=https://<api-id>.execute-api.us-east-2.amazonaws.com/dev
```

## Testing

- [ ] GET /equipment returns equipment with borrower info
- [ ] POST /equipment/checkout sets currentOwner
- [ ] POST /equipment/checkin clears checkout
- [ ] Equipment dropdown shows only available items
- [ ] BannerID blur autofills resident name/phone
- [ ] Check-in button works