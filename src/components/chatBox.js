import { useState, useEffect } from "react";
import  supabase  from "../utils/supabase/client";

const ChatBox = ({ chatId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      let { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      setMessages(data);
    };

    fetchMessages();

    const subscription = supabase
      .channel(`chat_${chatId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    await fetch("/api/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, sender_id: userId, content: message }),
    });
    setMessage("");
  };

  return (
    <div>
      {messages.map((msg) => (
        <p key={msg.id}>{msg.content}</p>
      ))}
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
