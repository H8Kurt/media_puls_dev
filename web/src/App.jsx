import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';

// Заглушки для страниц, которыми занимается другой разработчик
const Landing = () => <div className="p-8">Страница Лендинга (в разработке)</div>;
const Login = () => <div className="p-8">Страница Входа (в разработке)</div>;
const Register = () => <div className="p-8">Страница Регистрации (в разработке)</div>;

// Заглушки для подразделов дашборда
const ContentPlan = () => <div className="p-8 text-2xl font-bold">Контент-план (в разработке)</div>;
const Analytics = () => <div className="p-8 text-2xl font-bold">Аналитика (в разработке)</div>;
const Community = () => <div className="p-8 text-2xl font-bold">Сообщества (в разработке)</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Внутренние маршруты Дашборда */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<ContentPlan />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Настройки</div>} />
        </Route>

        {/* Редирект по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
