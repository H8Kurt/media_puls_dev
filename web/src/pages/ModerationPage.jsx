import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Eye
} from 'lucide-react';

import CreatePostModal from '../components/CreatePostModal';

const MODERATION_POSTS = [
  { id: 101, title: 'Репортаж с открытия коворкинга', author: 'Иван Иванов', category: 'news', publish_date: '2026-04-27', publish_time: '14:00', status: 'pending', content: 'Текст поста от волонтера...' },
  { id: 102, title: 'Интервью с победителем гранта', author: 'Анна Сидорова', category: 'grant', publish_date: '2026-04-27', publish_time: '16:30', status: 'pending', content: 'Текст поста от волонтера...' },
  { id: 103, title: 'Подборка книг на выходные', author: 'Петр Петров', category: 'event', publish_date: '2026-04-28', publish_time: '10:00', status: 'pending', content: 'Текст поста от волонтера...' },
  { id: 104, title: 'Анонс волонтерского сбора', author: 'Мария Лукьянова', category: 'event', publish_date: '2026-04-26', publish_time: '09:00', status: 'pending', content: 'Текст поста от волонтера...' }
];

const CATEGORY_LABELS = {
  event: 'Мероприятие',
  news: 'Новости',
  vacancy: 'Вакансия',
  grant: 'Грант'
};

const ModerationPage = () => {
  const [view, setView] = useState('calendar'); // calendar, list
  const [posts, setPosts] = useState(MODERATION_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 26));
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      
      const postDate = new Date(p.publish_date);
      const matchesStartDate = !startDate || postDate >= new Date(startDate);
      const matchesEndDate = !endDate || postDate <= new Date(endDate);

      return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
    }).sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
  }, [posts, searchQuery, categoryFilter, startDate, endDate]);

  const handleAction = (id, newStatus) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    alert(newStatus === 'approved' ? 'Пост одобрен и перенесен в контент-план' : 'Пост отклонен');
  };

  // Календарная сетка (упрощенная для модерации)
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    for (let i = 0; i < offset; i++) days.push({ day: null });
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}` 
      });
    }
    return days;
  }, [currentDate]);


  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleSaveModerated = (updatedPost) => {
    // Удаляем из списка модерации
    setPosts(prev => prev.filter(p => p.id !== selectedPost.id));
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Модерация публикаций</h1>
          <p className="text-slate-500 text-sm mt-1">Проверка постов от волонтеров и авторов</p>
        </div>
        
        <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'calendar' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <LayoutGrid size={18} />
            <span className="text-sm font-medium">Календарь</span>
          </button>
          <button onClick={() => setView('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <List size={18} />
            <span className="text-sm font-medium">Список</span>
          </button>
        </div>
      </div>

      {/* Фильтры (только для списка) */}
      {view === 'list' && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по заголовку или автору..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">От:</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">До:</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white"
            />
          </div>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white"
          >
            <option value="all">Все категории</option>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {view === 'calendar' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors"><ChevronLeft size={18} /></button>
              <h2 className="font-bold text-slate-700 min-w-[140px] text-center">
                {currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors"><ChevronRight size={18} /></button>
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">Режим модерации</div>
          </div>
          <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">{d}</div>
            ))}
            {calendarDays.map((cell, idx) => {
              const dayPosts = posts.filter(p => p.publish_date === cell.dateString);
              return (
                <div key={idx} className={`border-r border-b border-slate-100 p-2 min-h-[120px] ${!cell.day ? 'bg-slate-50/30' : ''}`}>
                  {cell.day && <span className="text-xs font-bold text-slate-400 mb-2 block">{cell.day}</span>}
                  <div className="space-y-1">
                    {dayPosts.map(post => (
                      <div key={post.id} className="bg-amber-50 border border-amber-100 p-2 rounded-lg shadow-sm group relative">
                        <div className="text-[10px] font-bold text-amber-600 mb-1 flex items-center justify-between">
                          {post.publish_time}
                          <div className="hidden group-hover:flex items-center gap-1">
                            <button onClick={() => handleEdit(post)} className="p-0.5 bg-indigo-500 text-white rounded hover:bg-indigo-600"><Eye size={10} /></button>
                            <button onClick={() => handleAction(post.id, 'approved')} className="p-0.5 bg-emerald-500 text-white rounded hover:bg-emerald-600"><CheckCircle2 size={10} /></button>
                            <button onClick={() => handleAction(post.id, 'rejected')} className="p-0.5 bg-rose-500 text-white rounded hover:bg-rose-600"><XCircle size={10} /></button>
                          </div>
                        </div>
                        <div onClick={() => handleEdit(post)} className="cursor-pointer">
                          <div className="text-[11px] font-bold text-slate-700 leading-tight line-clamp-2">{post.title}</div>
                          <div className="text-[9px] text-slate-400 mt-1 truncate flex items-center gap-1">
                            <User size={8} /> {post.author}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Дата</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Автор</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Заголовок</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Категория</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{post.publish_date}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1"><Clock size={12} /> {post.publish_time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {post.author[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-600">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{post.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 uppercase">
                      {CATEGORY_LABELS[post.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(post)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Модерация"><Eye size={18} /></button>
                      <button onClick={() => handleAction(post.id, 'approved')} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Одобрить"><CheckCircle2 size={18} /></button>
                      <button onClick={() => handleAction(post.id, 'rejected')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Отклонить"><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <div className="p-12 text-center text-slate-400">Посты для модерации не найдены</div>
          )}
        </div>
      )}

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }} 
        onSave={handleSaveModerated}
        initialData={selectedPost}
      />
    </div>
  );
};

export default ModerationPage;
