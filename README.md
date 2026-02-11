# Swift Transport - Admin Dashboard

A minimal Next.js admin dashboard for managing the Swift Transport backend.

## Features

- **Authentication**: Login with JWT tokens
- **Dashboard Home**: Statistics overview (drivers, vehicles, assignments)
- **Drivers Management**: View, create, and deactivate drivers (Admin only)
- **Vehicles Management**: View, create, and deactivate vehicles (Admin only)
- **Assignments Management**: View, create, and unassign driver-vehicle assignments

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Axios for API calls
- js-cookie for token management

## Getting Started

### Prerequisites

- Node.js v20 or higher
- Swift Transport backend running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
The `.env.local` file is already configured to point to `http://localhost:3000`

3. **Run development server:**
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3001`

### Default Credentials

Use the credentials from your backend to login (register a user via the backend first).

## Project Structure

```
swift-admin-dashboard/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Landing page (redirects)
│   ├── login/                  # Login page
│   └── dashboard/              # Protected dashboard routes
│       ├── page.tsx            # Dashboard home
│       ├── drivers/            # Drivers management
│       ├── vehicles/           # Vehicles management
│       └── assignments/        # Assignments management
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── layout/                 # Layout components
│   └── auth/                   # Auth provider
├── lib/
│   ├── api.ts                  # API client
│   └── auth.ts                 # Auth utilities
└── types/
    └── index.ts                # TypeScript types
```

## Features by Role

### ADMIN
- Full access to all features
- Can create, update, and delete drivers
- Can create, update, and delete vehicles
- Can create and unassign assignments

### OPERATIONS
- Read-only access to drivers and vehicles
- Can create and unassign assignments

## Available Routes

- `/` - Landing page (redirects based on auth status)
- `/login` - Login page
- `/dashboard` - Dashboard home (protected)
- `/dashboard/drivers` - Drivers management (protected)
- `/dashboard/vehicles` - Vehicles management (protected)
- `/dashboard/assignments` - Assignments management (protected)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Design Philosophy

This is a **minimal test project** following the "mini and nothing fancy" requirement:
- Clean, simple UI using Tailwind CSS
- No complex animations or external libraries
- Basic responsive design
- Straightforward CRUD operations
- Client-side rendering (no SSR/SSG optimizations)

## Notes

- Ensure the backend is running before using the dashboard
- All API calls go to `http://localhost:3000`
- JWT tokens are stored in cookies
- The dashboard automatically redirects to login if unauthorized
