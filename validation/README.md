# 🐒 Monkey - Validation Package

## 📂 Project Structure

```
src/
├── schemas/
│   └── index.ts          # Zod schemas
├── types/
│   └── index.ts          # Typescript types (either standalone or inferred from zod schemas)
├── index.ts              # Import everything and export out of one single main file
│
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

If you haven't done so already from the root folder, the only thing you have to do is build the package.

```bash
pnpm build
```

## 📜 Available Scripts

- `pnpm build` — Build the package so other subprojects can use the types
- `pnpm watch` — Build the package and rebuild automatically everytime you change something in a file in this project

## ✅ Usage in other places

The `validation/` directory holds all **Zod schemas** and **shared types** used by both frontend and backend. This eliminates duplication and ensures consistency across the stack.

Example usage:

```ts
import { monkeyFormSchema, Monkey } from '@validation'; // in frontend
import { monkeyFormSchema, Monkey } from 'validation'; // in backend
```

## ❓ Troubleshooting

- **Types not updating?**
  - Rebuild the validation package: `pnpm build` or run in watch mode.
