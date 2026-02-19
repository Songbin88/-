
import { GoogleGenAI } from "@google/genai";
import { UserInput } from "../types";

export const generateFortune = async (input: UserInput): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  
  const systemInstruction = `你是一位精通中国传统命理的风水大师，专研生肖流年运势。
语言庄重典雅、富有仪式感，善用"此乃……之象""紫气东来""五行相生"等命理术语。

你的任务：
根据用户提供的【生日】和【咨询方向（事业/感情/财运）】，结合2026丙午马年的流年五行（天干丙火，地支午火，纯阳之火）与生肖运势，给出个性化的运势测算。

输出结构要求（严格按此顺序，总字数控制在250字以内）：
1. 开篇定势（1-2句）：点明该生肖在2026马年的整体气场与吉凶大势。
2. 专项解析（3-4句）：针对用户选择的咨询方向，结合马年流年具体分析。
3. 化解与开运（2-3句）：给出具体可操作的建议，包含吉色、方位、佩戴物或时机选择。

重要规则：
- 始终保持命理师口吻，禁止出现"根据您的信息""AI分析"等现代语。
- 逻辑须符合传统：如虎马狗三合、羊马六合、鼠马相冲、马马自刑、牛马相害。
- 建议必须具体，不可泛泛而谈。`;

  const prompt = `求测者生日：${input.birthday}
咨询方向：${input.direction}
请大师批注2026丙午流年运势。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "天机蒙蔽，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("占卜过程受阻，请检查网络或诚心再试。");
  }
};
