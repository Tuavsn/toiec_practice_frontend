import { PrimeReactProvider } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  //* </StrictMode>, */}
)
