
export interface AdPerformanceData {
  location: string;
  platform: 'PC' | 'Mobile';
  avgImpressions1M: number;
  avgClicks1M: number;
  ctr: number;
  avgImpressions4W: number;
  avgClicks4W: number;
  cpc: number;
  cpm: number;
}

export interface SummaryStats {
  totalImpressions1M: number;
  avgCtr: number;
  bestCpcLocation: string;
  bestCpmLocation: string;
}
