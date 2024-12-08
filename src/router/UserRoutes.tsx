import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import OAuth2RedirectHandler from "../components/Auth/OAuth2RedirectHandler";
import { LoadingSpinner } from "../components/Common/Index";
import {
    DoExercisePage,
    ExercisePage,
    HomePage,
    LectureDetailsPage,
    LecturePage,
    LookUpPage,
    NotFoundPage,
    TestOverallResultPage,
    TestPage,
    TestReviewPage,
    TestRoutes,
    UserProfilePage
} from "../pages/Index";





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