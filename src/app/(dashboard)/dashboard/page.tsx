'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [stats, setStats] = useState({ paths: 0, completed: 0, total: 0 })
  const [username, setUsername] = useState('')
  const [recentPaths, setRecentPaths] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
      if (profile?.username) setUsername(profile.username)

      const { data: lp } = await supabase.from('learning_paths').select('*').order('created_at', { ascending: false })
      const { data: prog } = await supabase.from('progress').select('*')

      if (lp) {
        setRecentPaths(lp.slice(0, 3).map(p => {
          const lessonProg = prog?.filter(pr => pr.path_id === p.id) || []
          return { ...p, completed: lessonProg.filter(pr => pr.completed).length, total: p.roadmap.lessons.length }
        }))
        setStats({
          paths: lp.length,
          completed: prog?.filter(pr => pr.completed).length || 0,
          total: lp.reduce((acc, p) => acc + p.roadmap.lessons.length, 0)
        })
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        {username ? `Hola, ${username} 👋` : 'Bienvenido a DevMentor 🚀'}
      </h1>
      <p className="text-gray-400 mb-8">Continúa aprendiendo donde lo dejaste.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Paths activos</p>
          <p className="text-4xl font-bold text-indigo-400">{stats.paths}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Lecciones completadas</p>
          <p className="text-4xl font-bold text-indigo-400">{stats.completed}<span className="text-gray-500 text-xl">/{stats.total}</span></p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Progreso global</p>
          <p className="text-4xl font-bold text-indigo-400">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      {recentPaths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Continuar aprendiendo</h2>
          <div className="space-y-3">
            {recentPaths.map(p => {
              const pct = Math.round((p.completed / p.total) * 100)
              return (
                <div key={p.id} onClick={() => router.push(`/learn/${p.id}`)}
                  className="bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-4 cursor-pointer transition">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-white">{p.roadmap.title}</p>
                    <span className="text-gray-400 text-sm">{p.completed}/{p.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
        <h2 className="text-xl font-semibold mb-3">¿Listo para aprender algo nuevo?</h2>
        <p className="text-gray-400 mb-6">Crea un nuevo path de aprendizaje personalizado con IA.</p>
        <button onClick={() => router.push('/learn')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition">
          Empezar a aprender →
        </button>
      </div>
    </div>
  )
}