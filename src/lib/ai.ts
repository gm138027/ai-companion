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
    
    // 使用正确的API端点并启用流式输出
    const response = await axios.post(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-R1",
        messages: formattedMessages,
        stream: true,  // 启用流式输出
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        timeout: 60000,  // 增加超时时间为60秒
        responseType: 'stream'
      }
    );
    
    // 处理流式响应
    let fullContent = '';
    
    // 解析流式响应
    for await (const chunk of response.data) {
      try {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsedData = JSON.parse(data);
              const content = parsedData.choices[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
              }
            } catch (e) {
              console.error("解析流式数据出错:", e);
            }
          }
        }
      } catch (e) {
        console.error("处理流式数据块出错:", e);
      }
    }
    
    console.log("API响应接收完成");
    
    // 返回完整响应内容
    return fullContent;
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