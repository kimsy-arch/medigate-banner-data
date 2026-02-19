
import React from 'react';
import { AdPerformanceData } from '../types';

interface DataTableProps {
  data: AdPerformanceData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const formatNum = (num: number) => new Intl.NumberFormat().format(num);
  const formatCurrency = (num: number) => `₩${new Intl.NumberFormat().format(Math.round(num))}`;

  return (
    <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md print:border print:shadow-none">
      <table className="w-full text-[10.5px] text-left border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white print:bg-slate-200 print:text-slate-900">
            <th className="px-3 py-4 font-black text-[8.5px] uppercase tracking-wider first:rounded-tl-[1.5rem] whitespace-nowrap min-w-[100px]">배너 위치</th>
            <th className="px-1 py-4 font-black text-[8.5px] uppercase tracking-wider text-center">플랫폼</th>
            <th className="px-2 py-4 font-black text-[8.5px] uppercase tracking-wider text-right whitespace-nowrap">월간 노출</th>
            <th className="px-2 py-4 font-black text-[8.5px] uppercase tracking-wider text-right whitespace-nowrap">월간 클릭</th>
            <th className="px-2 py-4 font-black text-[8.5px] uppercase tracking-wider text-right bg-slate-800/50 print:bg-slate-100 whitespace-nowrap">4주 노출</th>
            <th className="px-2 py-4 font-black text-[8.5px] uppercase tracking-wider text-right bg-slate-800/50 print:bg-slate-100 whitespace-nowrap">4주 클릭</th>
            <th className="px-1 py-4 font-black text-[8.5px] uppercase tracking-wider text-center">CTR</th>
            <th className="px-2 py-4 font-black text-[8.5px] uppercase tracking-wider text-right whitespace-nowrap">CPC</th>
            <th className="px-3 py-4 font-black text-[8.5px] uppercase tracking-wider text-right last:rounded-tr-[1.5rem] whitespace-nowrap">CPM</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
              <td className={`px-3 py-3 font-extrabold border-l-4 transition-all whitespace-pre-line leading-none ${
                row.platform === 'PC' 
                  ? 'bg-blue-50/10 text-blue-900 border-blue-500/40 print:bg-blue-50/50' 
                  : 'bg-orange-50/10 text-orange-900 border-orange-500/40 print:bg-orange-50/50'
              }`}>
                {row.location.includes(' ') ? row.location.replace(' ', '\n') : row.location}
              </td>
              <td className="px-1 py-3 text-center">
                <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase tracking-tighter inline-block ${
                  row.platform === 'PC' ? 'bg-blue-100 text-blue-600 print:border print:border-blue-200' : 'bg-orange-100 text-orange-600 print:border print:border-orange-200'
                }`}>
                  {row.platform}
                </span>
              </td>
              <td className="px-2 py-3 text-right text-slate-500 font-bold">{formatNum(row.avgImpressions1M)}</td>
              <td className="px-2 py-3 text-right text-slate-500 font-bold">{formatNum(row.avgClicks1M)}</td>
              <td className="px-2 py-3 text-right text-slate-400 font-medium bg-slate-50/20 print:bg-slate-50/50">{formatNum(row.avgImpressions4W)}</td>
              <td className="px-2 py-3 text-right text-slate-400 font-medium bg-slate-50/20 print:bg-slate-50/50">{formatNum(row.avgClicks4W)}</td>
              <td className="px-1 py-3 text-center">
                <span className={`inline-block px-1 py-0.5 rounded-full text-[9px] font-black ${
                  row.ctr > 0.15 ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200' : 'bg-slate-50 text-slate-400'
                }`}>
                  {row.ctr.toFixed(2)}%
                </span>
              </td>
              <td className="px-2 py-3 text-right font-black text-blue-600 tracking-tighter">{formatCurrency(row.cpc)}</td>
              <td className="px-3 py-3 text-right font-black text-indigo-600 tracking-tighter">{formatCurrency(row.cpm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
