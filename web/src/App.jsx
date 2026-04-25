import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ChannelsPage from './pages/ChannelsPage';
import CalendarPage from './pages/CalendarPage';
import PostsListPage from './pages/PostsListPage';
import Analytics from './pages/Analytics';

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
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="content" element={<PostsListPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="community" element={<ChannelsPage />} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Настройки</div>} />
        </Route>

        {/* Редирект по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
