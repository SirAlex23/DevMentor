'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Iniciar sesión</h1>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <input className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 outline-none" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition">
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
      <p className="text-gray-400 text-sm text-center mt-4">¿No tienes cuenta? <Link href="/register" className="text-indigo-400 hover:underline">Regístrate</Link></p>
    </div>
  )
}