import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Дашборд', icon: '📊', path: '/dashboard' },
    { name: 'Календарь', icon: '📅', path: '/calendar' },
    { name: 'Аналитика', icon: '📈', path: '/analytics' },
    { name: 'Модерация', icon: '🛡️', path: '/moderation' },
    { name: 'Настройки', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-6">
        <div className="text-2xl font-bold text-indigo-600">МедиаПульс</div>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition ${
                isActive 
                  ? 'text-white bg-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span> {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
