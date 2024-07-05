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
          {/*userPubKey ? (
            <div className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
              <p class="mt-2 text-gray-600">
                {user.name
                  ? user.name
                  : userPubKey.substring(0, 6) +
                    "..." +
                    userPubKey.substring(userPubKey.length - 6)}
              </p>
              <a
                className="text-gray-700 hover:text-indigo-700 text-sm font-medium"
                onClick={() => {
                  logOut();
                }}
              >
                Log Out
              </a>
            </div>
          ) : (
            <div className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
              <a
                className="text-gray-700 hover:text-indigo-700 text-sm font-medium"
                href="#"
              >
                Log In
              </a>
              <a
                className="text-gray-800 bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm "
                href="#"
              >
                Sign up
              </a>
            </div>
          )*/}
        </div>
      </div>
    </div>
  );
}
