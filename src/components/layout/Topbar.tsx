type TopbarProps = {
  title?: string;
};

const Topbar = ({ title }: TopbarProps) => {
  return (
    <header className="topbar-surface flex items-center justify-between border-b px-8 py-4">
      <div className="theme-text-primary text-lg font-semibold">{title}</div>
      <div className="flex items-center gap-3" />
    </header>
  );
};

export default Topbar;
