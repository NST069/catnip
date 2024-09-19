import { FormEvent, useRef, useState } from "react";

import { sendDM, sendChannelMessage } from "@/app/lib/nostr";

export default function ChatForm({
  chatId,
  updateChat,
  sendMessage
}: {
  chatId: string;
  updateChat: () => Promise<void>;
  sendMessage: typeof sendDM | typeof sendChannelMessage;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      let message = formData.get("message")?.toString() as string;
      if (message.length > 0) {
        await sendMessage(message, chatId);
        formRef.current ? formRef.current.reset() : null;
      } else window.alert("Enter message");
    } catch (error) {
      console.error(error);
    } finally {
      await updateChat();
      setIsLoading(false);
    }
  }

  return (
    <form
      className="flex flex-row items-center rounded-xl bg-slate-900 w-full px-4 py-2"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div>
        <button className="flex items-center justify-center text-slate-400 hover:text-slate-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex-grow ml-4">
        <div className="relative w-full">
          <textarea
            name="message"
            autoComplete="off"
            className="flex w-full bg-slate-800 border border-slate-700 text-slate-400 rounded-xl focus:outline-none pl-4 min-h-12 h-20 max-h-32"
          />
          <div className="absolute flex items-center justify-center h-12 w-12 right-1 top-0">
          <button className=" text-slate-400 hover:text-slate-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
          </div>
        </div>
      </div>
      <div className="ml-4">
        <button
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-xl text-white px-4 py-1 flex-shrink-0"
          type="submit"
          disabled={isLoading}
        >
          <span>Send</span>
          <span className="ml-2">
            <svg
              className="w-4 h-4 transform rotate-45 -mt-px"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    </form>
  );
}
