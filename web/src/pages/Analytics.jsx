import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, MousePointer2, Share2 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Аналитика</h1>
        <p className="text-slate-500 mt-1">Обзор эффективности вашего контента</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Просмотры', value: '45.2K', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Охват', value: '12.8K', change: '+5%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Клики', value: '3,420', change: '+18%', icon: MousePointer2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Репосты', value: '892', change: '+24%', icon: Share2, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-500 text-sm font-bold">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <BarChart3 size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Графики в разработке</h3>
        <p className="text-slate-500 max-w-md">
          Мы работаем над визуализацией данных. Скоро здесь появятся подробные отчеты по каждому каналу.
        </p>
      </div>
    </div>
  );
};

export default Analytics;