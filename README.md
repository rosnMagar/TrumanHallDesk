# Truman Hall Desk

A residence hall management application for Truman Hall, built with React, TypeScript, and AWS Amplify.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Library**: Mantine UI v8
- **Backend**: AWS Amplify (Auth + Data)
- **Routing**: React Router v7

## Features

- **Inbound**: Residence Life check-in management
- **Outbound**: Check-out processing
- **Resident Lockout**: Lockout tracking and management
- **Equipment Checkout**: Equipment lending system
- **Timeclock**: Staff time tracking

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── App.tsx           # Main app with routing
├── Pages/
│   ├── Inbound.tsx          # Check-in page
│   ├── outbound.tsx        # Check-out page
│   ├── ResidentLockOut.tsx # Lockout management
│   ├── EquipmentCheckOut.tsx
│   └── Timeclock.tsx
├── Components/
│   ├── SiteHeader.tsx
│   └── SiteFooter.tsx
└── index.css
```

## Authentication

The app uses AWS Amplify Authenticator for user authentication.
