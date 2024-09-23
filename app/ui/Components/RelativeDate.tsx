import moment from "moment";
import Link from "next/link";

export default function RelativeDate({ timestamp, url }: { timestamp?: number, url?: string }) {

    return timestamp
        ? url
            ? (<Link
                href={url}
                className="group relative inline-block text-slate-400 text-sm duration-300"
            >
                {moment.unix(timestamp as number).fromNow()}
                <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                    {moment.unix(timestamp as number).toLocaleString()}
                </span>
            </Link>)
            : (<p className="group relative inline-block text-slate-400 text-sm duration-300">
                {moment.unix(timestamp).fromNow()}
                <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                    {moment.unix(timestamp).toLocaleString()}
                </span>
            </p>)
        : (<p className="group relative inline-block bg-slate-400 text-sm duration-300"></p>)
}