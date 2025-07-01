# 🐵 Monkey – Backend

An Express + TypeScript API for managing interactive monkey robots that assist hospital visitors in finding their way through the hospital.

## 🚀 Tech Stack

- **Express** (v5)
- **TypeScript**
- **SQLite** (local file DB)
- **Drizzle ORM**
- **Swagger (OpenAPI)** docs
- **Vitest** (unit/integration testing)

### Prerequisites

- Node.js (v20 recommended)
- pnpm

## 📁 Project Structure

```
backend/
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignored files
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project metadata & scripts
│
├── db/
│   ├── db.ts                   # Drizzle DB connection
│   ├── schema.ts               # Table definitions
│   ├── seed.ts                 # Seed function & sample data
│   └── ip.ts                   # Add local network monkey addresses
│
├── src/
│   ├── swagger/                # Swagger config & docs
│   ├── routes/
│   │   ├── monkeyRoutes.ts     # Monkey endpoints
│   │   └── eventRoutes.ts      # Event endpoints
│   ├── services/
│   │   ├── monkeyService.ts    # Monkey logic
│   │   └── eventService.ts     # Event logic
│   ├── controllers/
│   │   ├── monkeyController.ts # Monkey request handlers
│   │   └── eventController.ts  # Event request handlers
│   ├── types.ts                # All exported type definitions
│   ├── config.ts               # Application configuration consts
│   └── index.ts                # Application entry point
│
├── tests/                      # All test files (unit/integration)
│   ├── monkey.test.ts
│   └── event.test.ts
│
└── README.md                   # Project documentation
```

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/Annalisa11/monkey
cd backend
pnpm install
```

### 2. Environmental Variables `.env`

Create a `.env` file in the project root and fill it with the following variables (values are only examples):

```env
DATABASE_URL=./db/monkey.db         # Path to SQLite DB file
```

### 3. Start the server (dev)

```bash
pnpm run dev
```

> Runs with `tsx` and watches changes live.

<!-- ### 4. Build & Run (production)

```bash
npm run build
npm start
```

> Compiles TypeScript to `dist/` and runs the compiled app. -->

### 5. Run Tests

```bash
pnpm test
```

> Runs all Vitest tests in the `tests/` directory.

## 🧠 API Overview

### Base URL

```
http://localhost:7000
```

### Swagger Docs

```
http://localhost:7000/api-docs
```

You can test endpoints and their responses through Swagger UI or manually using curl.

Example using curl to get all monkeys:

```bash
curl -X GET "http://localhost:7000/v1/monkeys" -H "Content-Type: application/json"
```

## 🗃️ SQLite Database

Database file is created automatically at first run.

📄 File: `db/monkey.db`

If you want to initialize the DB with empty tables on first run, run the following command:

```bash
pnpm run push-db
```

### ✅ Tables created

- `monkeys` – interactive monkey robots
- `locations` – places in the hospital
- `routes` – directions between locations
- `journeys` – tracks a visitor's journey, QR tokens, and status
- `events` – logs of events (button presses etc.)

All tables are initialized on startup, with foreign key relationships where needed.

If you want to **populate with demo data**, make sure the seed is called in `index.ts`:

```ts
// index.ts

const initDB = async () => {
  pingDB();
  await seedData(); // 👈 enable or comment out this to auto-seed or not
};
```

## 📦 Scripts

| Script             | Description                                   |
| ------------------ | --------------------------------------------- |
| `pnpm run dev`     | Run dev server with auto-reload (tsx)         |
| `pnpm run build`   | Compile to `dist/`                            |
| `pnpm run start`   | Run compiled app from `dist/index.js`         |
| `pnpm run push-db` | Push latest Drizzle schema directly to the DB |
| `pnpm test`        | Run all Vitest tests                          |
