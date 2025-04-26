# 🐒 Monkey — Frontend

## 🛠️ Tech Stack

- **React 18** — Component-based UI
- **Vite** — Fast dev server & build tool
- **TypeScript** — Full type safety
- **TailwindCSS** — Utility-first CSS styling
- **shadcn/ui** — Pre-built UI components
- **TanStack Router** — Modern, file-based routing
- **TanStack Query** — API data fetching and cache management
- **Zod + React Hook Form** — Schema validation and form handling

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/               # shadcn prebuilt components (Button, Input, etc.)
│   ├── layout/           # Layout components (Sidebar, Header, etc.)
│   ├── features/         # Domain-specific components
│   │   └── monkeys/      # Monkey-related UI (MonkeyItem, AddMonkeyDialog, etc.)
├── lib/
│   ├── api/              # API calls (monkeys.ts, etc.)
│   ├── constants/        # App-wide constants and env variables
│   └── types/            # Shared TypeScript types (Monkey, MonkeyForm, etc.)
├── routes/               # Pages, file-based routing
│   ├── index.tsx         # Home page
│   └── monkeys.tsx       # Monkeys CRUD page
├── index.css           # Global CSS and theme
└── main.tsx              # App entry point
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://your-api-url.com
```

### 3. Run the development server

```bash
pnpm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
