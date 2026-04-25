import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ReachChart from '../components/ReachChart';

const DashboardPage = () => {
  const stats = [
    { title: 'Всего постов', value: '128', trend: '12%', trendType: 'positive' },
    { title: 'Средний охват', value: '4.2k', trend: '8%', trendType: 'positive' },
    { title: 'ERR (Вовлеченность)', value: '5.4%', trend: '0.2%', trendType: 'negative' },
  ];

  const topPosts = [
    { id: 1, title: 'Тренды SMM 2024', metrics: 'ERR: 8.2% • 1.2k охват', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=100&q=80' },
    { id: 2, title: 'Как писать тексты', metrics: 'ERR: 7.5% • 950 охват', img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=100&q=80' },
    { id: 3, title: 'Обзор нейросетей', metrics: 'ERR: 6.9% • 1.1k охват', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=100&q=80' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Обзор статистики</h1>
            <p className="text-sm text-slate-500">Добро пожаловать назад, Александр</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition shadow-sm">
              Экспорт PDF
            </button>
            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
              АД
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold">Динамика охватов</h3>
                <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 font-medium text-slate-600 focus:ring-0 cursor-pointer">
                  <option>За 7 дней</option>
                  <option>За 30 дней</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ReachChart />
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-6">Топ-3 поста</h3>
              <div className="space-y-5">
                {topPosts.map((post) => (
                  <div key={post.id} className="group flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-2xl transition duration-300">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={post.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{post.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{post.metrics}</p>
                    </div>
                    <div className="text-indigo-600 font-black text-lg opacity-20 group-hover:opacity-100 transition">#{post.id}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
                Вся аналитика
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">Ближайшие публикации</h3>
                <p className="text-sm text-slate-500">Контент-план на ближайшие дни</p>
              </div>
              <button className="px-5 py-2.5 text-indigo-600 text-sm font-bold bg-indigo-50 rounded-xl hover:bg-indigo-100 transition">
                Календарь →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-50">
                    <th className="pb-4 font-bold">Дата и время</th>
                    <th className="pb-4 font-bold">Канал</th>
                    <th className="pb-4 font-bold">Контент</th>
                    <th className="pb-4 font-bold">Статус</th>
                    <th className="pb-4 font-bold text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="group border-b border-slate-50 last:border-0">
                    <td className="py-5 font-medium text-slate-700">Завтра, 10:00</td>
                    <td className="py-5">
                      <span className="flex items-center gap-2 text-slate-600">
                        <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                        Telegram
                      </span>
                    </td>
                    <td className="py-5 text-slate-600 font-medium">Анонс мероприятия...</td>
                    <td className="py-5">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                        Ожидает
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition font-bold text-xs">ИЗМЕНИТЬ</button>
                    </td>
                  </tr>
                  <tr className="group border-b border-slate-50 last:border-0">
                    <td className="py-5 font-medium text-slate-700">28 Апр, 14:30</td>
                    <td className="py-5">
                      <span className="flex items-center gap-2 text-slate-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        ВКонтакте
                      </span>
                    </td>
                    <td className="py-5 text-slate-600 font-medium">Интервью с экспертом</td>
                    <td className="py-5">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        Запланирован
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition font-bold text-xs">ИЗМЕНИТЬ</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
