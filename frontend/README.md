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

## Design Inspiration

Since there wasn't much time to spend on design and UX, I simply based the design on elements and choices from other dribble designs.

1. https://dribbble.com/shots/25819716-Finance-dashboard-UI-Design
2. https://dribbble.com/shots/16906939-Glassmorphism-Personal-Social-Media-Dashboard-Design
3. https://dribbble.com/shots/19663288-LMS-Admin-Design-UI
4. https://dribbble.com/shots/3884743-Doom-Admin-Panel
