
import React, { useState, useRef } from 'react';
import { UserInput, LoadingState, Direction } from './types';
import { generateFortune } from './services/geminiService';
import { getZodiac } from './utils';

// Declare html2canvas for TS
declare const html2canvas: any;

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    birthday: '',
    direction: '事业',
  });
  const [loading, setLoading] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.birthday) return;

    setLoading(LoadingState.LOADING);
    setError('');
    setShowResult(false);

    try {
      const fortune = await generateFortune(input);
      setResult(fortune);
      setLoading(LoadingState.SUCCESS);
      setTimeout(() => setShowResult(true), 100);
    } catch (err: any) {
      setError(err.message || '由于天象变幻，测算暂时中断。');
      setLoading(LoadingState.ERROR);
    }
  };

  const handleDownload = async () => {
    if (!scrollRef.current) return;
    
    try {
      const canvas = await html2canvas(scrollRef.current, {
        backgroundColor: '#f2e6d5',
        scale: 2, // Higher quality
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `天机阁-2026丙午流年-${getZodiac(new Date(input.birthday).getFullYear())}属相.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('保存失败，请尝试截图保存。');
    }
  };

  const directions: Direction[] = ['事业', '感情', '财运'];

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-silk">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-900/10 rounded-full blur-3xl"></div>
        <div className="cloud-bg absolute top-20 right-20 text-64 opacity-5 pointer-events-none font-calligraphy text-8xl">
          丙午
        </div>
      </div>

      <main className="w-full max-w-lg z-10">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-calligraphy golden-gradient mb-2 tracking-widest">天机阁</h1>
          <p className="text-amber-200/60 text-sm tracking-[0.2em] font-light">二零二六 · 丙午流年命理批注</p>
        </header>

        <div className="bg-stone-900/80 border border-amber-900/30 p-8 rounded-sm shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-500/80 text-xs mb-2 tracking-widest uppercase">生辰八字 · 出生日期</label>
              <input
                type="date"
                required
                className="w-full bg-stone-800 border border-amber-900/50 text-amber-100 p-3 rounded-none focus:outline-none focus:border-amber-500 transition-colors"
                value={input.birthday}
                onChange={(e) => setInput({ ...input, birthday: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-amber-500/80 text-xs mb-2 tracking-widest uppercase">所求之事 · 咨询方向</label>
              <div className="grid grid-cols-3 gap-2">
                {directions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setInput({ ...input, direction: d })}
                    className={`py-2 text-sm transition-all duration-300 border ${
                      input.direction === d
                        ? 'bg-amber-900/40 border-amber-500 text-amber-200'
                        : 'bg-stone-800/50 border-amber-900/20 text-stone-500 hover:border-amber-900/50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading === LoadingState.LOADING}
              className="w-full group relative overflow-hidden bg-amber-800 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-none transition-all duration-500 disabled:opacity-50"
            >
              <span className="relative z-10 tracking-[0.5em] font-calligraphy text-xl">
                {loading === LoadingState.LOADING ? '正在推演天机...' : '启扉占卜'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Result Display */}
        {loading === LoadingState.SUCCESS && (
          <div className={`mt-8 transition-all duration-1000 transform ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div ref={scrollRef} className="bg-[#f2e6d5] text-stone-900 p-1 rounded-sm shadow-inner overflow-hidden capture-area">
              <div className="border-4 border-double border-red-900/20 m-1 p-6 relative">
                {/* Scroll Decoration */}
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-stone-400/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-stone-400/20 to-transparent"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-red-900/60 font-bold block mb-1">【命理批注】</span>
                    <h3 className="text-2xl font-calligraphy text-red-900">
                      {getZodiac(new Date(input.birthday).getFullYear())}属相 · 丙午年运势
                    </h3>
                  </div>
                  <div className="bg-red-900 text-white p-2 text-xs writing-mode-vertical tracking-widest font-bold">
                    御笔亲批
                  </div>
                </div>

                <div className="leading-loose text-stone-800 text-lg font-medium whitespace-pre-wrap font-serif border-t border-b border-red-900/10 py-4 mb-4">
                  {result}
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-500 font-light italic">
                    — 天机阁阁主 敬启 —
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={handleDownload}
                className="bg-amber-900/20 hover:bg-amber-900/40 text-amber-500 border border-amber-900/40 py-3 text-sm tracking-widest transition-all uppercase font-medium"
              >
                [ 珍藏天机 ]
              </button>
              <button 
                onClick={() => {
                  setLoading(LoadingState.IDLE);
                  setResult('');
                }}
                className="bg-stone-800/20 hover:bg-stone-800/40 text-stone-400 border border-stone-800/40 py-3 text-sm tracking-widest transition-all uppercase font-medium"
              >
                [ 阖扉再占 ]
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-stone-600 text-[10px] tracking-[0.3em] uppercase z-10 text-center">
        命由天定 · 运由己造 · 诚心则灵
      </footer>
    </div>
  );
};

export default App;
