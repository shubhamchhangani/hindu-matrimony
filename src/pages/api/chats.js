import  supabase  from "../../utils/supabase/client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user1, user2 } = req.body;

    // Check if chat already exists
    let { data: existingChat } = await supabase
      .from("chats")
      .select("id")
      .or(`user1.eq.${user1},user2.eq.${user2}`)
      .or(`user2.eq.${user1},user1.eq.${user2}`);

    if (existingChat.length > 0) {
      return res.status(200).json(existingChat[0]);
    }

    // Create a new chat
    const { data, error } = await supabase
      .from("chats")
      .insert([{ user1, user2 }])
      .select();

    if (error) return res.status(400).json(error);

    res.status(200).json(data[0]);
  }
}
