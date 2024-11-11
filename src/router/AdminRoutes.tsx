import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from "../components/Common/Index";
const AdminManageQuestionPage = lazy(() => import("../pages/AdminManageQuestionPage/AdminManageQuestionPage"))
const TempAdminPage = lazy(() => import("../pages/TempAdminPage"))
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"))
const AdminManageAccountPage = lazy(() => import("../pages/AdminManageAccount"))
const AdminManageCategoryPage = lazy(() => import("../pages/AdminManageCategoryPage"))
const AdminManageTestPage = lazy(() => import("../pages/AdminManageTestPage"))
const AdminManageCoursePage = lazy(() => import("../pages/AdminManageCoursePage"))

export default function AdminRoutes() {
    return (
        <Suspense fallback={<LoadingSpinner text="Trang quản trị đang tải...." />}>
            <Routes>
                <Route path="/" element={<AdminDashboardPage />} /> {/* Default Admin Page */}
                <Route path="test-analyst" element={<TempAdminPage text="phân tích bài thi" />} />
                <Route path="category" element={<AdminManageCategoryPage />} />
                <Route path="categories/:category_id/tests" element={<AdminManageTestPage />} />
                <Route path="tests/:test_id/questions" element={<AdminManageQuestionPage />} />
                <Route path="account" element={<AdminManageAccountPage />} />
                <Route path="course" element={<AdminManageCoursePage />} />
                <Route path="user-analyst" element={<TempAdminPage text="thống kê người dùng" />} />
                <Route path="notify" element={<TempAdminPage text="notify" />} />
                <Route path="chat" element={<TempAdminPage text="chat" />} />
            </Routes>
        </Suspense>
    );
}

