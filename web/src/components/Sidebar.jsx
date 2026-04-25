import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart3, Settings, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Обзор' },
    { path: '/dashboard/content', icon: Calendar, label: 'Контент-план' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Аналитика' },
    { path: '/dashboard/community', icon: Users, label: 'Сообщества' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">MediaPuls</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link to="/dashboard/settings" className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <Settings size={20} />
          <span className="font-medium">Настройки</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;