# Uligpro Backend

A modern, scalable monolithic backend system built with NestJS, Apollo GraphQL, and Prisma, designed to handle event management, user management, and ticket processing for sports events.

## Architecture Overview

The system follows a monolithic architecture with the following components:

### Client Layer
- Web Application
- Mobile Application

### Backend Layer (Port 4000)
- Single NestJS Application
- Apollo GraphQL Server
- Unified API Access
- Core Components:
  - Users Module
  - Events Module
  - Authentication and Authorization
  - Email Service Integration

### Database Layer
- PostgreSQL Database
- Prisma ORM
- Models:
  - User and Role Models
  - Event and Venue Models
  - Team and Ticket Models
  - Transaction Model

### External Services Integration
- SendGrid for Email Services
- JWT for Authentication
- Payment Gateway Integration

## Tech Stack

- **Framework**: NestJS v10
- **API**: 
  - GraphQL with Apollo Server
  - Apollo Client v2.7
- **Database**: 
  - PostgreSQL
  - Prisma ORM v5.11
- **Authentication**: JWT
- **Email**: 
  - SendGrid
  - Nodemailer
- **Package Manager**: PNPM v9.10.0
- **Language**: TypeScript v5.1

## Prerequisites

- Node.js (>=14.0.0)
- PNPM (v9.10.0)
- PostgreSQL (v14 or higher)
- Docker (optional, for containerized database)

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/uligpro?schema=public"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_email@domain.com

# Application
PORT=4000

# Security
ALGORITHM=your_algorithm
SECRET_KEY_PROTECT=your_secret_key
IV=your_iv

# Elastic Email (if used)
ELASTIC_EMAIL_API_KEY=your_elastic_email_api_key
```

## Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate --schema=./apps/gateway/src/prisma/schema.prisma
```

## Database Setup

### Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name uligpro-db \
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=uligpro \
  -p 5432:5432 \
  -d postgres:14

# Run migrations
pnpm prisma migrate dev
```

### Using Local PostgreSQL

1. Create a database named `uligpro`
2. Update the DATABASE_URL in `.env`
3. Run migrations:
```bash
pnpm prisma migrate dev
```

## Running the Project

### Development Mode

```bash
# Start the application in development mode
pnpm start:dev
```

### Production Mode

```bash
# Build the project
pnpm build

# Start in production mode
pnpm start:prod
```

### Database Management

```bash
# Start Prisma Studio (Database GUI)
pnpm prisma studio

# Run migrations
pnpm prisma migrate dev

# Reset database (if needed)
pnpm prisma migrate reset
```

## API Documentation

- GraphQL Playground: http://localhost:4000/graphql
- Prisma Studio: http://localhost:5555

## Project Structure

```
├── apps/
│   └── gateway/           # Main application
│       ├── src/
│       │   ├── modules/   # Feature modules
│       │   │   ├── users/ # User management
│       │   │   └── events/# Event management
│       │   ├── app.module.ts
│       │   └── main.ts
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── email-templates/      # Email templates
├── logs/                # Application logs
├── dist/               # Compiled output
└── node_modules/       # Dependencies
```

## Development

```bash
# Code formatting
pnpm format

# Linting
pnpm lint

# Testing
pnpm test              # Unit tests
pnpm test:e2e         # End-to-end tests
pnpm test:cov         # Test coverage
pnpm test:debug       # Debug tests

# Build
pnpm build
```

## Key Features

### User Management
- Secure authentication with JWT
- Role-based access control
- Email verification system
- User profile management

### Event Management
- Comprehensive event CRUD operations
- Venue and team management
- Match scheduling and management
- Ticket category and pricing management

### Ticket System
- Online ticket purchase flow
- Physical ticket generation
- QR code-based validation
- Transaction tracking

### Security
- JWT-based authentication
- Role-based authorization
- Secure password handling
- API rate limiting
- Data encryption for sensitive information

## Deployment

The application is configured for deployment on Heroku with the following considerations:

1. The `Procfile` specifies the production start command
2. Environment variables should be configured in the deployment platform
3. Database migrations run automatically on deployment
4. The application uses the `PORT` environment variable provided by the platform

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and ensure linting passes
4. Submit a pull request

## License

This project is licensed under the MIT License.
