import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Имитация входа
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[30%] h-[30%] rounded-full bg-indigo-100/50 blur-[100px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-100/50 blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">МедиаПульс</span>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">С возвращением</h2>
            <p className="mt-3 text-slate-500 text-sm">
              Нет аккаунта?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email адрес</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Пароль</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Запомнить меня</label>
              </div>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition">Забыли пароль?</a>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              Войти в систему
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">Или войти через</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex justify-center items-center py-3 px-4 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                <span className="text-sm font-bold text-slate-700">Google</span>
              </button>
              <button className="flex justify-center items-center py-3 px-4 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475689/vk-color.svg" alt="VK" />
                <span className="text-sm font-bold text-slate-700">ВКонтакте</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
