# 🐵 Monkey - Monorepo

This is a full-stack monorepo for the Monkey Navigation System.

---

## 📁 Project Structure

```txt
/
├── frontend/           # React app (Vite + TypeScript)
├── backend/            # Node.js backend (Express + Drizzle + SQLite)
├── validation/         # Shared Zod schemas & TypeScript types
├── robot-eyes/         # Not really part of the monorepo. Python project for the animation of the monkey eyes
│
├── node_modules/
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build the shared Types and Schemas

```bash
pnpm validation:build
```

Builds the validation package so that the frontend and backend can import its types and schemas.

### 3. Run the whole system

```bash
pnpm dev
```

Runs both frontend and backend in parallel.

## 🔧 Available Scripts

All scripts follow the format: `section:command`

### General

```bash
pnpm format           # Run Prettier on the whole project
pnpm typecheck        # Run TypeScript in all packages
```

### Frontend

```bash
pnpm frontend:dev         # Start Vite dev server
pnpm frontend:build       # Build production frontend
pnpm frontend:typecheck   # Typecheck frontend only
```

### Backend

```bash
pnpm backend:dev         # Start backend dev server
pnpm backend:build       # Build backend
pnpm backend:typecheck   # Typecheck backend
```

### Shared Validation

```bash
pnpm validation:build     # Build validation package
pnpm validation:watch     # Watch for changes and rebuild
```

## 📦 Shared Types & Validation

The `packages/validation` directory holds all **Zod schemas** and **shared types** used by both frontend and backend. This eliminates duplication and ensures consistency across the stack.

```ts
import { monkeyFormSchema, Monkey } from '@validation'; // example use in frontend
import { monkeyFormSchema, Monkey } from 'validation'; // example use in backend
```
