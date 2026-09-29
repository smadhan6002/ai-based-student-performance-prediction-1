import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  Info, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/predict', label: 'Predict Performance', icon: BrainCircuit },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/about', label: 'About Project', icon: Info },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-gray-100 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel m-4 border-white/10 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-primary-400" />
          </div>
          <span className="font-bold text-lg text-gradient">AI Predictor</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]" 
                    : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary-400" : "text-gray-400")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass-panel border-x-0 border-t-0 rounded-none z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary-400" />
          <span className="font-bold text-gradient">AI Predictor</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 pt-16 bg-background/95 backdrop-blur-xl">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive ? "bg-primary-500/20 text-primary-400" : "text-gray-400"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative h-screen overflow-y-auto scroll-smooth pt-16 md:pt-0">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
