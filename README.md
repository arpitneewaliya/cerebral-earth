# Cerebral Earth (News Map App)

## Aim of the Project
- To create an interactive, map-based web application that allows users to explore world news and country-specific information visually.
- To solve the problem of scattered and text-heavy news sources by presenting information in a geographical and intuitive format.
- To integrate real-time news updates and trending events directly linked to their respective regions.
- To provide comprehensive country details (name, capital, currency, GDP, population, flag, language, etc.) for educational and informational purposes.
- To incorporate data visualization tools (charts for GDP, FDI, population, etc.) for deeper analytical insights.
- To serve as an information hub and educational resource for students, researchers, travelers, policymakers, and general users.
- To promote global awareness and understanding by connecting world events with their geographical contexts.
- To ensure the platform is scalable, engaging, and user-friendly, encouraging exploration and analysis of global data.

## End-users of the Project

The News Map App is designed with a diverse set of end-users in mind, ensuring that the application serves not only as a news platform but also as an educational and analytical tool. Identifying the end-users helps in shaping the features, interface, and scalability of the project. The primary end-users include:

- **Students and Learners** – Individuals who want to explore geography, world events, and socio-economic data in an interactive and engaging way.
- **Researchers and Academics** – Users who require quick access to reliable information about countries, their demographics, and visual data for study and analysis.
- **Travel Enthusiasts** – People interested in learning about countries, cultures, and current affairs before visiting or engaging with a new region.
- **Policy Analysts and Professionals** – Individuals who analyze global trends and need a consolidated platform for news, statistics, and data visualization.
- **General Public** – Everyday users who want to stay updated on trending news and explore world events in a simple, map-based format.

## Tech Stack

The application spans from a dynamic frontend visualization tool to a robust backend handling map mapping, news aggregation, and global data parsing.

### Frontend (`news-app`)
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS (v4)
- **Map Integration:** React Leaflet / Leaflet
- **Icons:** Lucide React
- **API Requests:** Axios
- **State/Hooks:** Custom React Hooks and Context API for structured state management

### Backend (`news-api`)
- **Server Environment:** Node.js, Express.js
- **Artificial Intelligence:** Google Generative AI (`@google/generative-ai`)
- **Geocoding:** Node Geocoder
- **API & Middleware:** Axios, CORS, Dotenv

## Folder Structure

The project relies on a monolithic repo architecture structured into a dedicated frontend client (`news-app`) and backend server API (`news-api`), configured as npm workspaces.

```text
cerebral_earth/
├── news-api/                     # Express Node.js Backend Server
│   ├── routes/                   # Express API Route handlers (consolidated dynamic charts, news, geocode)
│   ├── server.js                 # Entry point for the backend server
│   ├── gemini_ai.js              # Integration with Google Gemini AI
│   ├── geocoding.js              # Geocoding utilities
│   ├── package.json              # Node.js dependencies
│   └── .env                      # Environment variables
│
├── news-app/                     # React Frontend Application
│   ├── public/                   # Public static assets
│   ├── src/                      # Source code
│   │   ├── components/           # Reusable React components (Map, Header, SlideOverPanel, IndicatorChart, etc.)
│   │   ├── contexts/             # React Contexts for global state (e.g., ThemeContext)
│   │   ├── hooks/                # Custom React hooks (useRegionData, useAppState)
│   │   ├── media/                # Media & static assets
│   │   ├── mocks/                # Mock data for testing/development
│   │   ├── App.jsx               # Main application component handling map logic
│   │   ├── index.css             # Global styles and Tailwind configuration
│   │   └── index.jsx             # Entry point for the frontend
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration
│
├── package.json                  # Workspace definition and startup scripts
└── README.md                     # Project documentation overview
```
