import { NextRequest, NextResponse } from 'next/server'
import { groq } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { messages, lesson } = await req.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Eres un tutor experto en "${lesson.topic}" nivel ${lesson.level}. Estás enseñando la lección "${lesson.title}": ${lesson.description}. Explica de forma clara, usa ejemplos prácticos y responde en español.`
        },
        ...messages
      ]
    })

    return NextResponse.json({ reply: completion.choices[0].message.content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}