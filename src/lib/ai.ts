// src/lib/ai.ts
import axios from "axios";

// 定义错误接口
interface ErrorWithResponse {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
  toString(): string;
}

// 使用正确的API密钥环境变量
const apiKey = process.env.SILICONFLOW_API_KEY || "";

// 生成聊天响应函数
export async function generateChatResponse(
  systemPrompt: string,
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  try {
    console.log("开始生成聊天响应...");
    
    // 准备消息历史
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }))
    ];
    
    console.log("发送请求到SiliconFlow API...");
    
    // 不使用流式输出，但增加超时时间
    const response = await axios.post(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 400  // 减少token数量以加快响应
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        timeout: 60000  // 增加超时时间为60秒
      }
    );
    
    console.log("API响应状态:", response.status);
    
    // 返回响应内容
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("生成聊天响应时出错:", error);
    
    const errorString = String(error);
    
    // 详细记录错误信息
    if (error && typeof error === 'object') {
      const err = error as ErrorWithResponse;
      if (err.response) {
        console.error("错误状态码:", err.response.status);
        console.error("错误详情:", JSON.stringify(err.response.data));
      }
    }
    
    // 提供更具体的错误信息
    if (errorString.includes("401")) {
      return "API密钥认证失败（401错误）。请检查您的API密钥是否正确，并确保它是在硅基流动(SiliconFlow)平台创建的有效密钥。您可能需要完成实名认证。";
    } else if (errorString.includes("403")) {
      return "API访问被拒绝（403错误）。您可能没有使用此模型的权限，或者需要完成实名认证。";
    } else if (errorString.includes("404")) {
      return "API端点不存在（404错误）。请检查API URL是否正确为'https://api.siliconflow.cn/v1/chat/completions'。";
    } else if (errorString.includes("429")) {
      return "请求过于频繁（429错误），已超出API使用限制。";
    } else if (errorString.includes("model")) {
      return "模型不可用或名称错误。请使用'deepseek-ai/DeepSeek-R1'作为模型名称。";
    }
    
    return `API请求失败: ${errorString}`;
  }
}