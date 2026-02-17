'use client';

import { useState } from 'react';
import { BarChart3, BookOpen, CreditCard, Star, Shield, Smartphone, Settings, HelpCircle, LogOut, Menu, Bell, User, X } from 'lucide-react';
import { OverviewPage } from '@/components/pages/overview-page';
import { CoursesPage } from '@/components/pages/courses-page';
import { OrdersPage } from '@/components/pages/orders-page';
import { ReviewsPage } from '@/components/pages/reviews-page';
import { SecurityPage } from '@/components/pages/security-page';
import { SessionsPage } from '@/components/pages/sessions-page';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

type Page = 'overview' | 'courses' | 'orders' | 'reviews' | 'security' | 'sessions';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview' as Page, icon: BarChart3, label: 'Overview' },
    { id: 'courses' as Page, icon: BookOpen, label: 'My Courses' },
    { id: 'orders' as Page, icon: CreditCard, label: 'Orders' },
    { id: 'reviews' as Page, icon: Star, label: 'Reviews' },
    { id: 'security' as Page, icon: Shield, label: 'Security' },
    { id: 'sessions' as Page, icon: Smartphone, label: 'Sessions' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <OverviewPage />;
      case 'courses': return <CoursesPage />;
      case 'orders': return <OrdersPage />;
      case 'reviews': return <ReviewsPage />;
      case 'security': return <SecurityPage />;
      case 'sessions': return <SessionsPage />;
      default: return <OverviewPage />;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b" style={{ borderColor: '#ecf0f1' }}>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            G
          </div>
          <div>
            <h1 className="text-lg text-slate-900 font-bold">GenoSpark</h1>
            <p className="text-xs text-gray-500">Learning Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-2" style={{ borderColor: '#ecf0f1' }}>
        <Button variant="ghost" className="w-full justify-start text-gray-700">
          <Settings className="size-5 mr-3" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-700">
          <HelpCircle className="size-5 mr-3" />
          Help
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="size-5 mr-3" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white border rounded-lg"
      >
        {isMobileSidebarOpen ? (
          <X className="size-6" />
        ) : (
          <Menu className="size-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`${
        isMobileSidebarOpen ? 'fixed' : 'hidden md:flex'
      } inset-0 z-30 md:relative md:w-64 flex flex-col bg-white border-r md:border-r`}
        style={{ borderColor: '#ecf0f1' }}>
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ borderColor: '#ecf0f1' }}>
          <h2 className="text-xl font-semibold text-slate-900 capitalize hidden md:block">
            {currentPage === 'overview' ? 'Dashboard' :
             currentPage === 'courses' ? 'My Courses' :
             currentPage === 'orders' ? 'Orders' :
             currentPage === 'reviews' ? 'Reviews' :
             currentPage === 'security' ? 'Security Settings' :
             'Active Sessions'}
          </h2>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="size-5" />
              <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <User className="size-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 pt-16 md:pt-8">
            {renderPage()}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
