import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, conversationId } = await request.json();

    const difyUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
    const difyKey = process.env.DIFY_API_KEY || 'app-9We3jSI8ayICovlytatAxpy7ht';

    if (!difyKey) {
      return NextResponse.json({ 
        answer: "⚠️ .env.local 파일에 DIFY_API_KEY가 설정되지 않았습니다. 설정을 확인해 주세요." 
      });
    }

    const response = await fetch(`${difyUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        user: 'linco-web-user',
        conversation_id: conversationId || "",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Dify API 연결에 실패했습니다.' }, { status: 500 });
  }
}