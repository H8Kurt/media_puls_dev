import React, { useState } from 'react';
import CalendarPage from './pages/CalendarPage';
import PostsListPage from './pages/PostsListPage';

function App() {
  const [currentPage, setCurrentPage] = useState('calendar');

  return (
    <div className="App">
      {/* Переключатель страниц */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-2xl shadow-2xl border border-slate-200">
        <button 
          onClick={() => setCurrentPage('calendar')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Календарь
        </button>
        <button 
          onClick={() => setCurrentPage('list')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Список
        </button>
      </div>

      {currentPage === 'calendar' ? <CalendarPage /> : <PostsListPage />}
    </div>
  );
}
export default App;
