import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, MessageSquare, Share2, Eye, FileText, Download, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ posts: [], groupStats: [] });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [period, setPeriod] = useState('month');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stats/vk?period=${period}`);
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await axios.post(`/api/stats/sync`);
      await fetchStats();
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    } finally {
      setSyncing(false);
    }
  };

  const data = useMemo(() => {
    if (!stats.posts.length && !stats.groupStats.length) {
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

    const totalViews = stats.posts.reduce((acc, post) => acc + (Number(post.views) || 0), 0);
    const totalEngagements = stats.posts.reduce((acc, post) => acc + (Number(post.likes) || 0) + (Number(post.comments) || 0) + (Number(post.reposts) || 0), 0);
    const avgER = totalViews > 0 ? (totalEngagements / totalViews * 100).toFixed(1) : 0;

    const chartData = stats.groupStats && stats.groupStats.length > 0
      ? [...stats.groupStats].map(item => ({
          date: new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
          views: Number(item.views) || 0,
          reach: Number(item.reach) || 0
        }))
      : [];

    const todayStr = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const hasToday = chartData.some(d => d.date === todayStr);
    
    if (!hasToday && stats.posts.length > 0) {
      const todayPosts = stats.posts.filter(p => 
        new Date(p.date).toLocaleDateString('ru-RU') === new Date().toLocaleDateString('ru-RU')
      );
      
      if (todayPosts.length > 0) {
        const todayViews = todayPosts.reduce((acc, p) => acc + (Number(p.views) || 0), 0);
        chartData.push({
          date: todayStr,
          views: todayViews,
          reach: Math.round(todayViews * 0.8)
        });
      }
    }

    const topPosts = [...stats.posts]
      .map(post => ({
        ...post,
        er: post.views > 0 ? ((post.likes + post.comments + post.reposts) / post.views * 100).toFixed(2) : 0
      }))
      .sort((a, b) => b.er - a.er)
      .slice(0, 5);

    return {
      stats: [
        { label: 'Всего постов', value: stats.posts.length, icon: <TrendingUp size={20} />, color: 'text-blue-600' },
        { label: 'Средний охват', value: stats.posts.length > 0 ? Math.round(totalViews / stats.posts.length).toLocaleString() : 0, icon: <Eye size={20} />, color: 'text-purple-600' },
        { label: 'Вовлеченность (ER)', value: `${avgER}%`, icon: <Users size={20} />, color: 'text-green-600' },
      ],
      chartData,
      topPosts
    };
  }, [stats]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Загрузка аналитики...</div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Аналитика ВКонтакте</h2>
          <p className="text-gray-500">Реальные данные из вашего сообщества.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            {[
              { id: 'week', label: 'Неделя' },
              { id: 'month', label: 'Месяц' },
              { id: 'quarter', label: 'Квартал' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  period === p.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={18} className={`text-blue-600 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Обновление...' : 'Обновить данные'}
            </button>
            <a 
              href={`/api/export/excel?period=${period}`} 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
              <Download size={18} className="text-green-600" />
              Excel
            </a>
            <a 
              href={`/api/export/pdf?period=${period}`} 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
              <FileText size={18} className="text-red-600" />
              PDF Отчет
            </a>
          </div>
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
        <h3 className="text-lg font-semibold mb-6">Динамика просмотров</h3>
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
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Топ постов по вовлеченности</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.topPosts.map((post) => (
            <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{post.text || '(Без текста)'}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Eye size={14}/> {post.views}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={14}/> {post.comments}</span>
                  <span className="flex items-center gap-1"><Share2 size={14}/> {post.reposts}</span>
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