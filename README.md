# Uligpro Backend Gateway

A microservices-based backend system built with NestJS, GraphQL, and Prisma, designed to handle event management, user management, and ticket processing.

## Project Structure

The project is organized as a monorepo with three main services:

- **Gateway Service** (Port 4000): API Gateway that combines all services
- **Users Service** (Port 4001): Handles user management and authentication
- **Events Service** (Port 4002): Manages events, venues, and ticket categories

## Tech Stack

- **Framework**: NestJS
- **API**: GraphQL with Apollo Federation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Email**: SendGrid & Nodemailer
- **Package Manager**: PNPM

## Prerequisites

- Node.js (v16 or higher)
- PNPM (v8 or higher)
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

# Service Ports
GATEWAY_PORT=4000
USERS_PORT=4001
EVENTS_PORT=4002
```

## Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate
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

### Database Management

```bash
# Start Prisma Studio (Database GUI)
pnpm prisma studio

# Run migrations
pnpm prisma migrate dev

# Reset database (if needed)
pnpm prisma migrate reset
```

### Running Services

The services should be started in sequence:

```bash
# Development mode (starts all services in sequence)
pnpm start:sequence

# Production mode
pnpm start:sequence:prod
```

Individual services can be started separately:

```bash
# Users service
pnpm start:users

# Events service
pnpm start:events

# Gateway service
pnpm start:gateway
```

## API Documentation

Once the services are running, you can access:

- GraphQL Playground: http://localhost:4000/graphql
- Prisma Studio: http://localhost:5555

## Project Features

- **User Management**
  - User registration and authentication
  - Role-based access control
  - Email verification

- **Event Management**
  - Event creation and management
  - Venue management
  - Team management
  - Match scheduling

- **Ticket System**
  - Ticket categories and pricing
  - Online ticket purchase
  - Physical ticket generation
  - Ticket validation and scanning

- **Payment Processing**
  - Secure payment integration
  - Transaction management
  - Payment status tracking

## Development

```bash
# Linting
pnpm lint

# Testing
pnpm test
pnpm test:e2e
pnpm test:cov

# Build
pnpm build
```

## Project Structure

```
├── apps/
│   ├── gateway/     # API Gateway service
│   ├── users/       # User management service
│   └── events/      # Event management service
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── email-templates/ # Email templates
└── logs/           # Application logs
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is licensed under the MIT License.
