import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Заглушки для подразделов дашборда
const ContentPlan = () => <div className="p-8 text-2xl font-bold">Контент-план (в разработке)</div>;
const Analytics = () => <div className="p-8 text-2xl font-bold">Аналитика (в разработке)</div>;
const Community = () => <div className="p-8 text-2xl font-bold">Сообщества (в разработке)</div>;

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Внутренние маршруты Дашборда */}
        <Route path="/dashboard" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
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
