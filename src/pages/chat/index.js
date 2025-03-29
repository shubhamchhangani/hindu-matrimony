import { useEffect, useState } from "react";
import  supabase  from "../../utils/supabase/client";
import ChatItem from "../../components/chatItem";

const ChatList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .or(`user1.eq.${supabase.auth.getUser().id},user2.eq.${supabase.auth.getUser().id}`);

      if (error) console.error(error);
      else setChats(data);
    };

    fetchChats();
  }, []);

  return (
    <div>
      <h1>Your Chats</h1>
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default ChatList;
