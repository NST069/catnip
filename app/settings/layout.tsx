export default function Social({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center flex-shrink-0 h-16 border-b border-slate-800 bg-slate-700 px-4">
        <div>
          <h1 className="text-slate-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-lg font-medium leading-none">
            SETTINGS
          </h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-scroll">{children}</div>
    </div>
  );
}
