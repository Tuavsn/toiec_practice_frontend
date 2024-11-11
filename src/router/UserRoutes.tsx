import { Routes, Route, Navigate } from "react-router-dom";
import {
    HomePage,
    UserProfilePage,
    TestPage,
    TestDetailPage,
    TestReviewPage,
    CoursePage,
    NotFoundPage,
    CourseDetailsPage,
    DoTestPage,
    ExercisePage,
    DoExercisePage
} from "../pages/Index";
import OAuth2RedirectHandler from "../components/Auth/OAuth2RedirectHandler";
import { Suspense } from "react";
import { LoadingSpinner } from "../components/Common/Index";


export default function UserRoutes() {
    return (
        <Suspense fallback={<LoadingSpinner text="Trang người dùng đang tải...." />}>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="/home" element={<HomePage />} />
                {/* User Profile */}
                <Route path="/profile" element={<UserProfilePage />} />
                {/* Test Page */}
                <Route path="/test" element={<TestPage />} />
                {/* Test Detail Page */}
                <Route path="/test/:id" element={<TestDetailPage />} />
                {/* Do Test  Page */}
                <Route path="/dotest/:id/:testType/:parts" element={<DoTestPage />} />
                {/* Test Review Page */}
                <Route path="/test/:id/review" element={<TestReviewPage />} />
                {/* Course Page */}
                <Route path="/course" element={<CoursePage />} />
                <Route path="/courses/:id" element={<CourseDetailsPage />} />F
                {/* Exercise page */}
                <Route path="/exercise" element={<ExercisePage />} />
                {/* Do Exercise  Page */}
                <Route path="/doexercise/:exerciseType" element={<DoExercisePage />} />
                {/* NotFound Page */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}