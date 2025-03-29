import { useEffect, useState } from "react";
import  supabase  from "../../utils/supabase/client";

const ChatBox = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at");

      setMessages(data);
    };

    fetchMessages();

    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await supabase.from("messages").insert([
      { chat_id: chatId, sender_id: supabase.auth.user().id, message: newMessage }
    ]);

    setNewMessage("");
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.message}</p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
