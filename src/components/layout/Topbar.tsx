const Topbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <div>
        <p className="text-sm text-slate-400">Accountants workspace</p>
        <h1 className="text-xl font-semibold text-white">Inbox Overview</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200">
          Generate summary
        </button>
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-sm text-slate-200">Lena Ortiz</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
