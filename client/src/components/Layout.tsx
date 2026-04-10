import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <Fragment>
      <Sidebar />
      <main className="flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </Fragment>
  );
}
