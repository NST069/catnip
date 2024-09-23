import { Dispatch, SetStateAction, useState } from "react";

export default function Input({ value, setValue, placeholder, password = false, disabled = false }: { value: string | number, setValue?: Dispatch<SetStateAction<string>>, placeholder: string, password?: boolean, disabled?: boolean }) {

    const [show, setShow] = useState(false);

    return (
        <div className="w-full">
            <input
                type={!password || show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue ? setValue(e.target.value) : null}
                placeholder={placeholder}
                disabled={disabled}
                className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
            />
            {password ? <button onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
            </button>
                : null}
        </div>
    );
}