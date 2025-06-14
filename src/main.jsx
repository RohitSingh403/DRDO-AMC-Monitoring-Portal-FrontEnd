import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </Router>
  </StrictMode>,
)
