import { NextResponse } from 'next/server'

type DifyResponseShape = {
  answer?: unknown
  message?: unknown
  text?: unknown
  error?: unknown
  conversation_id?: unknown
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = readString(body?.message ?? body?.query)
    const conversationId = readString(body?.conversationId ?? body?.conversation_id)

    const difyUrl = process.env.DIFY_API_URL || 'http://localhost/v1'
    const difyKey = process.env.DIFY_API_KEY || 'app-JA4vN5714g2Nd5ftpyFgN49g'

    if (!message.trim()) {
      return NextResponse.json({ answer: '질문 내용을 입력해 주세요.' })
    }

    if (!difyKey) {
      return NextResponse.json({
        answer: '.env.local 에 DIFY_API_KEY 를 설정해 주세요.',
      })
    }

    const instruction =
      '다음 지침을 지켜서 답변해 주세요.\n- 한국어만 사용합니다.\n- 이모지와 특수기호는 최소한으로 씁니다.\n- 짧고 명확하게 답합니다.\n\n'

    const response = await fetch(`${difyUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${difyKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: `${instruction}${message}`,
        response_mode: 'blocking',
        user: 'linco-web-user',
        conversation_id: conversationId,
      }),
    })

    const responseText = await response.text()
    let data: DifyResponseShape = {}

    try {
      data = responseText ? (JSON.parse(responseText) as DifyResponseShape) : {}
    } catch {
      data = { message: responseText || 'Dify API 응답을 해석하지 못했습니다.' }
    }

    const answer = readString(data.answer) || readString(data.message) || readString(data.text)
    const responseConversationId = readString(data.conversation_id) || conversationId
    const responseError = readString(data.message) || readString(data.error) || `Dify API 오류 (${response.status})`

    if (!response.ok) {
      return NextResponse.json(
        {
          answer: `Dify API 오류: ${responseError}`,
          conversation_id: conversationId,
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      answer,
      conversation_id: responseConversationId,
      raw: data,
    })
  } catch (error) {
    console.error('Dify API 연결 오류:', error)
    return NextResponse.json({ error: 'Dify API 연결에 실패했습니다.' }, { status: 500 })
  }
}
