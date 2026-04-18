export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  OPERATOR: 'operator',
  GUARD: 'guard',
  RESIDENT: 'resident',
};

export const PERMISSIONS = {
  super_admin: ['*'],
  admin: ['manage_operators', 'view_reports', 'manage_settings', 'view_analytics', 'manage_visitors', 'checkin', 'view_logs', 'guard_checkin'],
  operator: ['checkin', 'view_logs', 'manage_visitors'],
  guard: ['checkin', 'guard_checkin', 'view_logs'],
  resident: ['view_own_visitors'],
};

export const can = (role, permission) => {
  if (!permission) return true;
  const perms = PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(permission);
};

export const hasRole = (role, allowedRoles = []) => {
  if (!allowedRoles?.length) return true;
  return allowedRoles.includes(role);
};
