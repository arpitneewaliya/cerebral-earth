import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  </React.StrictMode>
);
