import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Filter,
  User,
  MessageSquare,
  Share2,
  ExternalLink,
  Search,
  ChevronRight
} from 'lucide-react';

const PostsListPage = () => {
  const [posts] = useState([
    { 
      id: 1, 
      title: 'Стратегия продвижения ВК на май 2026', 
      date: '2026-04-25', 
      time: '10:00',
      category: 'SMM', 
      channel: 'ВКонтакте',
      channelType: 'vk',
      status: 'approved',
      author: 'Алексей В.'
    },
    { 
      id: 2, 
      title: 'Обзор новых функций нейросетей для контента', 
      date: '2026-04-26', 
      time: '14:30',
      category: 'Media', 
      channel: 'Telegram: Media Pulse',
      channelType: 'tg',
      status: 'pending',
      author: 'Анна К.'
    },
    { 
      id: 3, 
      title: 'Интервью с ректором: итоги года', 
      date: '2026-04-25', 
      time: '12:00',
      category: 'Content', 
      channel: 'Telegram: Official',
      channelType: 'tg',
      status: 'approved',
      author: 'Игорь С.'
    },
    { 
      id: 4, 
      title: 'Анонс вебинара по дизайну', 
      date: '2026-04-27', 
      time: '09:00',
      category: 'Design', 
      channel: 'ВКонтакте: Дизайн-клуб',
      channelType: 'vk',
      status: 'pending',
      author: 'Мария Л.'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <CalendarIcon className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Медиа<span className="text-indigo-600">Пульс</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Поиск постов..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-xl text-sm transition-all w-64"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 font-medium text-sm">
              <Plus size={18} />
              Создать пост
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Список публикаций</h1>
            <p className="text-slate-500 text-sm mt-1">Управление контентом во всех каналах</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">Все</button>
            <button className="px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-lg">Активные</button>
            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">Архив</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Дата и время</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Заголовок</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Категория</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Канал</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Статус</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{post.date}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {post.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {post.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <User size={10} /> {post.author}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          post.channelType === 'tg' ? 'bg-sky-50 text-sky-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {post.channelType === 'tg' ? <MessageSquare size={16} /> : <Share2 size={16} />}
                        </div>
                        <span className="text-sm text-slate-600 font-medium">{post.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        post.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {post.status === 'approved' ? 'Одобрено' : 'Ожидает'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <span className="text-sm text-slate-500">Показано {posts.length} из {posts.length} записей</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm font-medium text-slate-400 cursor-not-allowed">Назад</button>
              <button className="px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">Вперед</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostsListPage;
