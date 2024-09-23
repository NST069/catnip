import Link from "next/link";

export default function MenuItem({ disabled, href, caption, action }: { disabled?: boolean, href?: string, caption: string, action?: () => void }) {

    return disabled || action
        ? (<div className={`flex items-center h-8 hover:bg-slate-700 text-sm px-3 ${disabled ? "text-slate-600" : ""} ${action ? "cursor-pointer" : ""}`} onClick={action}>
            {caption}
        </div>)
        : (<Link
            className="flex items-center h-8 hover:bg-slate-700 text-sm px-3"
            href={href ? href : "#"}
        >
            {caption}
        </Link>
        );
}