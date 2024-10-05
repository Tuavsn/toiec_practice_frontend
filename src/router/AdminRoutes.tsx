import { Routes, Route } from "react-router-dom";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import { AdminManageCategoryPage } from "../pages/AdminManageCategoryPage";
import AdminManageTestPage from "../pages/AdminManageTestPage";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboardPage />} /> {/* Default Admin Page */}
            <Route path="statistics" element={<AdminManageCategoryPage />} />
            <Route path="manage-categories" element={<AdminManageCategoryPage />} />
            <Route path="manage-tests" element={<AdminManageTestPage />} />
            <Route path="manage-users" element={<AdminManageCategoryPage />} />
            {/* Add more admin routes as needed */}
        </Routes>
    );
}