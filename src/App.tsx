import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css'; // flex
import { Suspense, lazy } from 'react';
// Lazy load your layouts and routes
const AdminLayout = lazy(() => import('./components/Layout/AdminLayout'));
const AdminRoutes = lazy(() => import('./router/AdminRoutes'));
const UserLayout = lazy(() => import('./components/Layout/UserLayout'));
const UserRoutes = lazy(() => import('./router/UserRoutes'));
import Container from './components/Layout/Container';
import { LoadingSpinner } from './components/Common/Index';



function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner text="Trang Toeic đang tải...." />}>
        <Container>
          <Routes>
            {localStorage.getItem('role') === 'ADMIN' &&
              <Route path="/dashboard/*" element={<AdminLayout><AdminRoutes /></AdminLayout>} />
            }
            {/* User Route */}
            <Route path="/*" element={<UserLayout><UserRoutes /></UserLayout>} />
          </Routes>
        </Container>
      </Suspense>
    </BrowserRouter >
  );
}

export default App
