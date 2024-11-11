import React from "react";


const HomePage = React.lazy(() => import("./HomePage"));
const UserProfilePage = React.lazy(() => import("./UserProfilePage"));
const TestPage = React.lazy(() => import("./TestPage"));
const TestDetailPage = React.lazy(() => import("./TestDetailPage"));
const TestReviewPage = React.lazy(() => import("./TestReviewPage"));
const CoursePage = React.lazy(() => import("./CoursePage"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));
const CourseDetailsPage = React.lazy(() => import("./CourseDetailsPage"));
const LookUpPage = React.lazy(() => import("./LookUpPage"));
const DoTestPage = React.lazy(() => import("./DoTestPage"));
const ExercisePage = React.lazy(() => import("./ExercisePage"))
const DoExercisePage = React.lazy(() => import("./DoExercisePage"))
export {
    HomePage,
    UserProfilePage,
    TestPage,
    TestDetailPage,
    TestReviewPage,
    CoursePage,
    NotFoundPage,
    CourseDetailsPage,
    LookUpPage,
    DoTestPage,
    ExercisePage,
    DoExercisePage,
};
