import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, MousePointer2, Share2, 
  Download, Calendar, Filter, MessageSquare, Heart, Repeat 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import axios from 'axios';

const formatChartDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const Analytics = () => {
  const [period, setPeriod] = useState('month');
  const [category, setCategory] = useState('all');
  const [data, setData] = useState({ posts: [], groupStats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period, category]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/stats/vk?period=${period}&category=${category}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      let exportUrl = `http://localhost:4000/api/export/${format}?period=${period}`;
      const response = await axios.get(exportUrl, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${period}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const calculateTotals = () => {
    if (!data.posts.length && !data.groupStats.length) return { views: '0', reach: '0', reactions: '0', err: '0%' };
    
    const reactions = data.posts.reduce((acc, p) => acc + (p.likes || 0) + (p.comments || 0) + (p.reposts || 0), 0);
    
    // Суммируем просмотры и охват из статистики группы
    const totalViews = data.groupStats.reduce((acc, s) => acc + (Number(s.views) || 0), 0);
    const totalReach = data.groupStats.reduce((acc, s) => acc + (Number(s.reach) || 0), 0);
    
    // Если статистика группы пуста, пробуем взять просмотры из постов
    const displayViews = totalViews > 0 ? totalViews : data.posts.reduce((acc, p) => acc + (p.views || 0), 0);
    
    const err = displayViews > 0 ? ((reactions / displayViews) * 100).toFixed(2) : 0;
    
    const formatValue = (val) => {
      if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
      return val.toString();
    };

    return { 
      views: formatValue(displayViews), 
      reach: formatValue(totalReach), 
      reactions: reactions.toLocaleString(), 
      err: err + '%' 
    };
  };

  const totals = calculateTotals();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Аналитика</h1>
          <p className="text-slate-500 mt-1">Обзор эффективности вашего контента</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {[
              { id: 'week', label: 'Неделя' },
              { id: 'month', label: 'Месяц' },
              { id: 'quarter', label: 'Квартал' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="all">Все категории</option>
              <option value="news">Новости</option>
              <option value="educational">Обучающие</option>
              <option value="entertainment">Развлекательные</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={18} />
              Excel
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-md"
            >
              <Download size={18} />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Просмотры', value: totals.views, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Охват', value: totals.reach, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Реакции', value: totals.reactions, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'ERR', value: totals.err, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Динамика охватов и просмотров</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.groupStats}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  labelFormatter={formatChartDate}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="reach" name="Охват" stroke="#6366f1" fillOpacity={1} fill="url(#colorReach)" strokeWidth={3} />
                <Area type="monotone" dataKey="views" name="Просмотры" stroke="#3b82f6" fillOpacity={0} strokeWidth={3} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Новые подписчики</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.groupStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatChartDate}
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  labelFormatter={formatChartDate}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="newSubscribers" name="Подписчики" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Сравнение площадок</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium text-slate-700">ВКонтакте</span>
              </div>
              <span className="text-slate-500">65% эффективности</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                <span className="font-medium text-slate-700">Telegram</span>
              </div>
              <span className="text-slate-500">35% эффективности</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-sky-400 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">ВК лидирует</div>
              <p className="text-slate-500 text-sm mt-1">По охвату и вовлеченности за этот период</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Список постов и метрики</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Пост</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Дата</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Просмотры</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Лайки</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Комменты</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Репосты</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-800 line-clamp-1 max-w-xs">
                      {post.text || 'Без текста'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(post.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                      <Eye size={14} className="text-slate-400" />
                      {post.views}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                      <Heart size={14} className="text-rose-400" />
                      {post.likes}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                      <MessageSquare size={14} className="text-blue-400" />
                      {post.comments}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                      <Repeat size={14} className="text-emerald-400" />
                      {post.reposts}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;