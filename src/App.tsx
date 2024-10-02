import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

import {
  LoginPage,
  HomePage,
  AdminDashboardPage,
  UserProfilePage,
  TestPage,
  TestDetailPage,
  TestReviewPage,
  NotFoundPage
} from './pages/Index';
import { AdminManageCategoryPage } from './pages/AdminManageCategoryPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        {/* Admin Page */}
        <Route path="/dashboard" element={<AdminManageCategoryPage />} />
        {/* User Profile */}
        <Route path="/profile" element={<UserProfilePage />} />
        {/* Test Page */}
        <Route path="/test" element={<TestPage />} />
        {/* Test Detail Page */}
        <Route path="/test/:id" element={<TestDetailPage />} />
        {/* Test Review Page */}
        <Route path="/test/:id/review" element={<TestReviewPage />} />
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        {/* NotFound Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
