import React from "react";
import { useRouter } from "next/navigation";

const ChatItem = ({ chat }) => {
  const router = useRouter();

  const openChat = () => {
    router.push(`/chat/${chat.id}`);
  };

  return (
    <div
      onClick={openChat}
      className="flex items-center p-3 border-b cursor-pointer hover:bg-gray-100"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        🗨️
      </div>
      <div className="ml-3">
        <p className="text-lg font-semibold">{chat.user_name}</p>
        <p className="text-sm text-gray-500">{chat.last_message}</p>
      </div>
    </div>
  );
};

export default ChatItem;
