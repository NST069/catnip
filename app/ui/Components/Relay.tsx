import { Relay } from "@/app/lib/definitions";


export default function RelayItem({ r, ind, deleteFx }: { r: Relay, ind?: number, deleteFx?: () => void }) {

    return (<div
        className="flex flex-row items-start text-slate-500 h-10 my-5"
        key={ind}
    >
        <span className="text-xl font-light w-full">{r.address}</span>
        <div
            className={`w-2 h-2 m-4 ${r.read ? "bg-green-500" : "bg-green-950"
                } rounded-full`}
        />
        <div
            className={`w-2 h-2 m-4 ${r.write ? "bg-blue-500" : "bg-blue-950"
                } rounded-full`}
        />
        {deleteFx ? (<div
            className="w-2 h-2 m-4"
            onClick={(e) => deleteFx()}
        >
            x
        </div>) : null}
    </div>);
}