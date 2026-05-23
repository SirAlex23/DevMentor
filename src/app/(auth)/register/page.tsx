'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, username })
    }
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Crear cuenta</h1>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <input className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 outline-none" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition">
        {loading ? 'Cargando...' : 'Registrarse'}
      </button>
      <p className="text-gray-400 text-sm text-center mt-4">¿Ya tienes cuenta? <Link href="/login" className="text-indigo-400 hover:underline">Inicia sesión</Link></p>
    </div>
  )
}