'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = [
  { id: 'dev', label: '💻 Desarrollo', topics: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Vue.js', 'Angular', 'PHP', 'Laravel', 'Django', 'FastAPI', 'Go', 'Rust', 'Flutter', 'React Native', 'GraphQL', 'REST APIs'] },
  { id: 'cloud', label: '☁️ Cloud', topics: ['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Serverless', 'Firebase', 'Supabase', 'Cloudflare', 'DigitalOcean', 'Nginx'] },
  { id: 'cyber', label: '🛡️ Ciberseguridad', topics: ['Ethical Hacking', 'OSINT', 'Redes', 'Criptografía', 'CTF', 'Pentesting Web', 'Forense Digital', 'Malware Analysis', 'Burp Suite', 'Metasploit', 'OWASP', 'Active Directory'] },
  { id: 'devops', label: '⚙️ DevOps', topics: ['CI/CD', 'Linux', 'Git', 'Terraform', 'Monitoring', 'Ansible', 'Prometheus', 'Grafana', 'Jenkins', 'GitHub Actions', 'ArgoCD', 'Bash Scripting'] },
  { id: 'data', label: '📊 Data', topics: ['SQL', 'Python Data', 'Machine Learning', 'Power BI', 'PostgreSQL', 'MongoDB', 'Spark', 'Tableau', 'Deep Learning', 'LLMs', 'Data Engineering', 'Airflow'] },
]

const levels = ['Principiante', 'Intermedio', 'Avanzado']

export default function LearnPage() {
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const selectedCategory = categories.find(c => c.id === category)

  const handleGenerate = async () => {
    if (!category || !topic || !level) return
    setLoading(true)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    const res = await fetch('/api/ai/generate-path', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ topic, category, level })
    })
    const data = await res.json()
    if (data.pathId) router.push(`/learn/${data.pathId}`)
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Nueva ruta de aprendizaje</h1>
      <p className="text-gray-400 mb-8">Selecciona categoría, tema y nivel para que la IA genere tu path personalizado.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {categories.map(c => (
          <button key={c.id} onClick={() => { setCategory(c.id); setTopic('') }}
            className={`p-4 rounded-xl border text-sm font-medium transition ${category === c.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-indigo-500'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">Tema</p>
          <div className="flex flex-wrap gap-3">
            {selectedCategory.topics.map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${topic === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-indigo-500'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {topic && (
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">Nivel</p>
          <div className="flex gap-3">
            {levels.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-6 py-2 rounded-lg border text-sm transition ${level === l ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-indigo-500'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {category && topic && level && (
        <button onClick={handleGenerate} disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50">
          {loading ? 'Generando tu path...' : 'Generar path con IA →'}
        </button>
      )}
    </div>
  )
}