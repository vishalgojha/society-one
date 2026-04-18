import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import { queryClientInstance } from '@/lib/query-client';
import NavigationTracker from '@/lib/NavigationTracker';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import RequireRole from '@/components/RequireRole';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Layout from '@/Layout';
import PageNotFound from '@/lib/PageNotFound';
import Landing from '@/pages/Landing';
import OperatorAuth from '@/pages/OperatorAuth';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import VisitorManagement from '@/pages/VisitorManagement';
import CheckIn from '@/pages/CheckIn';
import GuardCheckIn from '@/pages/GuardCheckIn';
import Logs from '@/pages/Logs';
import SecurityDashboard from '@/pages/SecurityDashboard';
import Setup from '@/pages/Setup';
import NoAccess from '@/pages/NoAccess';

function FullScreenLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
    </div>
  );
}

function AppShell({ children, currentPageName }) {
  return (
    <Layout currentPageName={currentPageName}>
      <motion.div
        key={currentPageName}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </Layout>
  );
}

function HomeRedirect() {
  const { isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) return <FullScreenLoading />;
  if (!isAuthenticated) return <Landing />;
  if (role === 'guard') return <Navigate to="/GuardCheckIn" replace />;
  return <Navigate to="/Dashboard" replace />;
}

function ProtectedRoute({ currentPageName, permission, roles, children }) {
  return (
    <RequireRole permission={permission} roles={roles}>
      <AppShell currentPageName={currentPageName}>{children}</AppShell>
    </RequireRole>
  );
}

function RoutedApp() {
  const { isLoading } = useAuth();

  if (isLoading) return <FullScreenLoading />;

  return (
    <>
      <NavigationTracker />
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/OperatorAuth" element={<OperatorAuth />} />
        <Route path="/NoAccess" element={<NoAccess />} />
        <Route path="/Dashboard" element={<ProtectedRoute currentPageName="Dashboard" roles={['super_admin', 'admin']}><Dashboard /></ProtectedRoute>} />
        <Route path="/Admin" element={<ProtectedRoute currentPageName="Admin" permission="manage_operators"><Admin /></ProtectedRoute>} />
        <Route path="/Analytics" element={<ProtectedRoute currentPageName="Analytics" permission="view_analytics"><Analytics /></ProtectedRoute>} />
        <Route path="/Reports" element={<ProtectedRoute currentPageName="Reports" permission="view_reports"><Reports /></ProtectedRoute>} />
        <Route path="/Settings" element={<ProtectedRoute currentPageName="Settings" permission="manage_settings"><Settings /></ProtectedRoute>} />
        <Route path="/VisitorManagement" element={<ProtectedRoute currentPageName="VisitorManagement" permission="manage_visitors"><VisitorManagement /></ProtectedRoute>} />
        <Route path="/CheckIn" element={<ProtectedRoute currentPageName="CheckIn" permission="checkin"><CheckIn /></ProtectedRoute>} />
        <Route path="/GuardCheckIn" element={<ProtectedRoute currentPageName="GuardCheckIn" permission="guard_checkin"><GuardCheckIn /></ProtectedRoute>} />
        <Route path="/Logs" element={<ProtectedRoute currentPageName="Logs" permission="view_logs"><Logs /></ProtectedRoute>} />
        <Route path="/SecurityDashboard" element={<ProtectedRoute currentPageName="SecurityDashboard" roles={['super_admin', 'admin']}><SecurityDashboard /></ProtectedRoute>} />
        <Route path="/Setup" element={<ProtectedRoute currentPageName="Setup" roles={['super_admin']}><Setup /></ProtectedRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <BrowserRouter>
          <RoutedApp />
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
