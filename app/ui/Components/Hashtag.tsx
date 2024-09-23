export default function Hashtag({ tag, keystring }: { tag: string, keystring?: string }) {

    return (
        <span
            key={keystring ? keystring : ""}
            className="bg-slate-100 text-slate-800 text-xs font-medium me-2 mt-2 px-2.5 py-0.5 rounded-full dark:bg-slate-700 dark:text-slate-300"
        >
            #{tag}
        </span>
    )
}