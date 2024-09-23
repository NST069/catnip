export default function PrimaryButton({ caption, click, full = false }: { caption: string, click?: () => void, full?: boolean }) {

    return (
        <button
            className={`mt-4 bg-purple-500 text-slate-200 py-2 px-6 rounded-md hover:bg-purple-600 ${full ? "w-full" : ""}`}
            onClick={() => click ? click() : null}
        >
            {caption}
        </button>
    );
}