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
    console.log("开始生成聊天响应...");
    console.log("API密钥前5个字符:", apiKey.substring(0, 5));
    
    // 准备消息历史
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    ];
    
    console.log("发送请求到硅基流动API...");
    
    // 调用硅基流动API
    const response = await axios.post(
      "https://api.moonshot.cn/v1/chat/completions",
      {
        model: "Qwen/QwQ-32B",  // 使用Qwen/QwQ-32B模型
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    
    console.log("API响应状态:", response.status);
    
    // 返回响应内容
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("生成聊天响应时出错:", error);
    
    // 安全地处理错误信息
    const errorString = String(error);
    let errorDetails = "未知错误";
    
    // 安全地检查是否有response属性
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response) {
        console.error("错误状态码:", axiosError.response.status);
        errorDetails = JSON.stringify(axiosError.response.data || {});
        console.error("错误数据:", errorDetails);
      }
    }
    
    // 提供更具体的错误信息
    if (errorString.includes("401")) {
      return "API密钥认证失败，请检查密钥是否正确。";
    } else if (errorString.includes("403")) {
      return "API访问被拒绝，可能没有权限使用该模型或API。";
    } else if (errorString.includes("429")) {
      return "请求过于频繁，已超出API使用限制。";
    } else if (errorString.includes("model")) {
      return "模型不可用，请检查模型名称是否正确。";
    } else if (errorString.includes("timeout")) {
      return "API请求超时，请稍后再试。";
    }
    
    return `API请求失败: ${errorString.substring(0, 100)}...`;
  }
}