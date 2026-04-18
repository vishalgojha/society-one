import Admin from './pages/Admin';
import CheckIn from './pages/CheckIn';
import Dashboard from './pages/Dashboard';
import GuardCheckIn from './pages/GuardCheckIn';
import Landing from './pages/Landing';
import Logs from './pages/Logs';
import NoAccess from './pages/NoAccess';
import OperatorAuth from './pages/OperatorAuth';
import Reports from './pages/Reports';
import SecurityDashboard from './pages/SecurityDashboard';
import Settings from './pages/Settings';
import Setup from './pages/Setup';
import Analytics from './pages/Analytics';
import VisitorManagement from './pages/VisitorManagement';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "CheckIn": CheckIn,
    "Dashboard": Dashboard,
    "GuardCheckIn": GuardCheckIn,
    "Landing": Landing,
    "Logs": Logs,
    "NoAccess": NoAccess,
    "OperatorAuth": OperatorAuth,
    "Reports": Reports,
    "SecurityDashboard": SecurityDashboard,
    "Settings": Settings,
    "Setup": Setup,
    "Analytics": Analytics,
    "VisitorManagement": VisitorManagement,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};