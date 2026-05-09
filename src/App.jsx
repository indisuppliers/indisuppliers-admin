import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import RecentActivity from './pages/RecentActivity'
import SellerList from './pages/sellers/SellerList'
import AddSeller from './pages/sellers/AddSeller'
import VerificationQueue from './pages/sellers/VerificationQueue'
import BlockedSellers from './pages/sellers/BlockedSellers'
import SellerReports from './pages/sellers/SellerReports'
import ProductList from './pages/products/ProductList'
import AddProduct from './pages/products/AddProduct'
import StockStatus from './pages/products/StockStatus'
import Orders from './pages/billing/Orders'
import Payments from './pages/billing/Payments'
import AdvanceLedger from './pages/billing/AdvanceLedger'
import Invoices from './pages/billing/Invoices'
import BillingReports from './pages/billing/BillingReports'
import TeamManagement from './pages/team/TeamManagement'
import AddStaff from './pages/team/AddStaff'
import RoleManagement from './pages/team/RoleManagement'
import ProfileSettings from './pages/settings/ProfileSettings'
import CreateRoles from './pages/settings/CreateRoles'
import PermissionsPage from './pages/settings/PermissionsPage'
import NotificationSettings from './pages/settings/NotificationSettings'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="activity" element={<RecentActivity />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="team/add" element={<AddStaff />} />
            <Route path="team/roles" element={<RoleManagement />} />
            <Route path="sellers" element={<SellerList />} />
            <Route path="sellers/add" element={<AddSeller />} />
            <Route path="sellers/verification" element={<VerificationQueue />} />
            <Route path="sellers/blocked" element={<BlockedSellers />} />
            <Route path="sellers/reports" element={<SellerReports />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/stock" element={<StockStatus />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/advance" element={<AdvanceLedger />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="billing/reports" element={<BillingReports />} />
            <Route path="messages" element={<ComingSoon title="Direct Chat — Phase 2" />} />
            <Route path="notifications" element={<ComingSoon title="Notifications — Phase 2" />} />
            <Route path="bulk-messages" element={<ComingSoon title="Bulk Messages — Phase 2" />} />
            <Route path="settings/profile" element={<ProfileSettings />} />
            <Route path="settings/roles" element={<CreateRoles />} />
            <Route path="settings/permissions" element={<PermissionsPage />} />
            <Route path="settings/notifications" element={<NotificationSettings />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}