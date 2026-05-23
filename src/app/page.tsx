import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-bold text-indigo-400">DevMentor</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white text-sm transition">Iniciar sesión</Link>
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition">Empezar gratis</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <span className="text-xs bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full mb-6 inline-block">IA + Aprendizaje personalizado</span>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Tu tutor de tecnología<br />
          <span className="text-indigo-400">personalizado con IA</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          DevMentor genera rutas de aprendizaje personalizadas para Dev, Cloud, Ciberseguridad, DevOps y Data. Aprende a tu ritmo con un tutor IA disponible 24/7.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition text-lg">
            Empezar gratis →
          </Link>
          <Link href="/login" className="border border-gray-700 hover:border-indigo-500 text-gray-300 font-semibold px-8 py-4 rounded-xl transition text-lg">
            Iniciar sesión
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'Rutas generadas por IA', desc: 'La IA analiza tu nivel y genera un roadmap personalizado con lecciones progresivas.' },
            { icon: '💬', title: 'Chat interactivo', desc: 'Pregunta lo que quieras en cada lección. Tu tutor IA responde al instante.' },
            { icon: '📊', title: 'Seguimiento de progreso', desc: 'Visualiza tu avance, lecciones completadas y paths activos en tiempo real.' },
          ].map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8">Categorías disponibles</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['💻 Desarrollo', '☁️ Cloud', '🛡️ Ciberseguridad', '⚙️ DevOps', '📊 Data'].map(c => (
            <span key={c} className="bg-gray-900 border border-gray-800 px-5 py-2 rounded-full text-sm text-gray-300">{c}</span>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 px-8 py-6 text-center text-gray-500 text-sm">
        DevMentor © 2026 — Construido con Next.js, Supabase y Groq
      </footer>
    </div>
  )
}