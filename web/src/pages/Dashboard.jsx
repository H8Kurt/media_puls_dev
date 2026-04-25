import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, MessageSquare, Share2, Eye } from 'lucide-react';
import mockData from '../../mock_data.json';

const Dashboard = () => {
  const [period, setPeriod] = useState('month');

  const data = useMemo(() => {
    const now = new Date('2026-04-25'); // Используем текущую дату из контекста системы
    
    const filteredPosts = mockData.posts.filter(post => {
      const postDate = new Date(post.publish_date);
      const diffDays = (now - postDate) / (1000 * 60 * 60 * 24);
      
      if (period === 'day') return diffDays <= 1;
      if (period === 'week') return diffDays <= 7;
      if (period === 'month') return diffDays <= 30;
      if (period === 'quarter') return diffDays <= 90;
      return true;
    });

    const posts = filteredPosts.map(post => ({
      ...post,
      er: ((post.reactions + post.comments + post.shares) / post.views * 100).toFixed(2)
    }));

    if (posts.length === 0) {
      return {
        stats: [
          { label: 'Всего постов', value: 0, icon: <TrendingUp size={20} />, color: 'text-blue-600' },
          { label: 'Средний охват', value: 0, icon: <Eye size={20} />, color: 'text-purple-600' },
          { label: 'Вовлеченность (ER)', value: '0%', icon: <Users size={20} />, color: 'text-green-600' },
        ],
        chartData: [],
        topPosts: []
      };
    }

    const totalViews = posts.reduce((acc, post) => acc + post.views, 0);
    const totalEngagements = posts.reduce((acc, post) => acc + post.reactions + post.comments + post.shares, 0);
    const avgER = (totalEngagements / totalViews * 100).toFixed(1);

    const chartData = posts.reduce((acc, post) => {
      const date = post.publish_date;
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.views += post.views;
      } else {
        acc.push({ date, views: post.views });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    const topPosts = [...posts]
      .sort((a, b) => b.er - a.er)
      .slice(0, 5);

    return {
      stats: [
        { label: 'Всего постов', value: posts.length, icon: <TrendingUp size={20} />, color: 'text-blue-600' },
        { label: 'Средний охват', value: Math.round(totalViews / posts.length).toLocaleString(), icon: <Eye size={20} />, color: 'text-purple-600' },
        { label: 'Вовлеченность (ER)', value: `${avgER}%`, icon: <Users size={20} />, color: 'text-green-600' },
      ],
      chartData,
      topPosts
    };
  }, [period]);
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Аналитика контента</h2>
          <p className="text-gray-500">Статистика по всем каналам за выбранный период.</p>
        </div>
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {['day', 'week', 'month', 'quarter'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'day' ? 'День' : p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Квартал'}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
            <h3 className="text-3xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Динамика охватов</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Топ-5 постов по вовлеченности</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.topPosts.map((post) => (
            <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-400">
                <TrendingUp size={24} />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{post.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Eye size={14}/> {post.views}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14}/> {post.comments}</span>
                  <span className="flex items-center gap-1"><Share2 size={14}/> {post.shares}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-600">{post.er}%</div>
                <div className="text-xs text-gray-400">ER</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;