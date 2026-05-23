'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function LessonPage() {
  const { pathId, lessonId } = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      const { data } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathId)
        .single()

        if (data) {
          const l = data.roadmap.lessons.find((les: any) => les.index === Number(lessonId))
          if (!l) return
          setLesson({ ...l, topic: data.topic, level: data.level })
          setMessages([{
            role: 'assistant',
            content: `¡Hola! Vamos a aprender sobre **${l.title}**.\n\n${l.description}\n\nPuedes hacerme cualquier pregunta o escribir "empezar" para que te explique el tema.`
          }])
        }

      const { data: prog } = await supabase
        .from('progress')
        .select('*')
        .eq('path_id', pathId)
        .eq('lesson_index', Number(lessonId))
        .single()

      if (prog?.completed) setCompleted(true)
    }
    fetchLesson()
  }, [pathId, lessonId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch('/api/ai/lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ messages: [...messages, userMsg], lesson })
    })

    const data = await res.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  const markCompleted = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ pathId, lessonIndex: Number(lessonId), completed: true })
    })
    setCompleted(true)
    router.push(`/learn/${pathId}`)
  }

  if (!lesson) return <div className="text-gray-400">Cargando lección...</div>

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push(`/learn/${pathId}`)} className="text-gray-400 hover:text-white text-sm mb-1 block">← Volver al path</button>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-gray-400 text-sm">{lesson.duration}</p>
        </div>
        <button onClick={markCompleted} disabled={completed}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${completed ? 'bg-green-700 text-white cursor-default' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
          {completed ? '✓ Completada' : 'Marcar como completada'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-100 border border-gray-800'}`}>
            <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl text-sm text-gray-400">Pensando...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu pregunta..."
          className="flex-1 bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition text-sm"
        />
        <button onClick={sendMessage} disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl transition disabled:opacity-50 text-sm font-semibold">
          Enviar
        </button>
      </div>
    </div>
  )
}