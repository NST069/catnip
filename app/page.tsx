import Image from "next/image";

import Nav from "@/app/ui/nav";

export default async function Home() {
  
  return (
    <main className="flex min-h-screen flex-col">
      {/*<div className="flex items-center flex-shrink-0 h-16 bg-white border-b border-gray-300 px-4"></div>*/}
      <Nav />
      <div className="flex grow flex-col items-center justify-center bg-slate-950 text-slate-200">
        <h1 className="font-bold text-2xl">Welcome to Catnip</h1>
        <img className="block h-64 w-auto" src="/logo.png" />
      </div>
    </main>
  );
}
