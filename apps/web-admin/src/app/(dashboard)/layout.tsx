'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Cookies from 'js-cookie';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<'SUPERADMIN' | 'LEAGUE_ADMIN' | 'PLAYER'>('PLAYER');

  useEffect(() => {
    const role = Cookies.get('southgo_role') as 'SUPERADMIN' | 'LEAGUE_ADMIN' | 'PLAYER';
    if (role) {
      setUserRole(role);
    }
  }, []);

  return (
    <DashboardLayout role={userRole as 'SUPERADMIN' | 'LEAGUE_ADMIN'}>
      {children}
    </DashboardLayout>
  );
}
