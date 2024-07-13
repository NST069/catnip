export default function Nav({}) {
  return (
    <div className="fixed top-0 left-0 w-full z-50 border-slate-700 bg-slate-900 border-b backdrop-blur-lg bg-opacity-80">
      <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 bg-slate-700">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <a className="flex flex-shrink-0 items-center" href="#">
              <img className="block h-12 w-auto" src="/logo_simplified.png" />
              <span className="text-slate-200 inline-flex items-center justify-center px-3 py-2 text-md font-medium">
                CATNIP
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
