export const runtime = "nodejs";

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

type Message = { role: string; content: string };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;
  const faq: { question: string; answer: string }[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/faq.json"), "utf-8")
  );

  // Live agent keyword detection
  if (/(\bagent\b|\blive agent\b|\bhuman\b)/i.test(message)) {
    return res.status(200).json({
      messages: [{ role: "assistant", content: "Connecting you to a live agent... please hold." }]
    });
  }

  // Fuse.js fuzzy search setup
  const fuse = new Fuse(faq, {
    keys: ["question"],
    threshold: 0.4,
    minMatchCharLength: 3,
  });

  const results = fuse.search(message);
  const best = results[0]?.item;
  const answer = best ? best.answer : "Sorry, I couldn’t find that—can you try rephrasing?";

  return res.status(200).json({
    messages: [{ role: "assistant", content: answer }]
  });
}
