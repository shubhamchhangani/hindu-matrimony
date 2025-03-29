import  supabase  from "../../utils/supabase/client";

export default async function handler(req, res) {
  const { userId } = req.query;

  const { data, error } = await supabase
    .from("chats")
    .select("id, user1, user2, profiles!user1 (full_name), profiles!user2 (full_name)")
    .or(`user1.eq.${userId},user2.eq.${userId}`);

  if (error) return res.status(400).json(error);

  res.status(200).json(data);
}
