import { createBrowserRouter } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
import AdminRoutes from './AdminRoutes';
import EngineerRoutes from './EngineerRoutes';
import UserRoutes from './UserRoutes';
import LandingRoutes from './LandingRoutes';
import LogoutRoutes from './LogoutRoutes';
const router = createBrowserRouter(
  [
    LandingRoutes,
    AuthenticationRoutes,
    AdminRoutes,
    EngineerRoutes,
    UserRoutes,
    LogoutRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;