import { Navigate, Outlet, useRoutes } from "react-router-dom";
import ProtectedTeacherRoute from "../layout/ProtectedTeacherLayout";
import ProtectedStudentRoute from "../layout/ProtectedStudentLayout";
import { lazy } from "react";

const DashboardTeacherPage = lazy(() => import('../pages/Teacher/Dashboard'))
const SectionTeacherPage = lazy(() => import('../pages/Teacher/Section'))
const AssignmentTeacherPage = lazy(() => import('../pages/Teacher/Assignment'))
const StudentTeacherPage = lazy(() => import('../pages/Teacher/Student'))
const ContentTeacherPage = lazy(() => import('../pages/Teacher/Content'))
const SignInPage = lazy(() => import('../pages/SignIn'))
const AssignmentDetailTeacherPage = lazy(() => import('../pages/Teacher/AssigmentDetail'))
const SubmittedAssignmentListPage = lazy(() => import('../pages/Teacher/SubbmitedAssignmentList'))
const ProfileTeacher = lazy(() => import('../pages/Teacher/ProfileTeacher'))
const SubmittedAssignmenttPage = lazy(() => import('../pages/Teacher/SubmittedAssignment'))
const StudentProfilePage = lazy(() => import('../pages/Teacher/StudentProfile'))

const AssignmentStudentPage = lazy(() => import('../pages/Student/Assignment'))
const ProfileStudentPage = lazy(() => import('../pages/Student/ProfileStudent'))

export default function Routes() {
    const auth = localStorage.getItem('access-token') || false
    const role: string = 'TEACHER'
    // const role: string = 'STUDENT'
    let routes = useRoutes([
        {
            path: '',
            element: (auth && role.toUpperCase() === 'STUDENT' || role.toUpperCase() === 'TEACHER') ? <ProtectedStudentRoute /> : <Navigate to={'/sign-in'} />,
            children: [
                {
                    path: '',
                    element: <Navigate to={'/assignment'}></Navigate>
                },
                {
                    path: '/assignment',
                    element: <AssignmentStudentPage />
                },
                {
                    path: '/profile',
                    element: <ProfileStudentPage />
                }
            ]
        },
        {
            path: "teacher",
            element:  (auth && role.toUpperCase() === 'TEACHER')  ? <ProtectedTeacherRoute /> : <Navigate to={'/sign-in'} />,
            children: [
                {
                    path: '',
                    element: <Navigate to={'/teacher/dashboard'}></Navigate>
                },
                {
                    path: '/teacher/dashboard',
                    element: <DashboardTeacherPage />
                },
                {
                    path: '/teacher/content',
                    element: <ContentTeacherPage />
                },
                {
                    path: '/teacher/section',
                    element: <SectionTeacherPage />
                },
                {
                    path: '/teacher/assignment',
                    element: <AssignmentTeacherPage />
                },
                {
                    path: '/teacher/assignment-detail/:id',
                    element: <AssignmentDetailTeacherPage />
                },
                {
                    path: '/teacher/assignment-detail',
                    element: <AssignmentDetailTeacherPage />
                },
                {
                    path: '/teacher/submitted-assignment/:id',
                    element: <SubmittedAssignmentListPage />
                },
                {
                    path: '/teacher/student-submitted/:id',
                    element: <SubmittedAssignmenttPage />
                },
                {
                    path: '/teacher/student',
                    element: <StudentTeacherPage />
                },
                {
                    path: '/teacher/student/:id',
                    element: <StudentProfilePage />
                },
                {
                    path: '/teacher/profile',
                    element: <ProfileTeacher></ProfileTeacher>
                }
            ]
        },
        {
            path: '/',
            element: (!auth && (role.toUpperCase() !== 'TEACHER' || role.toUpperCase() !== 'STUDENT')) ? <Outlet /> : <Navigate to={'/'} />,
            children: [
                {
                    path: 'sign-in', element: <SignInPage />
                },
                {
                    path: '',
                    element: <Navigate to={'/sign-in'}/>
                }
            ]
        }
    ])
    return routes
}