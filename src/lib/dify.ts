// Dify API 타입 정의

export interface DifyRequestPayload {
  inputs: Record<string, unknown>;
  query: string;
  response_mode: 'blocking' | 'streaming';
  user: string;
  conversation_id?: string;
}

export interface DifyResponseData {
  message_id: string;
  mode: string;
  answer: string;
  metadata?: Record<string, unknown>;
}

export interface DifyErrorResponse {
  code: string;
  message: string;
  status: number;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

// Dify API 설정
export const DIFY_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_DIFY_API_URL || 'http://localhost/v1',
  apiKey: process.env.DIFY_API_KEY || 'app-JA4vN5714g2Nd5ftpyFgN49g',
  userId: process.env.DIFY_USER_ID || 'usr-0adc0770-a7e5-42f3-bc51-7d34f5cd0b92',
};

// Dify API 호출 함수
export async function callDifyAPI(message: string, conversationId?: string): Promise<string> {
  try {
    const payload: DifyRequestPayload = {
      inputs: {},
      query: message,
      response_mode: 'blocking',
      user: DIFY_CONFIG.userId,
      ...(conversationId && { conversation_id: conversationId }),
    };

    const response = await fetch(`${DIFY_CONFIG.apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Dify API Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data: DifyResponseData = await response.json();
    return data.answer || '죄송합니다. 답변을 생성하지 못했습니다.';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Dify API 호출 오류:', errorMessage);
    throw error;
  }
}

// 답변 정규화 함수 (줄바꿈 및 특수문자 처리)
export function normalizeAnswer(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/\\n/g, '\n') // 이스케이프된 줄바꿈을 실제 줄바꿈으로 변환
    .replace(/\n\n+/g, '\n\n') // 연속된 줄바꿈 제거
    .trim();
}
