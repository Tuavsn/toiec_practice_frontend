import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'primeflex/primeflex.css'; // flex
import 'primeicons/primeicons.css'; // icons
import 'primereact/resources/primereact.min.css'; // core css
import 'primereact/resources/themes/lara-light-blue/theme.css'; // theme
import { Suspense, lazy } from 'react';
import { wakeupServers } from './api/api';
import './App.css';
import { LoadingSpinner } from './components/Common/Index';
import Container from './components/Layout/Container';
import { ToastProvider } from './context/ToastProvider';
import SetWebPageTitle from './utils/helperFunction/setTitlePage';
// Lazy load your layouts and routes

const AdminRoutes = lazy(() => import('./router/AdminRoutes'));
const UserLayout = lazy(() => import('./components/Layout/UserLayout'));
const UserRoutes = lazy(() => import('./router/UserRoutes'));


function App() {
  SetWebPageTitle("UTE TOEIC")
  wakeupServers().then(()=> console.log("servers is up!!!"));
  
  return (
    <BrowserRouter>
      <Suspense fallback={<main className='flex justify-content-center h-screen'><LoadingSpinner text="Trang Toeic đang tải...." /></main>}>
        <ToastProvider>
          <Container>
            <Routes>
              {/* Admin route*/}
              <Route path="/dashboard/*" element={<AdminRoutes />} />
              {/* User Route */}
              <Route path="/*" element={<UserLayout><UserRoutes /></UserLayout>} />
            </Routes>
          </Container>
        </ToastProvider>
      </Suspense>
    </BrowserRouter >
  );
}

export default App
