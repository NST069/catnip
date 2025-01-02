import { ImagePlaceholderIcon } from "@/app/lib/iconset";

export default function Avatar({ id, size, rounded, src, alt, placeholderSize }: { id?: string, size?: number, rounded?: boolean, src: string, alt?: string, placeholderSize?: number }) {

  return (id ? <img
    className={`${size ? "w-" + size + " h-" + size : ""} ${rounded ? "rounded-full" : ""} object-cover object-center aspect-square`}
    src={src ? src : "https://api.multiavatar.com/" + id + ".svg"}
    alt={alt ? alt : "Avatar"}
  />
    : <div className={`flex flex-shrink-0 items-center justify-center gap-4 animate-pulse bg-slate-800 ${size ? "w-" + size + " h-" + size : ""} ${rounded ? "rounded-full" : ""}`}>
      <div className={`grid place-items-center flex-shrink-0`}>
        <ImagePlaceholderIcon size={placeholderSize ? placeholderSize : 6} />
      </div>
    </div>);
}