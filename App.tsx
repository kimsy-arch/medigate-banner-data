
import React, { useState, useMemo } from 'react';
import { INITIAL_AD_DATA } from './constants';
import { AdPerformanceData } from './types';
import DataTable from './components/DataTable';
import StatsCard from './components/StatsCard';
import PerformanceChart from './components/PerformanceChart';
import DataEditor from './components/DataEditor';

// Icons
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const CursorClickIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>;
const CurrencyWonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

type Platform = 'All' | 'PC' | 'Mobile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'input'>('dashboard');
  const [platformFilter, setPlatformFilter] = useState<Platform>('All');
  const [adData, setAdData] = useState<AdPerformanceData[]>(INITIAL_AD_DATA);

  const processedData = useMemo(() => {
    return adData.filter(d => d.location !== '커뮤니티 B');
  }, [adData]);

  const dashboardData = useMemo(() => {
    if (platformFilter === 'All') return processedData;
    return processedData.filter(d => d.platform === platformFilter);
  }, [processedData, platformFilter]);

  const stats = useMemo(() => {
    const totalImpressions = dashboardData.reduce((acc, curr) => acc + curr.avgImpressions1M, 0);
    const avgCtr = dashboardData.length > 0 ? dashboardData.reduce((acc, curr) => acc + curr.ctr, 0) / dashboardData.length : 0;
    const sortedByCpc = [...dashboardData].filter(d => d.cpc > 0).sort((a, b) => a.cpc - b.cpc);
    const bestCpc = sortedByCpc.length > 0 ? sortedByCpc[0] : { location: '-', cpc: 0 };
    const sortedByImpressions = [...dashboardData].sort((a, b) => b.avgImpressions1M - a.avgImpressions1M);
    const maxImpressions = sortedByImpressions.length > 0 ? sortedByImpressions[0] : { location: '-', avgImpressions1M: 0 };

    return { totalImpressions, avgCtr, bestCpc, maxImpressions };
  }, [dashboardData]);

  const handleAddData = (newData: AdPerformanceData) => {
    setAdData(prev => [newData, ...prev]);
  };

  const handleAddBulkData = (newDataArray: AdPerformanceData[]) => {
    setAdData(prev => [...newDataArray, ...prev]);
  };

  const handleDeleteData = (index: number) => {
    setAdData(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-sm">
              <ChartBarIcon />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">BANNER AD</h1>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1 block">Analytics Platform</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="flex bg-slate-100 p-1.5 rounded-[1.25rem] border border-slate-200/50">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-8 py-2.5 text-xs font-black rounded-2xl transition-all tracking-wider ${
                  activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                DASHBOARD
              </button>
              <button 
                onClick={() => setActiveTab('input')}
                className={`px-8 py-2.5 text-xs font-black rounded-2xl transition-all tracking-wider ${
                  activeTab === 'input' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                DATA MANAGER
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        {activeTab === 'dashboard' ? (
          <div className="space-y-12 tab-content">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex gap-2">
                {(['All', 'PC', 'Mobile'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`px-10 py-3 text-[11px] font-black rounded-2xl transition-all uppercase tracking-[0.2em] ${
                      platformFilter === p ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {p === 'All' ? 'Overall' : p}
                  </button>
                ))}
              </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatsCard title="Total Impressions" value={new Intl.NumberFormat().format(stats.totalImpressions)} description="Monthly Aggregated" icon={<ChartBarIcon />} color="text-blue-600" />
              <StatsCard title="Average CTR" value={`${stats.avgCtr.toFixed(2)}%`} description="Conversion Efficiency" icon={<CursorClickIcon />} color="text-orange-600" />
              <StatsCard title="Best CPC Location" value={stats.bestCpc.location} description={`₩${stats.bestCpc.cpc.toLocaleString()} Avg`} icon={<CurrencyWonIcon />} color="text-emerald-600" />
              <StatsCard title="Peak Exposure" value={stats.maxImpressions.location} description={`${(stats.maxImpressions.avgImpressions1M / 1000000).toFixed(1)}M Imp`} icon={<SparklesIcon />} color="text-purple-600" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
              <section className="lg:col-span-3">
                <DataTable data={dashboardData} />
              </section>
              <section className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col min-h-[550px]">
                <div className="chart-wrapper">
                    <PerformanceChart data={dashboardData} />
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <DataEditor data={processedData} onAdd={handleAddData} onDelete={handleDeleteData} onAddBulk={handleAddBulkData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
