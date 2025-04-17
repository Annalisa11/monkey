# 🐵 Monkey – Backend

An Express + TypeScript API for managing interactive monkey robots that assist hospital visitors in finding their way through the hospital.

## 🚀 Tech Stack

- **Express** (v5)
- **TypeScript**
- **SQLite** (local file DB)
- **Drizzle ORM**
- **Swagger (OpenAPI)** docs

### Prerequisites

- Node.js (v20 recommended)
- npm

## 📁 Project Structure

```
backend/
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignored files
├── tsconfig.json               # TypeScript configuration
├── package.json
│
├── db/
│   ├── db.ts                   # Drizzle DB connection
│   ├── schema.ts               # Table definitions
│   ├── seed.ts                 # Seed function & sample data
│   └── ip.ts                   # Add local network monkey addresses
│
├── src/
│   ├── swagger/                # Swagger config
│   ├── routes/
│   │   ├── monkeyRoutes.ts     # Monkey endpoints
│   │   └── eventRoutes.ts      # Event endpoints
│   ├── services/
│   │   ├── monkeyService.ts    # Monkey logic
│   │   └── eventService.ts     # Event logic
│   ├── controllers/
│   │   └── monkeyController.ts # Monkey request handlers
│   │   └── eventController.ts  # Event request handlers
│   └── index.ts                # Application entry point
│   └── types.ts                # All exported type definitions
│   └── config.ts               # Application configuration consts

```

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/Annalisa11/monkey
cd backend
npm install
```

### 2. Environmental Variables `.env`

create a `.env` file in the project root and fill it with following variables (values are only examples)

```env
PORT=7000             # Port your backend will listen on
ROBOT_API_PORT=8000   # Port of the api your monkey robots are using
```

### 3. Start the server (dev)

```bash
npm run dev
```

> Runs with `tsx` and watches changes live.

## 🧠 API Overview

### Base URL

```
http://localhost:7000
```

### Swagger Docs

```
http://localhost:7000/api-docs
```

You can test endpoints and their responses through swagger or manually using curl.

Example using curl to get all monkeys:

```bash
curl -X GET "http://localhost:7000/v1/monkeys" -H "Content-Type: application/json"
```

## 🗃️ SQLite Database

Database file is created automatically.

📄 File: `db/monkey.db`

If you want to initialize the db with empty tables on first run, run following command

```bash
npm run push-db
```

### ✅ Tables created

- `monkeys` – interactive monkey robots
- `locations` – places in the hospital
- `routes` – directions between locations
- `navigation_qr_codes` – generated QR codes with tokens
- `button_press_events` – monkey button press logs
- `journey_completions` – end-of-journey logs

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

| Script            | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Run dev server with auto-reload (tsx)         |
| `npm run build`   | Compile to `dist/`                            |
| `npm run start`   | Run compiled app from `dist/index.js`         |
| `npm run push-db` | Push latest Drizzle schema directly to the DB |
