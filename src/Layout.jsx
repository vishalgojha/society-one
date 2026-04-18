import React from 'react';
import { Home, LogOut, ShieldCheck, Settings, UserCircle2, Users, ClipboardList, ScanFace } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/AuthContext';
import { can } from '@/lib/rbac';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/Dashboard', icon: Home, roles: ['super_admin', 'admin'] },
  { label: 'Check-In', href: '/CheckIn', icon: ScanFace, permission: 'checkin' },
  { label: 'Visitors', href: '/VisitorManagement', icon: Users, permission: 'manage_visitors' },
  { label: 'Logs', href: '/Logs', icon: ClipboardList, permission: 'view_logs' },
  { label: 'Settings', href: '/Settings', icon: Settings, permission: 'manage_settings' },
  { label: 'Admin', href: '/Admin', icon: ShieldCheck, permission: 'manage_operators' },
];

const mobileItems = [
  { label: 'Dashboard', href: '/Dashboard', icon: Home },
  { label: 'Check-In', href: '/CheckIn', icon: ScanFace },
  { label: 'Logs', href: '/Logs', icon: ClipboardList },
  { label: 'Settings', href: '/Settings', icon: Settings },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user, operator, role, logout } = useAuth();

  const initials = (operator?.name || user?.email || 'SO')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const availableNav = navItems.filter((item) => {
    if (item.roles) return item.roles.includes(role);
    return can(role, item.permission);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <style>{`
        :root {
          --background: 222.2 47% 8%;
          --foreground: 210 40% 98%;
          --card: 222.2 47% 11%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 47% 11%;
          --popover-foreground: 210 40% 98%;
          --primary: 160 84% 39%;
          --primary-foreground: 210 40% 98%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 160 84% 39%;
          --sidebar: 222.2 47% 10%;
          --sidebar-foreground: 210 40% 98%;
          --sidebar-border: 217.2 32.6% 17.5%;
          --sidebar-accent: 217.2 32.6% 17.5%;
          --sidebar-accent-foreground: 210 40% 98%;
          --sidebar-ring: 160 84% 39%;
        }

        body {
          background:
            radial-gradient(circle at top left, rgba(16, 185, 129, 0.16), transparent 28%),
            radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 22%),
            rgb(2 6 23);
          -webkit-tap-highlight-color: transparent;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-800/80">
          <SidebarHeader className="p-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">SocietyOne</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{localStorage.getItem('activeSocietyName') || 'Current Society'}</h2>
                </div>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                  {role || 'guest'}
                </Badge>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {availableNav.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.href} tooltip={item.label} className="h-11 rounded-xl">
                        <Link to={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700">
                  <AvatarFallback className="bg-slate-800 text-slate-200">{initials || 'SO'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{operator?.name || user?.email || 'Operator'}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <Button onClick={logout} variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-800 hover:text-white">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="bg-transparent">
          <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 md:px-6">
              <SidebarTrigger className="rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900 md:flex" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Resident Security</p>
                <h1 className="text-lg font-semibold text-white">{location.pathname.replace('/', '') || 'Dashboard'}</h1>
              </div>
              <Badge variant="outline" className="hidden border-slate-700 bg-slate-900 text-slate-300 md:flex">
                {operator?.is_on_duty || operator?.isOnDuty ? 'On Duty' : 'Offline'}
              </Badge>
            </div>
          </header>

          <div className="flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-6">{children}</div>

          <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 p-2 backdrop-blur md:hidden">
            <div className="grid grid-cols-4 gap-1">
              {mobileItems
                .filter((item) => availableNav.some((nav) => nav.href === item.href))
                .map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs text-slate-500 transition',
                      location.pathname === item.href && 'bg-slate-900 text-emerald-300'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
            </div>
          </nav>
        </SidebarInset>
      </SidebarProvider>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgb(15 23 42)',
            border: '1px solid rgb(51 65 85)',
            color: 'white',
          },
        }}
      />
    </div>
  );
}
