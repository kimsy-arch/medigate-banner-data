
import React, { useState } from 'react';
import { AdPerformanceData } from '../types';

interface DataEditorProps {
  data: AdPerformanceData[];
  onAdd: (newData: AdPerformanceData) => void;
  onDelete: (index: number) => void;
  onAddBulk: (newDataArray: AdPerformanceData[]) => void;
}

const DataEditor: React.FC<DataEditorProps> = ({ data, onAdd, onDelete, onAddBulk }) => {
  const [pasteMode, setPasteMode] = useState<'manual' | 'bulk'>('manual');
  const [pasteValue, setPasteValue] = useState('');
  const [bulkPlatform, setBulkPlatform] = useState<'PC' | 'Mobile'>('PC');
  
  const [formData, setFormData] = useState({
    location: '',
    platform: 'PC' as 'PC' | 'Mobile',
    avgImpressions1M: 0,
    avgClicks1M: 0,
    avgImpressions4W: 0,
    avgClicks4W: 0,
    cpc: 0,
    cpm: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'location' || name === 'platform') ? value : Number(value.replace(/[^0-9.]/g, ''))
    }));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) return alert('배너 위치를 입력해주세요.');

    const ctr = formData.avgImpressions1M > 0 
      ? (formData.avgClicks1M / formData.avgImpressions1M) * 100 
      : 0;

    onAdd({
      ...formData,
      ctr: parseFloat(ctr.toFixed(2))
    });

    setFormData({
      location: '',
      platform: 'PC',
      avgImpressions1M: 0,
      avgClicks1M: 0,
      avgImpressions4W: 0,
      avgClicks4W: 0,
      cpc: 0,
      cpm: 0
    });
  };

  const handleBulkPaste = () => {
    if (!pasteValue.trim()) return alert('데이터를 입력해주세요.');

    const lines = pasteValue.trim().split('\n');
    const parsedData: AdPerformanceData[] = [];

    lines.forEach((line) => {
      const cols = line.split('\t');
      if (cols.length >= 7) {
        const clean = (val: string) => {
          if (!val || val.includes('#DIV/0!')) return 0;
          return Number(val.replace(/[₩%,]/g, ''));
        };

        const location = cols[0].trim();
        const avgImpressions1M = clean(cols[1]);
        const avgClicks1M = clean(cols[2]);
        let ctr = clean(cols[3]);
        if (avgImpressions1M > 0 && !cols[3]?.includes('%')) {
            ctr = (avgClicks1M / avgImpressions1M) * 100;
        }

        parsedData.push({
          location,
          platform: bulkPlatform,
          avgImpressions1M,
          avgClicks1M,
          ctr: parseFloat(ctr.toFixed(2)),
          avgImpressions4W: clean(cols[4]),
          avgClicks4W: clean(cols[5]),
          cpc: clean(cols[6]),
          cpm: clean(cols[7] || '0')
        });
      }
    });

    if (parsedData.length > 0) {
      onAddBulk(parsedData);
      setPasteValue('');
      alert(`${parsedData.length}개의 데이터가 추가되었습니다.`);
    } else {
      alert('데이터 형식이 올바르지 않습니다. 엑셀에서 행 전체를 복사해서 붙여넣어주세요.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-28">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => setPasteMode('manual')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                pasteMode === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            >
              직접 입력
            </button>
            <button 
              onClick={() => setPasteMode('bulk')}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
                pasteMode === 'bulk' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            >
              엑셀 붙여넣기
            </button>
          </div>

          {pasteMode === 'manual' ? (
            <form onSubmit={handleManualSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">배너 위치 명칭</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="예: 메인 하단" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">플랫폼</label>
                  <select name="platform" value={formData.platform} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-bold text-sm">
                    <option value="PC">PC</option>
                    <option value="Mobile">모바일</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">노출 (1M)</label>
                  <input type="number" name="avgImpressions1M" value={formData.avgImpressions1M} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">클릭 (1M)</label>
                  <input type="number" name="avgClicks1M" value={formData.avgClicks1M} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CPC (₩)</label>
                  <input type="number" name="cpc" value={formData.cpc} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CPM (₩)</label>
                  <input type="number" name="cpm" value={formData.cpm} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white text-xs font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest mt-6">
                ADD NEW ROW
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">TARGET PLATFORM</label>
                <select value={bulkPlatform} onChange={(e) => setBulkPlatform(e.target.value as 'PC' | 'Mobile')} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-bold text-sm">
                  <option value="PC">Save as PC Data</option>
                  <option value="Mobile">Save as Mobile Data</option>
                </select>
              </div>
              <textarea 
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                placeholder="Paste Excel rows here (Location, Imp, Clicks, CTR, 4W Imp, 4W Click, CPC, CPM)..."
                className="w-full h-64 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-mono text-[10px] leading-relaxed"
              />
              <button 
                onClick={handleBulkPaste}
                className="w-full py-4 bg-indigo-600 text-white text-xs font-black rounded-2xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest"
              >
                BULK SYNC DATA
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit transition-all hover:shadow-xl hover:shadow-slate-200/50">
        <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">지면 데이터 목록</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total {data.length} Positions</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-widest text-[9px] font-black">
              <tr>
                <th className="px-10 py-4">지면 위치</th>
                <th className="px-6 py-4 text-center">플랫폼</th>
                <th className="px-6 py-4 text-right">노출 (1M)</th>
                <th className="px-10 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className={`px-10 py-5 font-black text-slate-700 border-l-4 ${item.platform === 'PC' ? 'border-blue-500/20' : 'border-orange-500/20'}`}>
                    {item.location}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.platform === 'PC' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-400">
                    {item.avgImpressions1M.toLocaleString()}
                  </td>
                  <td className="px-10 py-5 text-right">
                    <button onClick={() => onDelete(idx)} className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataEditor;
