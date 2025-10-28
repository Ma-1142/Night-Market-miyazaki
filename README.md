# Night Market Miyazaki

A web application for shop form submissions with three user roles: User, Staff, and Admin.

## Tech Stack

- **Next.js 16** - Full-stack React framework
- **NextAuth.js v5** - Authentication system
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Database Schema

### User Roles
- **USER** - Can submit forms about their shops
- **STAFF** - Can review and manage submitted forms
- **ADMIN** - Full access to the system

### Models
- **User** - User accounts with role-based access
- **Shop** - Shop information owned by users
- **Form** - Form submissions linked to shops
- **Account, Session, VerificationToken** - NextAuth related models

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/night_market?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

3. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── dashboard/               # Dashboard page
│   ├── login/                   # Login page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── lib/
│   └── prisma.ts                # Prisma client instance
├── prisma/
│   └── schema.prisma            # Database schema
├── types/
│   └── next-auth.d.ts           # NextAuth type extensions
├── auth.config.ts               # NextAuth configuration
├── auth.ts                      # NextAuth initialization
└── middleware.ts                # NextAuth middleware
```

## Next Steps

- Add form creation and submission features
- Implement role-based access control
- Create admin panel for user management
- Add staff review interface
- Design form builder for dynamic forms
