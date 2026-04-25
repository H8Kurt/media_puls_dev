import React from 'react';

const StatCard = ({ title, value, trend, trendType }) => {
  const isPositive = trendType === 'positive';
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className={`text-sm mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {trend} за месяц
      </p>
    </div>
  );
};

export default StatCard;
