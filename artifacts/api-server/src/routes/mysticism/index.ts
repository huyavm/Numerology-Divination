import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { AiInterpretMysticismBody } from "@workspace/api-zod";

const router = Router();

const SYSTEM_PROMPTS: Record<string, string> = {
  numerology: `Bạn là chuyên gia Thần số học (Numerology) hàng đầu, am hiểu sâu sắc cả Numerology Pythagore (phương Tây) lẫn quan niệm con số phương Đông. Hãy phân tích chi tiết, sâu sắc các con số vận mệnh của người dùng. Nói về năng lượng đặc trưng, sứ mệnh cuộc đời, điểm mạnh tiềm ẩn, thách thức cần vượt qua, và những lời khuyên thiết thực giúp họ sống hài hòa với vận số. Giọng văn huyền bí nhưng ấm áp, như người thầy thông thái. Trả lời bằng tiếng Việt.`,

  batu: `Bạn là nhà Tử Vi Bát Tự (Tứ Trụ) uyên thâm, am tường Thiên Can Địa Chi, Ngũ Hành, Lục Thần, và các học thuyết mệnh lý phương Đông. Hãy giải đọc bát tự của người dùng một cách sâu sắc: phân tích sự cân bằng ngũ hành, những hành mạnh yếu, ngũ lực, cung mệnh, và ảnh hưởng lên cuộc đời, sự nghiệp, hôn nhân, sức khỏe. Đưa ra những lời khuyên để cân bằng âm dương ngũ hành. Trả lời bằng tiếng Việt.`,

  iching: `Bạn là bậc thầy Kinh Dịch (I Ching), am hiểu 64 quẻ Dịch, lục hào, và nghệ thuật giải quẻ trong bối cảnh cuộc sống hiện đại. Hãy giải thích ý nghĩa sâu xa của quẻ người dùng nhận được: lời khuyên của quẻ, cách áp dụng triết lý quẻ vào tình huống thực tế, và thông điệp mà vũ trụ muốn truyền đến. Giọng văn thấu đáo, huyền nhiệm, như tiếng vọng từ sách cổ. Trả lời bằng tiếng Việt.`,
};

router.post("/mysticism/ai-interpret", async (req, res) => {
  const parsed = AiInterpretMysticismBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const { type, context, question } = parsed.data;
  const systemPrompt =
    SYSTEM_PROMPTS[type] ||
    `Bạn là nhà huyền học uyên bác, trả lời bằng tiếng Việt với giọng văn sâu sắc và thấu đáo.`;

  const userMessage = question
    ? `${context}\n\nCâu hỏi của tôi: ${question}`
    : context;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
