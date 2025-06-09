import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="h-screen bg-surface-900 overflow-hidden">
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;