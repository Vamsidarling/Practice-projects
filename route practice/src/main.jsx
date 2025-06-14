import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeProvider';
import App from './App.jsx';
import './index.css';

// Apply theme class before rendering to prevent flash
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const root = document.documentElement;
  
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }
};

// Apply theme before rendering
document.documentElement.style.visibility = 'hidden';
applyInitialTheme();

// Render the app
const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// Show content after initial render to prevent flash
document.documentElement.style.visibility = 'visible';