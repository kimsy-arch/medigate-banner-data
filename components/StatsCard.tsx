
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
};

export default StatsCard;
