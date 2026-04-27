import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Share2, 
  Trash2, 
  RefreshCw,
  X
} from 'lucide-react';
import axios from 'axios';

const ChannelsPage = () => {
  const [channels, setChannels] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({ externalId: '', name: '', platform: 'vk' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/channels');
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:4000/api/channels', newChannel);
      setIsAddModalOpen(false);
      setNewChannel({ externalId: '', name: '', platform: 'vk' });
      fetchChannels();
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при добавлении');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChannel = async (id) => {
    if (window.confirm('Вы уверены, что хотите отключить этот канал?')) {
      try {
        await axios.delete(`http://localhost:4000/api/channels/${id}`);
        fetchChannels();
      } catch (error) {
        console.error('Error deleting channel:', error);
      }
    }
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
                  channel.platform === 'telegram' ? 'bg-sky-50 text-sky-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {channel.platform === 'telegram' ? <MessageSquare size={24} /> : <Share2 size={24} />}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    channel.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {channel.isActive ? 'Активен' : 'Отключен'}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{channel.name}</h3>
              <p className="text-slate-400 text-xs flex items-center gap-1 mb-4">
                {channel.platform === 'telegram' ? 'Telegram Channel' : 'VK Community'} • ID: {channel.externalId}
              </p>
            </div>

            <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
              <div className="flex items-center gap-1">
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Подключить канал</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddChannel} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Платформа</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2"
                  value={newChannel.platform}
                  onChange={(e) => setNewChannel({...newChannel, platform: e.target.value})}
                >
                  <option value="vk">ВКонтакте</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ID Сообщества / Канала</label>
                <input 
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2"
                  placeholder="Например: 238076289"
                  value={newChannel.externalId}
                  onChange={(e) => setNewChannel({...newChannel, externalId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название (для себя)</label>
                <input 
                  type="text"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2"
                  placeholder="Например: Моя группа ВК"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Добавление...' : 'Добавить'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsPage;