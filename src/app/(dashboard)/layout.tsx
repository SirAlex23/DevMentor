'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-indigo-400">DevMentor</Link>
        <div className="flex gap-6 text-sm text-gray-400 items-center">
          <Link href="/dashboard" className="hover:text-white transition">Inicio</Link>
          <Link href="/learn" className="hover:text-white transition">Aprender</Link>
          <Link href="/progress" className="hover:text-white transition">Progreso</Link>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">Cerrar sesión</button>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}