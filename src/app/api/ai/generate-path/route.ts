import { NextRequest, NextResponse } from 'next/server'
import { groq } from '@/lib/groq'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { topic, category, level } = await req.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {}
        }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('USER:', user?.id, 'AUTH ERROR:', authError?.message)

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Crea un roadmap de aprendizaje para "${topic}" nivel ${level} en la categoría ${category}.
Responde SOLO con JSON válido, sin texto adicional, con esta estructura exacta:
{
  "title": "título del path",
  "description": "descripción breve",
  "lessons": [
    { "index": 0, "title": "título lección", "description": "qué se aprende", "duration": "20 min" }
  ]
}
Genera entre 6 y 8 lecciones progresivas.`
      }]
    })

    const raw = completion.choices[0].message.content || ''
    console.log('RAW GROQ:', raw)

    const clean = raw.replace(/^```[\w]*\s*/g, '').replace(/```\s*$/g, '').trim()
    const roadmap = JSON.parse(clean)
    console.log('ROADMAP PARSED OK, inserting...')

    const { data, error } = await supabase
      .from('learning_paths')
      .insert({ user_id: user.id, topic, category, level, roadmap })
      .select('id')
      .single()

    console.log('INSERT RESULT:', data, error)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ pathId: data.id })
  } catch (e: any) {
    console.error('ERROR:', e?.message || e)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}