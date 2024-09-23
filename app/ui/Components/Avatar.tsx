import { ImagePlaceholderIcon } from "@/app/lib/iconset";

export default function Avatar({ id, size, rounded, src, alt }: { id?: string, size?: number, rounded?: boolean, src: string, alt?: string }) {

  return (id ? <img
    className={`${size ? "w-" + size + " h-" + size : ""} ${rounded ? "rounded-full" : ""} object-cover object-center aspect-square`}
    src={src ? src : "https://api.multiavatar.com/" + id + ".svg"}
    alt={alt ? alt : "Avatar"}
  />
    : <div className="flex items-center gap-4 animate-pulse">
      <div className={`grid bg-slate-800 rounded-full ${size ? "w-" + size + " h-" + size : ""} place-items-center flex-shrink-0`}>
        <ImagePlaceholderIcon size={6} />
      </div>
    </div>);
}