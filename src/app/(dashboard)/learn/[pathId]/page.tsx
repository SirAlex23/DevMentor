'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Lesson {
  index: number
  title: string
  description: string
  duration: string
}

interface Path {
  id: string
  topic: string
  category: string
  level: string
  roadmap: {
    title: string
    description: string
    lessons: Lesson[]
  }
}

export default function PathPage() {
  const { pathId } = useParams()
  const router = useRouter()
  const [path, setPath] = useState<Path | null>(null)
  const [progress, setProgress] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    const { data: prog } = await supabase
      .from('progress')
      .select('*')
      .eq('path_id', pathId)

    if (prog) {
      const map: Record<number, boolean> = {}
      prog.forEach(p => { map[p.lesson_index] = p.completed })
      setProgress(map)
    }
  }, [pathId])

  useEffect(() => {
    const fetchPath = async () => {
      const { data } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathId)
        .single()
      setPath(data)
      await fetchProgress()
      setLoading(false)
    }
    fetchPath()
  }, [pathId, fetchProgress])

  useEffect(() => {
    const onFocus = () => fetchProgress()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchProgress])

  if (loading) return <div className="text-gray-400">Cargando...</div>
  if (!path) return <div className="text-gray-400">Path no encontrado</div>

  const completed = Object.values(progress).filter(Boolean).length
  const total = path.roadmap.lessons.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div>
      <button onClick={() => router.push('/learn')} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2">
        ← Volver
      </button>

      <h1 className="text-3xl font-bold mb-2">{path.roadmap.title}</h1>
      <p className="text-gray-400 mb-2">{path.roadmap.description}</p>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full">{path.level}</span>
        <span className="text-xs text-gray-500">{completed}/{total} lecciones completadas</span>
        {completed === total && total > 0 && (
          <span className="text-xs bg-green-900 text-green-300 px-3 py-1 rounded-full">🎉 Completado</span>
        )}
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="space-y-4">
        {path.roadmap.lessons.map((lesson) => {
          const done = progress[lesson.index]
          return (
            <div key={lesson.index}
              onClick={() => router.push(`/learn/${pathId}/lesson/${lesson.index}`)}
              className={`border rounded-xl p-5 cursor-pointer transition flex items-center justify-between ${done ? 'bg-green-950 border-green-800 hover:border-green-600' : 'bg-gray-900 border-gray-800 hover:border-indigo-500'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  {done ? '✓' : lesson.index + 1}
                </div>
                <div>
                  <p className={`font-semibold ${done ? 'text-green-300' : 'text-white'}`}>{lesson.title}</p>
                  <p className="text-gray-400 text-sm">{lesson.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-gray-500 text-sm">{lesson.duration}</span>
                {done && <span className="text-green-400 text-xs font-medium">Completada</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}