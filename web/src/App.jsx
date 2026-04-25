import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ChannelsPage from './pages/ChannelsPage';
import CalendarPage from './pages/CalendarPage';
import PostsListPage from './pages/PostsListPage';
import Analytics from './pages/Analytics';
import ModerationPage from './pages/ModerationPage';

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
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="content" element={<PostsListPage />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="community" element={<ChannelsPage />} />
          <Route path="moderation" element={<ModerationPage />} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Настройки</div>} />
        </Route>


        {/* Редирект по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
