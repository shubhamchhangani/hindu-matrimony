import  supabase  from "../../utils/supabase/client";

export default async function handler(req, res) {
  const { chat_id, sender_id, content } = req.body;

  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id, sender_id, content }]);

  if (error) return res.status(400).json(error);

  res.status(200).json(data);
}
