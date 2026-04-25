import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  User,
  MessageSquare,
  Share2,
  ExternalLink,
  Search,
  Filter,
  Calendar as CalendarIcon,
  ChevronDown
} from 'lucide-react';
import mockData from '../../../mock_data.json';
import CreatePostModal from '../components/CreatePostModal';

const STATUS_LABELS = {
  draft: 'Черновик',
  scheduled: 'Запланирован',
  published: 'Опубликован',
  error: 'Ошибка'
};

const CATEGORY_LABELS = {
  event: 'Мероприятие',
  news: 'Новости',
  vacancy: 'Вакансия',
  grant: 'Грант',
  results: 'Итоги'
};

const PostsListPage = () => {
  // Состояния фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState([]);


  // Загрузка локальных постов
  useEffect(() => {
    const saved = localStorage.getItem('user_posts');
    if (saved) {
      setLocalPosts(JSON.parse(saved));
    }
  }, []);

  // Подготовка данных
  const allPosts = useMemo(() => {
    const initialPosts = mockData.posts.map(p => ({
      ...p,
      status: 'published' // Все посты из mock_data теперь опубликованы
    }));
    
    // Объединяем моки и локальные посты
    const combined = [...localPosts, ...initialPosts];
    return combined;
  }, [localPosts]);

  // Логика фильтрации
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      
      const postDate = new Date(post.publish_date);
      const matchesStartDate = !startDate || postDate >= new Date(startDate);
      const matchesEndDate = !endDate || postDate <= new Date(endDate);

      return matchesSearch && matchesStatus && matchesCategory && matchesStartDate && matchesEndDate;
    }).sort((a, b) => {
      const dateA = new Date(`${a.publish_date}T${a.publish_time || '00:00'}`);
      const dateB = new Date(`${b.publish_date}T${b.publish_time || '00:00'}`);
      return dateB - dateA;
    });
  }, [allPosts, searchQuery, statusFilter, categoryFilter, startDate, endDate]);

  const handleSavePost = (newPost) => {
    setLocalPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Контент-план</h1>
          <p className="text-slate-500 text-sm mt-1">Список всех публикаций и управление фильтрами</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 font-medium text-sm"
        >
          <Plus size={18} />
          Создать пост
        </button>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePost}
      />

      {/* Блок фильтров */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по названию..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-xl text-sm transition-all"
            />
          </div>

          {/* Статус */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 rounded-xl text-sm appearance-none cursor-pointer"
            >
              <option value="all">Все статусы</option>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          {/* Категория */}
          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 rounded-xl text-sm appearance-none cursor-pointer"
            >
              <option value="all">Все категории</option>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          {/* Период ОТ */}
          <div className="relative">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 rounded-xl text-sm cursor-pointer"
              title="Дата от"
            />
          </div>

          {/* Период ДО */}
          <div className="relative">
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-300 rounded-xl text-sm cursor-pointer"
              title="Дата до"
            />
          </div>
        </div>
      </div>

      {/* Таблица */}
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
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">{post.publish_date}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {post.publish_time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        post.channel === 'telegram' ? 'bg-sky-50 text-sky-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {post.channel === 'telegram' ? <MessageSquare size={16} /> : <Share2 size={16} />}
                      </div>
                      <span className="text-sm text-slate-600 font-medium capitalize">{post.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      post.status === 'published' ? 'bg-emerald-50 text-emerald-600' :
                      post.status === 'scheduled' ? 'bg-amber-50 text-amber-600' :
                      post.status === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {STATUS_LABELS[post.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    Посты не найдены по выбранным фильтрам
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <span className="text-sm text-slate-500">Найдено {filteredPosts.length} записей</span>
        </div>
      </div>
    </div>
  );
};

export default PostsListPage;
