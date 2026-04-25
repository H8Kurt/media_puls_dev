import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">МедиаПульс</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Возможности</a>
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition">Войти</Link>
            <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition shadow-md shadow-indigo-100">
              Начать бесплатно
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Платформа №1 для SMM-команд
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.15] mb-6 text-slate-900">
              Управляйте контентом <br />
              <span className="text-indigo-600">умнее и быстрее</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Единая экосистема для аналитики, планирования и автоматизации. Мы помогаем брендам расти, принимая решения на основе точных данных.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100">
                Попробовать сейчас
              </Link>
              <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition">
                Смотреть демо
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-100 rounded-[3rem] rotate-3 opacity-50"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                alt="Analytics Dashboard" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Всё для вашей команды</h2>
            <p className="text-slate-500">Инструменты, которые помогут вам автоматизировать рутину и сфокусироваться на стратегии.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Глубокая аналитика",
                desc: "Отслеживайте ERR, охваты и динамику роста в реальном времени.",
                img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&w=600&q=80",
                color: "bg-blue-600"
              },
              {
                title: "Умный календарь",
                desc: "Планируйте публикации на недели вперед с визуальным редактором.",
                img: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80",
                color: "bg-emerald-600"
              },
              {
                title: "Модерация",
                desc: "Контролируйте качество контента перед публикацией в каналы.",
                img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
                color: "bg-purple-600"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition duration-300">
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={feature.img} 
                    alt={feature.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-indigo-600 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80" alt="bg" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Готовы к росту?</h2>
            <p className="text-indigo-100 mb-10 max-w-lg mx-auto text-lg">Присоединяйтесь к тысячам профессионалов, которые уже используют МедиаПульс.</p>
            <Link to="/register" className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition shadow-lg">
              Начать бесплатно
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-lg font-bold tracking-tight">МедиаПульс</span>
          <p className="text-slate-400 text-sm">© 2024 МедиаПульс. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">Telegram</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition">VK</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
