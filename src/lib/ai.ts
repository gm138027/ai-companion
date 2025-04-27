import { GoogleGenerativeAI } from "@google/generative-ai";

// Your API key
const apiKey = process.env.GOOGLE_AI_API_KEY || "";

// 调试：打印API密钥是否存在（不要打印完整密钥）
console.log("API密钥是否存在:", apiKey ? "是" : "否");
console.log("API密钥前5个字符:", apiKey.substring(0, 5));

// Create a new instance of GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(apiKey);

// Function to generate a response from the AI model
export async function generateChatResponse(
  systemPrompt: string,
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  try {
    // 调试：打印收到的消息
    console.log("用户最后消息:", messages[messages.length - 1].content);
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a chat instance
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1000,
      },
      systemInstruction: systemPrompt,
    });

    // 调试：打印系统提示词长度
    console.log("系统提示词长度:", systemPrompt.length);

    // Send the message to the model
    const result = await chat.sendMessage(
      messages[messages.length - 1].content
    );

    // Return the response
    return result.response.text();
  } catch (error) {
    // 详细打印错误
    console.error("Error generating chat response:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return "对不起，我现在无法处理您的请求。请稍后再试。";
  }
}