'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface PathWithProgress {
  id: string
  topic: string
  category: string
  level: string
  roadmap: { title: string; lessons: any[] }
  completed: number
  total: number
}

export default function ProgressPage() {
  const [paths, setPaths] = useState<PathWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const { data: lp } = await supabase.from('learning_paths').select('*')
      const { data: prog } = await supabase.from('progress').select('*')

      if (lp) {
        const result = lp.map(p => {
          const lessonProgress = prog?.filter(pr => pr.path_id === p.id) || []
          const completed = lessonProgress.filter(pr => pr.completed).length
          return { ...p, completed, total: p.roadmap.lessons.length }
        })
        setPaths(result)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="text-gray-400">Cargando...</div>

  const totalCompleted = paths.reduce((acc, p) => acc + p.completed, 0)
  const totalLessons = paths.reduce((acc, p) => acc + p.total, 0)
  const finishedPaths = paths.filter(p => p.completed === p.total && p.total > 0).length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Tu progreso</h1>
      <p className="text-gray-400 mb-8">Resumen de todos tus paths de aprendizaje.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Paths activos</p>
          <p className="text-4xl font-bold text-indigo-400">{paths.length}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Lecciones completadas</p>
          <p className="text-4xl font-bold text-indigo-400">{totalCompleted}<span className="text-gray-500 text-xl">/{totalLessons}</span></p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Paths completados</p>
          <p className="text-4xl font-bold text-green-400">{finishedPaths}</p>
        </div>
      </div>

      <div className="space-y-4">
        {paths.length === 0 && (
          <p className="text-gray-500 text-center py-12">No tienes paths aún. <span className="text-indigo-400 cursor-pointer" onClick={() => router.push('/learn')}>Empieza uno →</span></p>
        )}
        {paths.map(p => {
          const pct = Math.round((p.completed / p.total) * 100)
          const done = p.completed === p.total && p.total > 0
          return (
            <div key={p.id} onClick={() => router.push(`/learn/${p.id}`)}
              className="bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-5 cursor-pointer transition">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-white">{p.roadmap.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full">{p.level}</span>
                    {done && <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">🎉 Completado</span>}
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{p.completed}/{p.total} lecciones</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : 'bg-indigo-600'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}