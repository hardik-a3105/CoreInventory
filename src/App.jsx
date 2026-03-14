import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import RoleSelectPage from './pages/RoleSelectPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ManagerDashboard from './pages/ManagerDashboard'
import StaffDashboard from './pages/StaffDashboard'

function Guard({ children, role }) {
  const { isAuthenticated, role: userRole } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  
  const normalizedUserRole = userRole?.toLowerCase()
  const normalizedRequiredRole = role?.toLowerCase()

  if (normalizedRequiredRole && normalizedUserRole !== normalizedRequiredRole) {
    return <Navigate to={normalizedUserRole === 'manager' ? '/manager' : '/staff'} replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Navigate to="/login" replace />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/signup"          element={<SignupPage />} />
        <Route path="/select-role"     element={<RoleSelectPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/manager"         element={<Guard role="manager"><ManagerDashboard /></Guard>} />
        <Route path="/staff"           element={<Guard role="staff"><StaffDashboard /></Guard>} />
        <Route path="*"                element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

