'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Cookies from 'js-cookie';

type UserRole = 'SUPERADMIN' | 'LEAGUE_ADMIN' | 'PLAYER';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const [userRole] = useState<UserRole>(() => {
    const role = Cookies.get('southgo_role');
    if (role === 'SUPERADMIN' || role === 'LEAGUE_ADMIN' || role === 'PLAYER') {
      return role;
    }
    return 'PLAYER';
  });

  return (
    <DashboardLayout role={userRole === 'SUPERADMIN' ? 'SUPERADMIN' : 'LEAGUE_ADMIN'}>
      {children}
    </DashboardLayout>
  );
}
