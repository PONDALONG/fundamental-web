import { Navigate, Outlet, useRoutes } from "react-router-dom";
import ProtectedRoute from "../layout/ProtectedLayout";
import { lazy } from "react";
const DashboardPage = lazy(() => import('../pages/Dashboard'))
const SectionPage = lazy(() => import('../pages/Section'))
const AssignmentPage = lazy(() => import('../pages/Assignment'))
const StudentPage = lazy(() => import('../pages/Student'))
const ContentPage = lazy(() => import('../pages/Content'))
const SignInPage = lazy(() => import('../pages/SignIn'))
const AssignmentDetail = lazy(() => import('../pages/AssigmentDetail'))

export default function Routes() {
    const auth = localStorage.getItem('access-token') || false
    let routes = useRoutes([
        {
            path: "/",
            element: auth ? <ProtectedRoute /> : <Navigate to={'/sign-in'} />,
            children: [
                {
                    path: '/',
                    element: <Navigate to={'/dashboard'}></Navigate>
                },
                {
                    path: 'dashboard',
                    element: <DashboardPage />
                },
                {
                    path: 'content',
                    element: <ContentPage />
                },
                {
                    path: 'section',
                    element: <SectionPage />
                },
                {
                    path: 'assignment',
                    element: <AssignmentPage />
                },
                {
                    path: 'assignment/:id',
                    element: <AssignmentDetail />
                },
                {
                    path: 'student',
                    element: <StudentPage />
                },
            ]
        },
        {
            path: '/',
            element: !auth ? <Outlet /> : <Navigate to={'/'} />,
            children: [
                {
                    path: 'sign-in', element: <SignInPage />
                },
                {
                    path: '/',
                    element: <Navigate to={'/sign-in'}/>
                }
            ]
        }
    ])
    return routes
}