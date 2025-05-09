import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Page/Login';
import Timesheet from './Page/Timesheet';
import AdminLogin from './Page/AdminLogin'
import Statistics from './Page/Statistics'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
