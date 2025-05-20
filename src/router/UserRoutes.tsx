import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import OAuth2RedirectHandler from "../components/Auth/OAuth2RedirectHandler";
import { LoadingSpinner } from "../components/Common/Index";
const TestRoutes = React.lazy(() => import("../router/TestRoutes"));
const HomePage = React.lazy(() => import("../pages/HomePage/HomePage"));
const TestPage = React.lazy(() => import("../pages/TestPage/TestPage"));
const LookUpPage = React.lazy(() => import("../pages/LookUpPage/LookUpPage"));
const LecturePage = React.lazy(() => import("../pages/LecturePage/LecturePage"));
const NotFoundPage = React.lazy(() => import("../pages/NotFoundPage/NotFoundPage"));
const ExercisePage = React.lazy(() => import("../pages/ExercisePage/ExercisePage"));
const DoExercisePage = React.lazy(() => import("../pages/DoTestPage/DoExercisePage"));
const TestReviewPage = React.lazy(() => import("../pages/TestReviewPage/TestReviewPage"));
const UserProfilePage = React.lazy(() => import("../pages/UserProfilePage/UserProfilePage"));
const ToeicPart1Page = React.lazy(() => import("../pages/WritingPracticePage/ToeicPart1Page"));
const LectureDetailsPage = React.lazy(() => import("../pages/LectureDetailsPage/LectureDetailsPage"));
const TestOverallResultPage = React.lazy(() => import("../pages/TestOverallResultPage/TestOverallResultPage"));




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
                {/* Test Routes */}
                <Route path="/test/*" element={<TestRoutes />} />
                <Route path="/writing/p1" element={<ToeicPart1Page />} />

                <Route path="/exercise" element={<ExercisePage />} />
                {/* Do Exercise  Page */}
                <Route path="/doexercise/:exerciseType" element={<DoExercisePage />} />

                {/* Test Review Page */}
                <Route path="/test/:id/review" element={<TestOverallResultPage />} />
                <Route path="/test/:id/review/detail" element={<TestReviewPage />} />
                {/* Course Page */}
                <Route path="/lecture" element={<LecturePage />} />
                <Route path="/lecture/:lecture_name_id" element={<LectureDetailsPage />} />F
                {/* Exercise page */}
                {/* Lookup  Page */}
                <Route path="/lookup" element={<LookUpPage />} />
                {/* NotFound Page */}
                <Route path="/dashboard" element={<Navigate to="/dashboard/" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}