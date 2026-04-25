import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Всего постов', value: '124', change: '+12%' },
    { label: 'Охват', value: '45.2k', change: '+5.4%' },
    { label: 'Активные каналы', value: '8', change: '0' },
    { label: 'Запланировано', value: '12', change: '' },
  ];

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Обзор системы</h2>
        <p className="text-gray-500">Добро пожаловать в панель управления контентом.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <p className="text-gray-400 italic">Здесь будет график активности (Recharts)</p>
      </div>
    </div>
  );
};

export default Dashboard;