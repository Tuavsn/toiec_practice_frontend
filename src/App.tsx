import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

import AdminLayout from './components/Layout/AdminLayout';
import AdminRoutes from './router/AdminRoutes';
import UserLayout from './components/Layout/UserLayout';
import UserRoutes from './router/UserRoutes';
import Container from './components/Layout/Container';


function App() {
  return (
    <BrowserRouter>
      <Container >
        <Routes>
          {/* Admin Route */}
          <Route path="/dashboard/*" 
            element={<AdminLayout><AdminRoutes/></AdminLayout>} 
          />
          {/* User Route */}
          <Route path="/*" 
            element={<UserLayout><UserRoutes/></UserLayout>} 
          />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App
