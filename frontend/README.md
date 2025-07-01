# 🐒 Monkey — Frontend

The Dashboard for managing and viewing data of the Monkey System.

## 📖 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Design Inspiration](#design-inspiration)
- [Troubleshooting](#troubleshooting)

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
│   ├── pages/            # Page components
│   ├── features/         # Domain-specific components
│   │   └── monkeys/      # Monkey-related UI (MonkeyItem, AddMonkeyDialog, etc.)
├── hooks/
├── lib/
│   ├── api/              # API calls (monkeys.ts, etc.)
│   ├── utils.ts          # Utility functions
│   └── types.ts          # TypeScript types only relevant to the frontend
├── routes/               # Pages, file-based routing
│   ├── index.tsx         # Home page
│   └── monkeys.tsx       # Monkeys CRUD page
├── index.css             # Global CSS and theme
├── constants.ts          # App-wide constants and env variables
└── main.tsx              # App entry point
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create an `.env` file in the frontend folder with the following content:

```env
VITE_API_URL=https://your-api-url.com  # http://localhost:7000
```

All environment variables must be prefixed with `VITE_` to be exposed to the frontend.

### 3. Run the development server

```bash
pnpm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### VSCode Extensions

I recommend getting the following VScode extensions to work with the repository:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Pretty Typescript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- [SVG Viewer](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.svg-preview)

## 📜 Available Scripts

- `pnpm run dev` — Start the development server
- `pnpm run build` — Build the app
- `pnpm run preview` — Preview the build locally
- `pnpm run lint` — Run Eslint through the codebase

## 🎨 Design Inspiration

The UI is inspired by various Dribbble designs:

1. https://dribbble.com/shots/25819716-Finance-dashboard-UI-Design
2. https://dribbble.com/shots/16906939-Glassmorphism-Personal-Social-Media-Dashboard-Design
3. https://dribbble.com/shots/19663288-LMS-Admin-Design-UI
4. https://dribbble.com/shots/3884743-Doom-Admin-Panel

## 🐞 Troubleshooting

- **Port already in use:** Change the port in `vite.config.ts` or stop the conflicting process.
- **API not reachable:** Check your `VITE_API_URL` and backend server status.
- **Type errors:** Ensure TypeScript is up to date and types are correctly imported.
- **Error in the vite.config.ts** If you changed something in the `tsconfig.json` or in the `vite.config.js` you might want to restart the Typescript Server. In VScode `Ctrl` + `Shift` + `P` and run `Typescript: restart TS server`.
