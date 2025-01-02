export default function TabButton({ caption, isSelected = false, click }: { caption: string, isSelected: boolean, click: () => void }) {

    return (
        <div
            className={`flex flex-1 items-center justify-center h-8 text-sm font-medium ${isSelected ? "bg-slate-800" : "bg-slate-900"
                } hover:bg-slate-800 focus:outline-none cursor-pointer`}
            onClick={click}
        >
            {caption}
        </div>
    );
}