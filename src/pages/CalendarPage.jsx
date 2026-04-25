import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  User,
  LayoutGrid,
  List
} from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const [events] = useState([
    { id: 1, title: 'Стратегия продвижения ВК', time: '10:00', date: '2026-04-25', status: 'pending', author: 'Алексей В.', category: 'SMM' },
    { id: 2, title: 'Фотоотчет: День открытых дверей', time: '14:30', date: '2026-04-26', status: 'approved', author: 'Анна К.', category: 'Media' },
    { id: 3, title: 'Интервью с ректором', time: '12:00', date: '2026-04-25', status: 'approved', author: 'Игорь С.', category: 'Content' },
  ]);

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

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
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setView('month')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'month' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Месяц</button>
              <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Список</button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Filter size={20} />
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 font-medium text-sm">
              <Plus size={18} />
              Создать пост
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Статистика недели</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Запланировано</span>
                <span className="font-semibold text-indigo-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">На модерации</span>
                <span className="font-semibold text-amber-500">5</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[65%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Совет дня</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">Лучшее время для публикации сегодня — 18:30. Охват может быть выше на 15%.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-800 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Main Calendar Area */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                <div key={day} className="py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[140px]">
              {/* Empty cells for previous month */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-r border-b border-slate-50 bg-slate-50/30"></div>
              ))}
              
              {/* Days */}
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const hasEvents = day === 25 || day === 26;
                return (
                  <div key={day} className="border-r border-b border-slate-100 p-3 hover:bg-indigo-50/20 transition-all cursor-pointer group">
                    <span className={`text-sm font-semibold ${day === 25 ? 'text-indigo-600 bg-indigo-50 w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    <div className="mt-2 space-y-2">
                      {day === 25 && (
                        <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg shadow-sm">
                          <div className="text-[10px] font-bold text-indigo-600 uppercase">10:00</div>
                          <div className="text-[11px] font-medium text-slate-700 truncate">SMM Стратегия</div>
                        </div>
                      )}
                      {day === 26 && (
                        <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg shadow-sm">
                          <div className="text-[10px] font-bold text-emerald-600 uppercase">14:30</div>
                          <div className="text-[11px] font-medium text-slate-700 truncate">Фотоотчет</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Moderation Queue */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Очередь модерации
                <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">2 новых</span>
              </h3>
              <button className="text-sm text-indigo-600 font-medium hover:underline">Смотреть все</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(e => e.status === 'pending').map(event => (
                <div key={event.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{event.author}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {event.date}, {event.time}
                        </div>
                      </div>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 font-medium leading-relaxed">
                    {event.title}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Одобрить
                    </button>
                    <button className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                      <XCircle size={16} /> Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
