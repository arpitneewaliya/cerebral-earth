## News App (Vite + Tailwind)

- Dev: `npm run dev` (opens on http://localhost:5173 or next free port)
- Build: `npm run build`
- Preview build: `npm run preview`

Styling is via Tailwind v4 using `@tailwindcss/postcss` and `@import "tailwindcss"` in `src/index.css`.
Vite entry is `index.html` → `/src/index.jsx`.

Backend lives in `../news-api` (Express). Start it separately before using features that fetch charts/news.