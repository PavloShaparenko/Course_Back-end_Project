# Social Network API

A small REST API for managing users, built with Node.js, Express, and PostgreSQL. It is a back-end learning project with PostgreSQL migrations and Jest/Supertest integration tests.

## Features

- List all users and retrieve a user by ID
- Create, update, and delete users
- Store user data in PostgreSQL
- Apply the database schema with `node-pg-migrate`
- Exercise the API with Jest and Supertest

## Tech stack

- Node.js
- Express 5
- PostgreSQL
- `pg` and `node-pg-migrate`
- Jest and Supertest

## API

The server listens on port `3002`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | List users |
| `GET` | `/users/:id` | Get a user by ID; returns `404` if not found |
| `POST` | `/users` | Create a user |
| `PUT` | `/users/:id` | Replace a user's username and bio; returns `404` if not found |
| `DELETE` | `/users/:id` | Delete a user; returns `404` if not found |

Send JSON to the create and update endpoints:

```json
{
  "username": "jane",
  "bio": "Hello there!"
}
```

For example:

```bash
curl http://localhost:3002/users
```

The users table has an auto-incrementing `id`, `created_at` and `updated_at` timestamps, a required `username` (up to 30 characters), and an optional `bio` (up to 400 characters).

## Getting started

### Requirements

- Node.js and npm
- PostgreSQL

### Install

```bash
git clone https://github.com/PavloShaparenko/Course_Back-end_Project.git
cd Course_Back-end_Project
npm install
```

Create the application and test databases in PostgreSQL:

```sql
CREATE DATABASE socialnetwork;
CREATE DATABASE "socialnetwork-test";
```

### Configure the database

The app's PostgreSQL connection settings are currently in `index.js`. Set them to match your local PostgreSQL host, user, and password. The integration-test connection settings are in `src/test/routes/context.js`; configure those for the `socialnetwork-test` database as well. The test database user must be allowed to create and drop PostgreSQL roles and schemas.

The migration command reads its connection URL from `DATABASE_URL`. In PowerShell, set it for the application database and run the migration:

```powershell
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/socialnetwork"
npm run migrate -- up
```

Replace `postgres` and `YOUR_PASSWORD` with your PostgreSQL credentials. Avoid committing real passwords to the repository.

### Run the API

```bash
npm start
```

The API will be available at `http://localhost:3002`.

### Run tests

After configuring the test database connection:

```bash
npm test
```

## Project structure

```text
.
├── migrations/          # PostgreSQL schema migrations
├── src/
│   ├── repos/           # User data access and row-to-camelCase conversion
│   ├── routes/          # Express user routes
│   ├── test/routes/     # API integration tests and test database context
│   ├── app.js           # Express app setup
│   └── pool.js          # PostgreSQL connection pool
├── index.js             # Database connection and HTTP server startup
└── request.http         # Example API requests
```
