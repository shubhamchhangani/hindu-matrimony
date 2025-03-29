import { useEffect, useState } from "react";

const ChatList = ({ userId }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch(`/api/getChats?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.id}>
          <a href={`/chat/${chat.id}`}>
            Chat with {chat.user1 === userId ? chat.profiles[1].full_name : chat.profiles[0].full_name}
          </a>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
