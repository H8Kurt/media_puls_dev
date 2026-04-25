import React, { useState, useEffect } from 'react';
import { X, Image, Video, Calendar, Clock, Send, Save, FileText, Check, Plus, User } from 'lucide-react';

const TEMPLATES = {
  event: {
    title: 'Анонс мероприятия',
    content: '🔥 Приглашаем вас на [Название мероприятия]!\n\n📍 Где: [Место]\n📅 Когда: [Дата и время]\n\nВ программе:\n— \n— \n\nРегистрация по ссылке: [Ссылка]'
  },
  results: {
    title: 'Итоги события',
    content: '✨ Как это было: итоги [Название события]\n\nВчера мы провели незабываемое время! \n\nКоротко в цифрах:\n— [Количество] участников\n— [Количество] спикеров\n\nСпасибо всем, кто был с нами! Ищите себя на фото 👇'
  },
  vacancy: {
    title: 'Вакансия',
    content: '💼 Ищем в команду [Название должности]!\n\nМы предлагаем:\n— \n— \n\nЧто нужно делать:\n— \n— \n\nЖдем ваше резюме в ЛС или на почту: [Email]'
  },
  grant: {
    title: 'Грант',
    content: '💰 Открыт прием заявок на грант [Название]!\n\nКто может участвовать:\n— \n— \n\nСумма поддержки: до [Сумма] руб.\n\nУспей подать заявку до [Дата]!'
  }
};

const CHANNELS = [
  { id: 'telegram', name: 'Telegram', icon: 'TG' },
  { id: 'vk', name: 'ВКонтакте', icon: 'VK' }
];

const CreatePostModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const isViewOnly = initialData?.status === 'published';
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'event',
    channels: [],
    publishDate: '',
    publishTime: '',
    status: 'draft',
    media: [],
    author: ''
  });

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        publishDate: initialData.publish_date || '',
        publishTime: initialData.publish_time || '',
        channels: initialData.channels || []
      });
      // Если есть медиа в initialData, здесь можно было бы настроить превью
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'event',
        channels: [],
        publishDate: '',
        publishTime: '',
        status: 'draft',
        media: [],
        author: ''
      });
      setPreviews([]);
    }
  }, [initialData, isOpen]);

  const handleTemplateSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      category: type,
      content: TEMPLATES[type].content
    }));
  };

  const handleChannelToggle = (channelId) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(id => id !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, media: [...prev.media, ...files] }));
  };

  const handleSubmit = (status) => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const postData = {
      ...formData,
      id: Date.now(),
      status: status || formData.status,
      publish_date: formData.publishDate || currentDate,
      publish_time: formData.publishTime || currentTime,
    };

    // Сохранение в LocalStorage
    const existingPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    localStorage.setItem('user_posts', JSON.stringify([...existingPosts, postData]));
    
    if (onSave) onSave(postData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {isViewOnly ? 'Просмотр публикации' : initialData ? 'Редактирование публикации' : 'Создание публикации'}
          </h2>
          <div className="flex items-center gap-4">
            {isViewOnly && (
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-1">
                <Check size={14} /> Опубликовано
              </div>
            )}
            {formData.author && (
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                <User size={14} />
                Автор: {formData.author}
              </div>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Название поста</label>
                <input
                  type="text"
                  disabled={isViewOnly}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введите заголовок..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Содержание</label>
                <textarea
                  rows="8"
                  disabled={isViewOnly}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="О чем будет пост?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none resize-none disabled:opacity-70"
                ></textarea>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Медиафайлы</label>
                <div className="flex flex-wrap gap-3">
                  {previews.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                      <img src={url} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all text-slate-400 hover:text-indigo-600">
                    <Plus size={24} />
                    <span className="text-[10px] mt-1 font-medium">Добавить</span>
                    <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className="space-y-6">
              {/* Templates */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-indigo-500" /> Шаблоны
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(TEMPLATES).map(([key, t]) => (
                    <button
                      key={key}
                      disabled={isViewOnly}
                      onClick={() => handleTemplateSelect(key)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        formData.category === key 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                      } disabled:opacity-50`}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Площадки для публикации</label>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map(ch => (
                    <button
                      key={ch.id}
                      disabled={isViewOnly}
                      onClick={() => handleChannelToggle(ch.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        formData.channels.includes(ch.id)
                        ? 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      } disabled:opacity-50`}
                    >
                      {formData.channels.includes(ch.id) && <Check size={14} />}
                      {ch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" /> Планирование
                </label>
                <div className="space-y-3">
                  <input
                    type="date"
                    disabled={isViewOnly}
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 disabled:opacity-70"
                  />
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <input
                      type="time"
                      disabled={isViewOnly}
                      value={formData.publishTime}
                      onChange={(e) => setFormData({ ...formData, publishTime: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 disabled:opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {!isViewOnly ? (
            <>
              <button
                onClick={() => handleSubmit('draft')}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-800 font-semibold transition-colors"
              >
                <Save size={18} />
                В черновики
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleSubmit('scheduled')}
                  disabled={!formData.title || formData.channels.length === 0}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                  <Send size={18} />
                  {initialData ? 'Сохранить' : 'Опубликовать'}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all"
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
