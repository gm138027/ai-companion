import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/ai";
import { getCharacterById } from "@/lib/characters";

export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const body = await req.json();
    const { characterId, messages } = body;

    // 验证请求
    if (!characterId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "无效的请求体" },
        { status: 400 }
      );
    }

    // 获取角色
    const character = getCharacterById(characterId);
    if (!character) {
      return NextResponse.json(
        { error: "未找到角色" },
        { status: 404 }
      );
    }

    console.log("API请求开始，角色ID:", characterId);
    console.log("API请求消息数量:", messages.length);

    // 生成响应
    const response = await generateChatResponse(
      character.systemPrompt,
      messages
    );

    console.log("API请求成功完成");

    // 返回响应
    return NextResponse.json({ response });
  } catch (error) {
    console.error("聊天API错误:", error);
    console.error("错误详情:", JSON.stringify(error, null, 2));
    
    // 更友好的错误信息
    let errorMessage = "处理聊天请求失败";
    if (error.toString().includes("API key")) {
      errorMessage = "API密钥错误，请检查配置";
    } else if (error.toString().includes("quota")) {
      errorMessage = "API配额已用尽";
    } else if (error.toString().includes("network")) {
      errorMessage = "网络错误，无法连接到Google API";
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message || "未知错误" },
      { status: 500 }
    );
  }
}