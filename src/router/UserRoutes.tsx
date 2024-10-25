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
    LookUpPage,
    DoTestPage
} from "../pages/Index";
import OAuth2RedirectHandler from "../components/Auth/OAuth2RedirectHandler";

export default function UserRoutes() {
    return (
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
             <Route path="/dotest/:id/:parts" element={<DoTestPage />} />
            {/* Test Review Page */}
            <Route path="/test/:id/review" element={<TestReviewPage />} />
            {/* Flash Card Page */}
            <Route path="/course" element={<CoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />F

            <Route path="/lookup" element={<LookUpPage />} />
            {/* NotFound Page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}