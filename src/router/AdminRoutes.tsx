import { Suspense, lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "../components/Common/Index";
const AdminManageUploadQuestionPage = lazy(() => import("../pages/AdminManageUploadQuestionPage/AdminManageUploadQuestionPage"))
const AdminManageAssignmentPage = lazy(() => import("../pages/AdminManageAssignmentPage/AdminManageAssignmentPage"))
const AdminManageQuestionPage = lazy(() => import("../pages/AdminManageQuestionPage/AdminManageQuestionPage"))
const AdminManageLecturePage = lazy(() => import("../pages/AdminManageLecturePage/AdminManageLecturePage"))
const AdminManageCategoryPage = lazy(() => import("../pages/AdminManageCategoryPage/AdminManageCategory"))
const AdminManagePermission =lazy(()=> import("../pages/AdminManagePermission/AdminManagePermission"))
const AdminManageAccountPage = lazy(() => import("../pages/AdminManageUserPage/AdminManageUser"))
const AdminManageTestPage = lazy(() => import("../pages/AdminManageTestPage/AdminManageTest"))
const AdminManageTopic = lazy(() => import("../pages/AdminManageTopic/AdminManageTopic"));
const AdminManageRole = lazy(() => import("../pages/AdminManageRole/AdminManageRole"))
const TempAdminPage = lazy(() => import("../pages/TempAdminPage/TempAdminPage"))
const AdminLayout = lazy(() => import('../components/Layout/AdminLayout'));

export default function AdminRoutes() {
  if (localStorage.getItem("role") != "ADMIN") {
    return <Navigate to="/home" />
  }
  return (
    <AdminLayout>
      <Suspense fallback={<LoadingSpinner text="Trang quản trị đang tải...." />}>
        <Routes>
          <Route path="/" element={<AdminManageAccountPage />} /> {/* Trang chủ quản trị */}
          <Route path="test-analyst" element={<TempAdminPage text="phân tích bài thi" />} />

          {/* Nested route for category and tests */}
          <Route path="categories/:category_name_id" element={<Outlet />} >
            <Route path="tests" element={<AdminManageTestPage />} /> {/* Các đề thi trong category */}
            <Route path="tests/:test_name_id" element={<Outlet />} >
              <Route path="questions" element={<AdminManageQuestionPage />} /> {/* Các câu hỏi trong đề thi */}
              <Route path="questions/upload" element={<AdminManageUploadQuestionPage />} /> {/* Các câu hỏi trong đề thi */}
            </Route>
          </Route>

          {/* Move the more general categories route to the bottom */}
          <Route path="categories" element={<AdminManageCategoryPage />} /> {/* Quản lý các danh mục */}

          <Route path="account" element={<AdminManageAccountPage />} />
          <Route path="role" element={<AdminManageRole />} />
          <Route path="lecture" element={<AdminManageLecturePage />} />
          <Route path="topic" element={<AdminManageTopic />} />
          <Route path="permission" element={<AdminManagePermission />} />
          <Route path="lecture/:lecture_id" element={<AdminManageAssignmentPage />} />
          <Route path="user-analyst" element={<TempAdminPage text="thống kê người dùng" />} />
          <Route path="notify" element={<TempAdminPage text="notify" />} />
          <Route path="chat" element={<TempAdminPage text="chat" />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}