import React from "react";


const HomePage = React.lazy(() => import("./HomePage"));
const UserProfilePage = React.lazy(() => import("./UserProfilePage"));
const TestPage = React.lazy(() => import("./TestPage"));
const TestDetailPage = React.lazy(() => import("./TestDetailPage"));
const TestOverallResultPage = React.lazy(() => import("./TestOverallResultPage"));
const LecturePage = React.lazy(() => import("./LecturePage"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));
const LectureDetailsPage = React.lazy(() => import("./LectureDetailsPage"));
const LookUpPage = React.lazy(() => import("./LookUpPage"));
const DoTestPage = React.lazy(() => import("./DoTestPage"));
const ExercisePage = React.lazy(() => import("./ExercisePage"))
const DoExercisePage = React.lazy(() => import("./DoExercisePage"))
const TestReviewPage = React.lazy(() => import("../pages/TestReviewPage"))
const TestRoutes = React.lazy(() => import("../router/TestRoutes"));
export {
    TestOverallResultPage,
    LectureDetailsPage,
    UserProfilePage,
    TestDetailPage,
    DoExercisePage,
    TestReviewPage,
    NotFoundPage,
    ExercisePage,
    LecturePage,
    TestRoutes,
    DoTestPage,
    LookUpPage,
    HomePage,
    TestPage,
};
