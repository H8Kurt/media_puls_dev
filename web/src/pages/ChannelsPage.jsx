import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Share2, 
  Settings, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Send,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';

const INITIAL_CHANNELS = [
  { id: 1, name: 'Молодёжь Красноярска', type: 'telegram', members: 12450, status: 'active', last_sync: '2026-04-26 10:00' },
  { id: 2, name: 'Центр «Зеркало»', type: 'vk', members: 8900, status: 'active', last_sync: '2026-04-26 09:30' },
  { id: 3, name: 'Хакатон ПроТехно', type: 'telegram', members: 1200, status: 'error', last_sync: '2026-04-25 18:00' }
];

const ChannelsPage = () => {
  const [channels, setChannels] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testStatus, setTestStatus] = useState({}); // { channelId: 'sending' | 'success' | 'error' }

  useEffect(() => {
    const saved = localStorage.getItem('user_channels');
    if (saved) {
      setChannels(JSON.parse(saved));
    } else {
      setChannels(INITIAL_CHANNELS);
      localStorage.setItem('user_channels', JSON.stringify(INITIAL_CHANNELS));
    }
  }, []);

  const handleAddChannel = (type) => {
    // Имитация OAuth/подключения
    const newChannel = {
      id: Date.now(),
      name: type === 'telegram' ? 'Новый TG Канал' : 'Новое сообщество VK',
      type: type,
      members: 0,
      status: 'active',
      last_sync: new Date().toLocaleString('ru-RU').slice(0, 16)
    };
    
    const updated = [...channels, newChannel];
    setChannels(updated);
    localStorage.setItem('user_channels', JSON.stringify(updated));
    setIsAddModalOpen(false);
  };

  const handleDeleteChannel = (id) => {
    if (window.confirm('Вы уверены, что хотите отключить этот канал?')) {
      const updated = channels.filter(c => c.id !== id);
      setChannels(updated);
      localStorage.setItem('user_channels', JSON.stringify(updated));
    }
  };

  const handleTestSend = (id) => {
    setTestStatus({ ...testStatus, [id]: 'sending' });
    
    // Имитация отправки
    setTimeout(() => {
      setTestStatus({ ...testStatus, [id]: 'success' });
      setTimeout(() => {
        setTestStatus(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Управление каналами</h1>
          <p className="text-slate-500 text-sm mt-1">Подключенные сообщества и проверка доступа</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 font-medium text-sm"
        >
          <Plus size={18} />
          Подключить канал
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map(channel => (
          <div key={channel.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  channel.type === 'telegram' ? 'bg-sky-50 text-sky-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {channel.type === 'telegram' ? <MessageSquare size={24} /> : <Share2 size={24} />}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    channel.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {channel.status === 'active' ? 'Активен' : 'Ошибка'}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{channel.name}</h3>
              <p className="text-slate-400 text-xs flex items-center gap-1 mb-4">
                {channel.type === 'telegram' ? 'Telegram Channel' : 'VK Community'} • {channel.members.toLocaleString()} участников
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1"><RefreshCw size={12} /> Синхронизация:</span>
                  <span className="font-medium">{channel.last_sync}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleTestSend(channel.id)}
                  disabled={testStatus[channel.id] === 'sending'}
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
                    testStatus[channel.id] === 'success' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {testStatus[channel.id] === 'sending' ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : testStatus[channel.id] === 'success' ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Send size={14} />
                  )}
                  {testStatus[channel.id] === 'success' ? 'Отправлено' : 'Тест'}
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteChannel(channel.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Channel */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Подключить канал</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-500 text-sm">Выберите платформу для интеграции. Мы используем официальные API для безопасного доступа.</p>
              
              <button 
                onClick={() => handleAddChannel('telegram')}
                className="w-full flex items-center justify-between p-4 bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm">
                    <MessageSquare size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-800">Telegram</div>
                    <div className="text-xs text-sky-600 font-medium">Через BotFather / Токен</div>
                  </div>
                </div>
                <Plus size={20} className="text-sky-400 group-hover:text-sky-600" />
              </button>

              <button 
                onClick={() => handleAddChannel('vk')}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Share2 size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-800">ВКонтакте</div>
                    <div className="text-xs text-blue-600 font-medium">Через OAuth авторизацию</div>
                  </div>
                </div>
                <Plus size={20} className="text-blue-400 group-hover:text-blue-600" />
              </button>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-[11px] font-medium">
                <ShieldCheck size={16} />
                Ваши данные защищены и не передаются третьим лицам.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsPage;
