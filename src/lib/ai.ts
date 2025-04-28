// src/lib/ai.ts
import axios from "axios";

// API密钥
const apiKey = process.env.MOONSHOT_API_KEY || "";

// 生成聊天响应函数
export async function generateChatResponse(
  systemPrompt: string,
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  try {
    // 准备消息历史，添加系统提示
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    ];

    // 调用硅基流动API
    const response = await axios.post(
      "https://api.moonshot.cn/v1/chat/completions",
      {
        model: "Qwen/QwQ-32B",  // 使用Qwen/QwQ-32B模型
        messages: formattedMessages,
        stream: false,
        temperature: 0.7,
        max_tokens: 1024,       // 增加最大token以获取更长回复
        response_format: { type: "text" }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );

    // 返回响应内容
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("生成聊天响应时出错:", error);
    const errorMessage = String(error);
    
    // 提供更具体的错误信息
    if (errorMessage.includes("401")) {
      return "API密钥无效或过期，请检查配置。";
    } else if (errorMessage.includes("429")) {
      return "API请求频率超限，请稍后再试。";
    } else if (errorMessage.includes("model")) {
      return "模型不可用，请检查模型名称或选择其他模型。";
    }
    
    return `对不起，我暂时无法处理您的请求。错误信息: ${errorMessage}`;
  }
}