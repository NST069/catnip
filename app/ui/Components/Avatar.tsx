
export default function Avatar({ id, size, rounded, src, alt }: { id?: string, size?: number, rounded?: boolean, src: string, alt?: string }) {

    return (id ? <img
        className={`${size ? "w-" + size + " h-" + size : ""} ${rounded ? "rounded-full" : ""} object-cover object-center aspect-square`}
        src={src ? src : "https://api.multiavatar.com/" + id + ".svg"}
        alt={alt ? alt : "Avatar"}
    />
        : <div className="flex items-center gap-4 animate-pulse">
            <div className={`grid bg-slate-800 rounded-full ${size ? "w-" + size + " h-" + size : ""} place-items-center flex-shrink-0`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-slate-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    ></path>
                </svg>
            </div>
        </div>);
}