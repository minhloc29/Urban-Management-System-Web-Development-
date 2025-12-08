import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoutes';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/engineer/dashboard')));

// utilities routing
const TaskUpdatePage = Loadable(lazy(() => import('views/engineer/taskUpdatePage')));
const HistoryPage = Loadable(lazy(() => import('views/engineer/historyPage')));
const MyTaskPage = Loadable(lazy(() => import('views/engineer/myTaskPage')));


// ==============================|| MAIN ROUTING ||============================== //

const EngineerRoutes = {
  path: '/engineer',
  element: (
      <ProtectedRoute allowedRoles={['technician']}>
        <MainLayout />
      </ProtectedRoute>
    ),
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'my_task',
      element: <MyTaskPage />
    },
    // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
    {
      // Thêm /:id để bắt tham số ID từ URL
      // Ví dụ: /engineer/task_update/6571b...
      path: 'update/:id', 
      element: <TaskUpdatePage />
    },
    // (Tuỳ chọn) Giữ lại route gốc để tránh lỗi nếu người dùng xóa ID thủ công
    {
      path: 'update',
      element: <TaskUpdatePage />
    },
    // -------------------------------
    {
      path: 'history',
      element: <HistoryPage />
    }
  ]
};

export default EngineerRoutes;