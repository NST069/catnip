import ChannelSidebar from "../ui/Chat/channelSidebar";

export default function Channel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center flex-shrink-0 h-16 border-b border-slate-800 bg-slate-700 px-4">
        {/* <div className="flex flex-row justify-between"> */}
        <h1 className="text-slate-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-lg font-medium leading-none">
          CHAT
        </h1>
        <form
          action=""
          className="relative ml-auto w-max duration-300 ease-in-out"
        >
          <input
            type="search"
            className="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none focus:w-full focus:cursor-text focus:border-lime-300 focus:pl-16 focus:pr-4"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-lime-300 peer-focus:stroke-lime-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
        {/* </div> */}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full antialiased text-slate-800">
          <div className="flex flex-row h-full w-full overflow-x-hidden">
            {children}
            <ChannelSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
