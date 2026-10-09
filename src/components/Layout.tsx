import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  BookOpen, 
  Menu, 
  X, 
  GraduationCap,
  Database,
  Cpu
} from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: Home, description: 'System overview and quick access' },
  { path: '/predict', label: 'Predict Performance', icon: FileSpreadsheet, description: 'Student academic assessment' },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3, description: 'Cohort analytics and metrics' },
  { path: '/students', label: 'Students', icon: Users, description: 'Student directory and records' },
  { path: '/about', label: 'About Project', icon: BookOpen, description: 'Engineering specifications' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentNav = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="min-h-screen flex bg-app-bg text-text-primary antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-app-secondary border-r border-app-border z-20 shrink-0">
        {/* Brand / Logo Area */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-app-border bg-app-secondary">
          <div className="w-8 h-8 rounded-md bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-white leading-tight">AI Predictor</div>
            <div className="text-[11px] text-text-muted leading-tight">Academic Analytics</div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Academic Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors relative",
                    isActive
                      ? "bg-brand-blue/10 text-white font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-app-hover"
                  )}
                >
                  {/* Subtle active accent indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-blue rounded-r" />
                  )}
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-brand-blue" : "text-text-muted")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Academic Context */}
        <div className="mt-auto p-4 border-t border-app-border bg-app-surface/50 text-xs">
          <div className="text-text-muted font-medium mb-1">Academic Session</div>
          <div className="text-text-primary font-semibold">AY 2026–2027 • Odd Sem</div>
          <div className="text-[11px] text-text-muted mt-0.5">Faculty Assessment Portal</div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-16 px-4 md:px-8 border-b border-app-border bg-app-secondary/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-btn text-text-secondary hover:text-white hover:bg-app-hover border border-app-border"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-text-primary leading-tight">
                {currentNav.label}
              </h1>
              <p className="text-xs text-text-muted hidden sm:block leading-tight">
                {currentNav.description}
              </p>
            </div>
          </div>

          {/* Header Status Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-badge bg-app-surface border border-app-border text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-semantic-success inline-block"></span>
              <Cpu className="w-3.5 h-3.5 text-text-muted" />
              <span>Random Forest ML Active</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-badge bg-app-surface border border-app-border text-xs text-text-secondary">
              <Database className="w-3.5 h-3.5 text-brand-blue" />
              <span>Supabase Connected</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-app-secondary border-r border-app-border flex flex-col h-full z-10">
              <div className="h-16 px-6 flex items-center justify-between border-b border-app-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-white">AI Predictor</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-app-hover"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-blue/10 text-white font-semibold"
                          : "text-text-secondary hover:text-white hover:bg-app-hover"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isActive ? "text-brand-blue" : "text-text-muted")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto p-4 border-t border-app-border text-xs text-text-muted">
                AY 2026–2027 • Faculty & Coordinator Portal
              </div>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
