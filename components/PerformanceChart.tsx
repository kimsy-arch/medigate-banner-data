
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AdPerformanceData } from '../types';

interface PerformanceChartProps {
  data: AdPerformanceData[];
}

type Metric = 'avgImpressions1M' | 'cpc' | 'cpm' | 'ctr';

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    
    const formatValue = (v: number) => {
      if (metric === 'ctr') return `${v.toFixed(2)}%`;
      return `₩${v.toLocaleString()}`;
    };

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-[1.25rem] shadow-2xl border border-slate-100 ring-1 ring-black/5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${data.platform === 'PC' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{data.platform}</p>
        </div>
        <p className="text-[11px] font-black text-slate-900 mb-0.5">{label}</p>
        <p className="text-lg font-black text-blue-600 tracking-tight">
          {formatValue(value)}
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<Metric>('avgImpressions1M');

  const chartData = data.map(d => ({
    name: d.location,
    value: d[metric],
    platform: d.platform
  })).sort((a, b) => b.value - a.value);

  const getMetricLabel = () => {
    switch(metric) {
      case 'avgImpressions1M': return '노출량';
      case 'cpc': return 'CPC';
      case 'cpm': return 'CPM';
      case 'ctr': return 'CTR';
    }
  };

  const formatXAxis = (val: number) => {
    if (metric === 'ctr') return `${val}%`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val.toString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">성과분석</h3>
            <p className="text-[8px] text-slate-400 font-black mt-1.5 uppercase tracking-[0.2em]">{getMetricLabel()} Ranking</p>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-100 no-print">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded shadow-sm">
              <div className="w-1 h-1 rounded-full bg-blue-500"></div>
              <span className="text-[7px] font-black text-slate-500">PC</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded shadow-sm">
              <div className="w-1 h-1 rounded-full bg-orange-500"></div>
              <span className="text-[7px] font-black text-slate-500">MO</span>
            </div>
          </div>
        </div>
        
        <div className="relative no-print">
          <select 
            value={metric} 
            onChange={(e) => setMetric(e.target.value as Metric)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-[11px] font-black text-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
          >
            <option value="avgImpressions1M">📊 전체 노출 분석</option>
            <option value="cpc">💰 CPC 단가 분석</option>
            <option value="cpm">📈 CPM 단가 분석</option>
            <option value="ctr">🎯 CTR 효율 분석</option>
          </select>
        </div>
      </div>
      
      {/* 
        ResponsiveContainer는 부모의 높이가 명확하지 않으면 0으로 렌더링될 수 있음.
        따라서 h-[400px]와 같은 고정 높이를 주어 가시성을 확보함.
      */}
      <div className="w-full h-[400px] min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical"
            data={chartData} 
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="pcGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="moGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis 
              type="number"
              tickFormatter={formatXAxis} 
              tick={{fontSize: 8, fill: '#cbd5e1', fontWeight: 800}} 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              width={80}
              tick={{fontSize: 9, fill: '#475569', fontWeight: 800}} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{fill: '#f8fafc', radius: 8}}
              content={<CustomTooltip metric={metric} />}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              barSize={16}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.platform === 'PC' ? 'url(#pcGradient)' : 'url(#moGradient)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
