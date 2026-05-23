# 🧠 DevMentor

**Tu tutor de tecnología personalizado con IA**

DevMentor es una plataforma de aprendizaje que genera rutas personalizadas para desarrolladores usando Inteligencia Artificial. Selecciona tu categoría, tema y nivel — la IA crea un roadmap completo con lecciones interactivas y un tutor disponible 24/7.

---

## ✨ Características

- 🤖 **Paths generados por IA** — Groq/Llama genera roadmaps personalizados según tu nivel
- 💬 **Chat interactivo por lección** — Tutor IA que responde tus preguntas en tiempo real
- 📊 **Seguimiento de progreso** — Dashboard con stats, checks verdes y barra de progreso
- 🔐 **Autenticación completa** — Registro, login y logout con Supabase Auth
- 🎯 **5 categorías, +50 temas** — Desarrollo, Cloud, Ciberseguridad, DevOps y Data
- 📱 **3 niveles por tema** — Principiante, Intermedio y Avanzado

---

## 🗂️ Categorías disponibles

| Categoría | Temas |
|-----------|-------|
| 💻 Desarrollo | JavaScript, TypeScript, React, Next.js, Node.js, Python, Vue.js, Django, Go, Rust... |
| ☁️ Cloud | AWS, Google Cloud, Azure, Docker, Kubernetes, Firebase, Supabase... |
| 🛡️ Ciberseguridad | Ethical Hacking, OSINT, Pentesting Web, Burp Suite, OWASP, CTF... |
| ⚙️ DevOps | CI/CD, Linux, Git, Terraform, GitHub Actions, Prometheus, Grafana... |
| 📊 Data | SQL, Machine Learning, LLMs, Deep Learning, MongoDB, Airflow... |

---

## 🛠️ Stack técnico

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge&logo=groq&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

- **Frontend/Backend:** Next.js 14 + TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos + Auth:** Supabase (PostgreSQL)
- **IA:** Groq API con modelo Llama 3.3 70B
- **Deploy:** Vercel

---

## 🚀 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/SirAlex23/DevMentor.git
cd DevMentor/devmentor

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Añade tus keys de Supabase y Groq

# Iniciar en desarrollo
npm run dev
```

---

## 🔑 Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
GROQ_API_KEY=tu_groq_api_key
```

---

## 👤 Autor

**Alejandro Juan Crespo Correa**  
Desarrollador Full Stack Junior · Valencia, España  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/alejandro-crespo-574958388)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SirAlex23)

---

## 📄 Licencia

MIT License — libre para usar y modificar.
