import { FormEvent, useRef, useState } from "react";

import { sendDM, sendChannelMessage } from "@/app/lib/nostr";
import { Attachment, Emoji, Send } from "@/app/lib/iconset";

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
          <Attachment />
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
              <Emoji />
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
            <Send/>
          </span>
        </button>
      </div>
    </form>
  );
}
