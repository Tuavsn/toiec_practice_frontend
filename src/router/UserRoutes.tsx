import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "../components/Common/Index";
import OAuth2RedirectHandler from "../components/Auth/OAuth2RedirectHandler";
import {
    TestOverallResultPage,
    LectureDetailsPage,
    UserProfilePage,
    TestDetailPage,
    DoExercisePage,
    TestReviewPage,
    NotFoundPage,
    ExercisePage,
    LecturePage,
    DoTestPage,
    LookUpPage,
    HomePage,
    TestPage,
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
                {/* Test Detail Page */}
                <Route path="/test/:id" element={<TestDetailPage />} />
                {/* Do Test  Page */}
                <Route path="/dotest/:time/:id/:testType/:parts" element={<DoTestPage />} />
                {/* Test Review Page */}
                <Route path="/test/:id/review" element={<TestOverallResultPage />} />
                <Route path="/test/:id/review/detail" element={<TestReviewPage />} />
                {/* Course Page */}
                <Route path="/lecture" element={<LecturePage />} />
                <Route path="/lectures/:lecture_name_id" element={<LectureDetailsPage />} />F
                {/* Exercise page */}
                <Route path="/exercise" element={<ExercisePage />} />
                {/* Do Exercise  Page */}
                <Route path="/doexercise/:exerciseType" element={<DoExercisePage />} />
                {/* Lookup  Page */}
                <Route path="/lookup" element={<LookUpPage />} />
                {/* NotFound Page */}
                <Route path="/dashboard" element={<Navigate to="/dashboard/" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}