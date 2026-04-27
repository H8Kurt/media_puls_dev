import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  LayoutGrid,
  Columns,
  Rows,
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileEdit
} from 'lucide-react';
import api from '../api/axios';
import CreatePostModal from '../components/CreatePostModal';

const STATUS_CONFIG = {
  draft: { color: 'bg-slate-500', icon: FileEdit, label: 'Черновик', text: 'text-slate-600', bg: 'bg-slate-50' },
  pending: { color: 'bg-indigo-500', icon: Clock3, label: 'На модерации', text: 'text-indigo-600', bg: 'bg-indigo-50' },
  scheduled: { color: 'bg-amber-500', icon: Clock3, label: 'Запланирован', text: 'text-amber-600', bg: 'bg-amber-50' },
  published: { color: 'bg-emerald-500', icon: CheckCircle2, label: 'Опубликован', text: 'text-emerald-600', bg: 'bg-emerald-50' },
  error: { color: 'bg-rose-500', icon: AlertCircle, label: 'Ошибка', text: 'text-rose-600', bg: 'bg-rose-50' }
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSavePost = async (postData) => {
    try {
      if (selectedPost) {
        const realId = String(selectedPost.id).replace('pend_', '');
        await api.patch(`/posts/${realId}/status`, postData);
      } else {
        await api.post('/posts', postData);
      }
      fetchPosts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка при сохранении поста:', error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    for (let i = 0; i < offset; i++) {
      days.push({ day: null, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        currentMonth: true, 
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    return days;
  }, [currentDate]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(currentDate.getMonth() - 1);
    else if (view === 'week') newDate.setDate(currentDate.getDate() - 7);
    else newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') newDate.setMonth(currentDate.getMonth() + 1);
    else if (view === 'week') newDate.setDate(currentDate.getDate() + 7);
    else newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const onDragStart = (e, postId) => {
    e.dataTransfer.setData('postId', postId);
  };

  const onDrop = async (e, dateString) => {
    const postIdStr = e.dataTransfer.getData('postId');
    const post = posts.find(p => p.id === postIdStr);

    if (post && post.status !== 'published') {
      try {
        // Убираем префикс pend_ для запроса к БД
        const realId = postIdStr.replace('pend_', '');
        await api.patch(`/posts/${realId}/status`, { 
          scheduledAt: `${dateString}T${post.publish_time || '12:00'}:00` 
        });
        fetchPosts();
      } catch (error) {
        console.error('Ошибка при перемещении поста:', error);
      }
    }
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Календарь контента</h1>
          <p className="text-slate-500 text-sm mt-1">Управление графиком публикаций и статусами</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            <button onClick={() => setView('month')} className={`p-2 rounded-lg transition-all ${view === 'month' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Месяц"><LayoutGrid size={20} /></button>
            <button onClick={() => setView('week')} className={`p-2 rounded-lg transition-all ${view === 'week' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Неделя"><Columns size={20} /></button>
            <button onClick={() => setView('day')} className={`p-2 rounded-lg transition-all ${view === 'day' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="День"><Rows size={20} /></button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors bg-white"><ChevronLeft size={18} /></button>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 min-w-[160px] text-center shadow-sm">
              {view === 'month' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : currentDate.toLocaleDateString('ru-RU')}
            </div>
            <button onClick={handleNext} className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors bg-white"><ChevronRight size={18} /></button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 font-medium text-sm ml-2"
          >
            <Plus size={18} /> Создать пост
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-6 px-2">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.color}`}></div>
            {cfg.label}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {view === 'month' ? (
          <>
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {daysOfWeek.map(day => (
                <div key={day} className="py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)]">
              {calendarDays.map((cell, idx) => {
                const dayPosts = posts.filter(p => p.publish_date === cell.dateString);
                return (
                  <div 
                    key={idx} 
                    onDragOver={allowDrop}
                    onDrop={(e) => cell.dateString && onDrop(e, cell.dateString)}
                    className={`border-r border-b border-slate-100 p-2 transition-all min-h-[140px] ${!cell.day ? 'bg-slate-50/30' : 'hover:bg-indigo-50/10'}`}
                  >
                    {cell.day && (
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold ${cell.dateString === '2026-04-25' ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md shadow-indigo-100' : 'text-slate-400'}`}>
                          {cell.day}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      {dayPosts.map(post => {
                        const cfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
                        const StatusIcon = cfg.icon;
                        return (
                          <div 
                            key={post.id}
                            draggable={post.status !== 'published'}
                            onDragStart={(e) => post.status !== 'published' && onDragStart(e, post.id)}
                            onClick={() => handlePostClick(post)}
                            className={`${cfg.bg} border border-transparent ${post.status !== 'published' ? 'hover:border-indigo-200 cursor-grab active:cursor-grabbing' : 'opacity-80 cursor-pointer'} p-2 rounded-lg group transition-all shadow-sm hover:shadow-md`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${cfg.color}`}></div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{post.publish_time}</span>
                              {post.status === 'published' && (
                                <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">FIXED</span>
                              )}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 leading-tight line-clamp-2 group-hover:text-indigo-700">{post.title}</div>
                            {post.mediaUrl && (
                              <div className="mt-2 rounded-md overflow-hidden h-20 w-full bg-slate-100">
                                <img 
                                  src={post.mediaUrl.startsWith('http') ? post.mediaUrl : `http://localhost:4000${post.mediaUrl}`} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{post.channel}</span>
                              <StatusIcon size={12} className={cfg.text} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-20 text-center text-slate-400">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>Режим "{view === 'week' ? 'Неделя' : 'День'}" находится в разработке.</p>
            <button onClick={() => setView('month')} className="mt-4 text-indigo-600 font-medium hover:underline">Вернуться к месяцу</button>
          </div>
        )}
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }} 
        onSave={handleSavePost}
        initialData={selectedPost}
      />
    </div>
  );
};

export default CalendarPage;
