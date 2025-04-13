# 🐵 Monkey – Backend

An Express + TypeScript API for managing interactive monkey robots that assist hospital visitors in finding their way through the hospital.

## 🚀 Tech Stack

- **Express** (v5)
- **TypeScript**
- **SQLite** (local file DB)
- **Swagger (OpenAPI)** docs

### Prerequisites

- Node.js (v14+)
- npm

## 📁 Project Structure

```
backend/
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignored files
├── tsconfig.json               # TypeScript configuration
├── package.json
├── db/
│   ├── db.ts                   # Database connection
│   └── schema.ts               # Database schema definitions
├── src/
│   ├── swagger/                # Swagger config & schemas
│   ├── routes/
│   │   └── monkeyRoutes.ts     # Monkey endpoints
│   ├── services/
│   │   └── monkeyService.ts    # Monkey business logic
│   ├── controllers/
│   │   └── monkeyController.ts # Monkey request handlers
│   └── index.ts                # Application entry point
```

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-org/backend
cd backend
npm install
```

### 2. Environmental Variables `.env`

create a `.env` file in the project root and fill it with following variables (values are only examples)

```env
PORT=7000
```

### 3. Start the server (dev)

```bash
npm run dev
```

> Runs with `tsx` and watches changes live.

## 🧠 API Overview

### ✅ Base URL

```
http://localhost:7000
```

### 📚 Swagger Docs

```
http://localhost:7000/api-docs
```

You can test endpoints and their responses through swagger or manually using curl.

Example using curl to get all monkeys:

```bash
curl -X GET "http://localhost:7000/v1/monkeys" -H "Content-Type: application/json"
```

## 🗃️ SQLite Database

The database will be automatically initialized with sample data when the application starts. If you want to reset the database, delete the SQLite file and restart the application.

Database file: `db/monkey.db`

### Tables Created

- `monkeys` – all monkey bots
- `qr_codes` – scanned/created QR codes
- `rewards` – banana/candy tracking
- `settings` – monkey behavior config
- `stats` – daily usage metrics

Tables auto-initialize on server start.

If you want to start with sample data (not an empty database) on first run then uncomment the line in `db.ts` which says `SeedAndPrintMonkeyTable()`.

```ts
db.run(
  `CREATE TABLE IF NOT EXISTS monkeys(
    monkey_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 0
  )`,
  [],
  (err: Error | null) => {
    if (err) {
      console.error('Error creating monkeys table:', err.message);
      return;
    }
    // SeedAndPrintMonkeyTable();  <-- uncomment this line right here
  }
);
```

## 📦 Scripts

| Script        | Description                           |
| ------------- | ------------------------------------- |
| `npm run dev` | Run dev server with auto-reload (tsx) |
