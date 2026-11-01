import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { startGlobalSync } from '../../services/globalSync';
import { useGlobalProgress } from '../../stores/globalProgressStore';

export const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('preptoplace_sidebar_collapsed') === 'true');
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const progressState = useGlobalProgress();

  useEffect(() => startGlobalSync(({ error }) => {
    setSyncError(error);
  }), []);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (viewportWidth >= 768) setMobileMenuOpen(false);
  }, [viewportWidth]);

  const isMobile = viewportWidth < 768;
  const effectiveCollapsed = viewportWidth < 1024 || sidebarCollapsed;
  const toggleSidebar = () => setSidebarCollapsed(current => {
    const next = !current;
    localStorage.setItem('preptoplace_sidebar_collapsed', String(next));
    return next;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={effectiveCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-col transition-[margin] duration-150 ease-out motion-reduce:transition-none" style={{ marginLeft: isMobile ? 0 : effectiveCollapsed ? 80 : 256 }}>
        <TopNavbar onMenuClick={() => setMobileMenuOpen(true)} />
        {(progressState.error || syncError) && <div role="alert" className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-800">Shared progress sync failed: {progressState.error || syncError}</div>}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
