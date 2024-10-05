import { Routes, Route } from "react-router-dom";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import { AdminManageCategoryPage } from "../pages/AdminManageCategoryPage";
import AdminManageTestPage from "../pages/AdminManageTestPage";
import TempAdminPage from "../pages/TempAdminPage";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboardPage />} /> {/* Default Admin Page */}
            <Route path="test-analyst" element={TempAdminPage("phân tích bài thi")} />
            <Route path="category" element={<AdminManageCategoryPage />} />
            <Route path="test" element={<AdminManageTestPage />} />
            <Route path="account" element={TempAdminPage("tài khoản")} />
            <Route path="user-analyst" element={TempAdminPage("thống kê người dùng")} />
            <Route path="notify" element={TempAdminPage("notify")} />
            <Route path="chat" element={TempAdminPage("chat")} />

        </Routes>
    );
}

