# Chat API

A real-time chat API built with Node.js, Express, TypeScript, and PostgreSQL. The project uses Socket.IO for real-time communication and Knex.js for database migrations and queries.

## Features

- Real-time messaging
- Room-based chat system
- Message editing and deletion
- Reply to messages
- User authentication
- Room member management

## Tech Stack

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Knex.js
- **Real-time**: Socket.IO
- **Testing**: Jest
- **Container**: Docker

## Project Structure

```
chat-api/
├── src/
│   ├── @types/          # TypeScript type definitions
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   └── server.ts        # Application entry point
├── migrations/          # Database migrations
├── __tests__/          # Test files
├── docker/             # Docker configuration
└── config/             # Configuration files
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn
- PostgreSQL (if running without Docker)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   POSTGRES_USER=chatuser
   POSTGRES_PASSWORD=chatpassword
   POSTGRES_DB=chatdb
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   JWT_SECRET=your-secret-key
   ```

4. **Database Setup**

   **Using Docker:**
   ```bash
   # Start PostgreSQL container
   docker-compose up -d
   ```

   **Manual PostgreSQL setup:**
   - Install PostgreSQL
   - Create a database named 'chatdb'
   - Update `.env` with your database credentials

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   
   Development mode:
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm run build
   npm start
   ```

## Database Migrations

The project uses Knex.js for database migrations. Migration files are in the `migrations/` directory.

### Available Migrations

1. **Create Users Table**
   - Basic user information
   - Authentication details

2. **Create Messages Table**
   - Message content
   - Sender and receiver information
   - Reply functionality
   - Timestamps

3. **Create Rooms and Relationships**
   - Chat rooms
   - Room membership
   - Room-message relationships

### Migration Commands

```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run rollback

# Create a new migration
npm run migrate:make migration_name
```

## Testing

The project uses Jest for testing. Tests are located in the `__tests__` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- `__tests__/controllers/`: Controller tests
- `__tests__/services/`: Service layer tests

## API Endpoints

### Authentication
- `POST /auth/register`: Register new user
- `POST /auth/login`: User login

### Rooms
- `POST /rooms/create`: Create new chat room
- `POST /rooms/:roomId/members`: Add member to room
- `DELETE /rooms/:roomId/members/:userId`: Remove member from room
- `GET /rooms/:roomId/members`: Get room members

### Messages
- `POST /messages`: Send message
- `PUT /messages/:id`: Edit message
- `DELETE /messages/:id`: Delete message
- `POST /messages/:id/reply`: Reply to message
- `GET /rooms/:roomId/messages`: Get room messages

