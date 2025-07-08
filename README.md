# 🐵 Monkey - Monorepo

A full-stack monorepo for the Monkey Navigation System.

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Shared Types & Validation](#shared-types--validation)
- [Troubleshooting](#troubleshooting)

## Project Overview

This repository contains all code for the Monkey Navigation System, including:

- **Frontend**: A React app (Vite + TypeScript) for the user interface.
- **Backend**: A Node.js server (Express + Drizzle + SQLite) for business logic and data storage.
- **Validation**: Shared Zod schemas and TypeScript types for type-safe communication between frontend and backend.
- **Robot Eyes**: A Python project for animating the monkey's eyes (not part of the main monorepo toolchain).

## Monorepo Structure

```txt
/
├── frontend/           # React app (Vite + TypeScript)
├── backend/            # Node.js backend (Express + Drizzle + SQLite)
├── validation/         # Shared Zod schemas & TypeScript types
├── robot-eyes/         # Python project for monkey eye animation (standalone)
│
├── node_modules/       # Installed dependencies
├── pnpm-workspace.yaml # Monorepo workspace config
├── package.json        # Root scripts and dependencies
└── tsconfig.base.json  # Shared TypeScript config
```

- **frontend/**: Contains all UI code, assets, and configuration for the web app.
- **backend/**: Contains API routes, database models, and server logic.
- **validation/**: Houses all shared types and Zod schemas for validation and type safety.
- **robot-eyes/**: Python scripts for animating the robot's eyes (optional, not managed by pnpm).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)
- [Python 3](https://www.python.org/) (for `robot-eyes`, optional)

## Getting Started

### 1. Install dependencies

```bash
cd monkey
pnpm install
```

### 2. Build shared types and schemas

```bash
pnpm validation:build
```

This builds the validation package so that the frontend and backend can import its types and schemas.

### 3. Run the whole system

If it's your first time running the system take a look at the backend and frontend `README.md` files, you will first have to add the corresponding `.env` variables and initilize the database.
Once you set up both systems according to their documentations you can start them without problems.  

run each commands in a different terminal window

```bash
pnpm backend:dev
pnpm frontend:dev
```

Runs both frontend and backend in dev mode.

## Development Workflow

- **Frontend**: Develop UI in `frontend/`. Use `pnpm frontend:dev` to start the dev server.
- **Backend**: Develop API and logic in `backend/`. Use `pnpm backend:dev` to start the backend server.
- **Validation**: Edit or add Zod schemas/types in `validation/`. Rebuild with `pnpm validation:build` or run in watch mode with `pnpm validation:watch`.
- **Robot Eyes**: (Optional) Run Python scripts in `robot-eyes/` as needed.

## Available Scripts

All scripts follow the format: `section:command` (e.g., `frontend:dev`).

### General

```bash
pnpm format           # Run Prettier on the whole project
pnpm build            # build validation, frontend and backend
```

### Frontend

```bash
pnpm frontend:dev         # Start Vite dev server
pnpm frontend:build       # Build frontend
```

### Backend

```bash
pnpm backend:dev         # Start backend dev server
pnpm backend:build       # Build backend
```

### Shared Validation

```bash
pnpm validation:build     # Build validation package once
pnpm validation:watch     # Watch for changes and rebuild
```

## Shared Types & Validation

The `validation/` directory holds all **Zod schemas** and **shared types** used by both frontend and backend. This eliminates duplication and ensures consistency across the stack.

Example usage:

```ts
import { monkeyFormSchema, Monkey } from '@validation'; // in frontend
import { monkeyFormSchema, Monkey } from 'validation'; // in backend
```

## Troubleshooting

- **Types not updating?**
  - Rebuild the validation package: `pnpm validation:build` or run in watch mode.
- **Dependency issues?**
  - Try deleting `node_modules` and running `pnpm install` again.
- **Python errors in robot-eyes?**
  - Ensure you have Python 3 installed and the required dependencies for that subproject.
