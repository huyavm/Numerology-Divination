import { Router } from "express";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody } from "@workspace/api-zod";

const router = Router();

const SYSTEM_PROMPT = `Bạn là một nhà huyền học uyên bác, am tường Thần số học (Numerology), Bát tự Tứ Trụ, Kinh Dịch (I Ching), và các phép huyền bí phương Đông và phương Tây. Bạn trả lời bằng tiếng Việt, với giọng văn sâu sắc, thấu đáo nhưng vẫn gần gũi. Hãy trả lời như một người thầy thông thái đang khai sáng cho người học trò.`;

const DEFAULT_OPENAI_MODEL = "gpt-4.1";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-pro";

router.get("/openai/conversations", async (req, res) => {
  const convs = await db
    .select()
    .from(conversationsTable)
    .orderBy(conversationsTable.createdAt);
  res.json(convs);
});

router.post("/openai/conversations", async (req, res) => {
  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [conv] = await db
    .insert(conversationsTable)
    .values({ title: parsed.data.title })
    .returning();
  res.status(201).json(conv);
});

router.get("/openai/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  if (!conv) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(messagesTable.createdAt);
  res.json({ ...conv, messages: msgs });
});

router.delete("/openai/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(messagesTable).where(eq(messagesTable.conversationId, id));
  const deleted = await db
    .delete(conversationsTable)
    .where(eq(conversationsTable.id, id))
    .returning();
  if (!deleted.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).end();
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(messagesTable.createdAt);
  res.json(msgs);
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  if (!conv) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const prevMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(messagesTable.createdAt);

  await db.insert(messagesTable).values({
    conversationId: id,
    role: "user",
    content: parsed.data.content,
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const provider = (req.headers["x-ai-provider"] as string) || "openai";
  const userApiKey = (req.headers["x-ai-key"] as string) || "";
  const userModel = (req.headers["x-ai-model"] as string) || "";

  const chatMessages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...prevMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: parsed.data.content },
  ];

  let fullResponse = "";

  try {
    if (provider === "gemini" && userApiKey) {
      const model = userModel || DEFAULT_GEMINI_MODEL;
      const genAI = new GoogleGenerativeAI(userApiKey);
      const geminiModel = genAI.getGenerativeModel({ model });

      const geminiMessages = chatMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

      const systemInstruction = SYSTEM_PROMPT;
      const modelWithSystem = genAI.getGenerativeModel({ model, systemInstruction });
      const chat = modelWithSystem.startChat({ history: geminiMessages.slice(0, -1) });
      const result = await chat.sendMessageStream(parsed.data.content);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }
    } else if (userApiKey) {
      const model = userModel || DEFAULT_OPENAI_MODEL;
      const client = new OpenAI({ apiKey: userApiKey });

      const stream = await client.chat.completions.create({
        model,
        max_completion_tokens: 8192,
        messages: chatMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } else {
      const msg = "Vui lòng nhập OpenAI hoặc Gemini API key trong phần Cài đặt AI (biểu tượng trên thanh điều hướng) để sử dụng tính năng chat.";
      res.write(`data: ${JSON.stringify({ content: msg })}\n\n`);
      fullResponse = msg;
    }
  } catch (err: any) {
    const msg = `Lỗi kết nối AI: ${err?.message || "Lỗi không xác định"}`;
    res.write(`data: ${JSON.stringify({ content: `\n\n*${msg}*` })}\n\n`);
    fullResponse += `\n\n*${msg}*`;
  }

  await db.insert(messagesTable).values({
    conversationId: id,
    role: "assistant",
    content: fullResponse,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
