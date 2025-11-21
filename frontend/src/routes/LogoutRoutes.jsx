import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';
import ProtectedRoute from './ProtectedRoutes';
// lazy load the landing view (located at src/views/user/landing/index.jsx)
const UserHomePage = Loadable(lazy(() => import('views/user/userHomePage')));
const ReportProblemPage = Loadable(lazy(() => import('views/user/reportProblemPage')));
const MyReportPage = Loadable(lazy(() => import('views/user/myReportPage')));
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));

const LogoutRoutes = {
  path: '/logout',
  element: (
        <LoginPage />
    )
  
};

export default LogoutRoutes;