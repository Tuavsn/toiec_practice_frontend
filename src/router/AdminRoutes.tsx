import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from "../components/Common/Index";
const AdminManageQuestionPage = lazy(() => import("../pages/AdminManageQuestionPage/AdminManageQuestionPage"))
const TempAdminPage = lazy(() => import("../pages/TempAdminPage"))
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"))
const AdminManageAccountPage = lazy(() => import("../pages/AdminManageAccount"))
const AdminManageCategoryPage = lazy(() => import("../pages/AdminManageCategoryPage"))
const AdminManageTestPage = lazy(() => import("../pages/AdminManageTestPage"))
const AdminManageCoursePage = lazy(() => import("../pages/AdminManageCoursePage"))
const AdminLayout = lazy(() => import('../components/Layout/AdminLayout'));
export default function AdminRoutes() {
  if( localStorage.getItem("role") != "ADMIN"){
    return <Navigate to="/home" />
  }
    return (
      <AdminLayout>
      <Suspense fallback={<LoadingSpinner text="Trang quản trị đang tải...." />}>
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} /> {/* Trang chủ quản trị */}
          <Route path="test-analyst" element={<TempAdminPage text="phân tích bài thi" />} />
          
          {/* Nested route for category and tests */}
          <Route
            path="categories/:category_name_id"
            element={<Outlet />}
          >
            <Route path="tests" element={<AdminManageTestPage />} /> {/* Các đề thi trong category */}
            <Route path="tests/:test_name_id/questions" element={<AdminManageQuestionPage />} /> {/* Các câu hỏi trong đề thi */}
          </Route>
  
          {/* Move the more general categories route to the bottom */}
          <Route path="categories" element={<AdminManageCategoryPage />} /> {/* Quản lý các danh mục */}
          
          <Route path="account" element={<AdminManageAccountPage />} />
          <Route path="course" element={<AdminManageCoursePage />} />
          <Route path="user-analyst" element={<TempAdminPage text="thống kê người dùng" />} />
          <Route path="notify" element={<TempAdminPage text="notify" />} />
          <Route path="chat" element={<TempAdminPage text="chat" />} />
        </Routes>
      </Suspense>
      </AdminLayout>
    );
  }