# Developer Reference Handbook — Cerebral Earth

This handbook lists CLI commands, scripts, environment parameters, and codebase guidelines for working on Cerebral Earth.

---

## 🛠️ CLI Commands

### Start Development Server
Runs both client and server concurrently using workspaces:
```bash
npm run dev
```

### Individual Service Dev Starts
```bash
# Frontend only (news-app)
npm run dev:frontend

# Backend only (news-api)
npm run dev:backend
```

### Production Client Build
Builds the static client assets in `news-app/dist`:
```bash
npm run build --workspace=news-app
```

---

## 🔑 Environment Setup

### Backend Environment Variables (`news-api/.env`)
```env
PORT=5000
NEWS_API_KEY=your_news_api_key
GEMINI_API_KEY=your_google_gemini_api_key
LOCATIONIQ_API_KEY=your_locationiq_api_key
```

### Frontend Environment Variables (`news-app/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📏 Code Style Guidelines

### React (Frontend)
* **Components:** Functional React components using hooks. Reusable UI elements go into `src/components/`.
* **State Management:** Localized component state where possible. Context API (`ThemeContext.jsx`) is reserved for global properties like dark/light mode toggles.
* **Styling:** Tailwind CSS (v4) for styling combined with clean vanilla styles in `index.css`. Glassmorphic effects use the utility class `.glass` and CSS backdrop-blur filters.
* **Map Operations:** Utilize Leaflet custom event listeners and helper methods inside context-aware children (`useMap`, `useMapEvents`) rather than attempting direct DOM manipulation of Leaflet wrappers.

### Node.js (Backend)
* **Modules:** CommonJS syntax (`require`/`module.exports`).
* **Express Routes:** Route files are grouped inside `routes/` and registered sequentially in `server.js`.
* **Error Handling:** Always wrap async Route handlers in `try/catch` blocks and output clear console logs on backend errors before returning `500` status responses.
* **Data Parsing:** JSON response structures should be parsed and sanitized on the backend to match the React components' expectations.
