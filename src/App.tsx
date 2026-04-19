import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, FileText, BookOpen, Mic, User, LogOut, ArrowUpRight } from 'lucide-react'

// Login Component
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: email.split('@')[0] } }
        })
        if (error) throw error
        alert('Check your email for confirmation!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
        <h1 className="text-2xl font-bold text-center text-primary mb-2">LetMeCheck</h1>
        <p className="text-neutral-500 text-center mb-6">{isSignup ? 'Create your account' : 'Welcome back!'}</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? (isSignup ? 'Creating...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsSignup(!isSignup); setError('') }} className="text-primary font-medium hover:underline">
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}

// Dashboard Component
function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Welcome back! 👋</h1>
        <p className="text-neutral-500 mt-1">Track your career readiness and upskill progress.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['Analyses Run', 'Avg ATS Score', 'Courses Enrolled', 'Interviews Done'].map((label, i) => (
          <div key={label} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${i===1?'text-secondary':i===2?'text-primary':'text-neutral-900'}`}>{i===1?'--':'0'}</p>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-neutral-200 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to check your job readiness?</h2>
        <p className="text-neutral-500 mb-6">Upload your resume and get instant AI-powered feedback.</p>
        <Link to="/analyzer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition">
          Start Analysis <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

// Resume Analyzer Component
function Analyzer() {
  const [jobTitle, setJobTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !jobTitle.trim()) {
      setError('Please upload a resume and enter a job title')
      return
    }
    setLoading(true)
    setError('')
    
    try {
      // Read file content (for demo - in production use server-side parsing)
      const content = await file.text()
      const contentLower = content.toLowerCase()
      
      // Simulated keyword matching
      const targetSkills = ['javascript', 'react', 'typescript', 'css', 'html', 'git', 'node', 'python', 'sql']
      const matched = targetSkills.filter(skill => contentLower.includes(skill))
      const missing = targetSkills.filter(skill => !contentLower.includes(skill)).slice(0, 5)
      
      const skillsScore = Math.round((matched.length / targetSkills.length) * 100)
      const experienceScore = Math.min(90, 50 + Math.floor(Math.random() * 40))
      const keywordsScore = Math.min(95, 60 + Math.floor(Math.random() * 35))
      const educationScore = contentLower.includes('degree') || contentLower.includes('university') ? 85 : 65
      
      const overallScore = Math.round(
        (skillsScore * 0.4) + (experienceScore * 0.25) + (keywordsScore * 0.2) + (educationScore * 0.15)
      )

      setResult({
        score: overallScore,
        breakdown: { skills: skillsScore, experience: experienceScore, keywords: keywordsScore, education: educationScore },
        gaps: missing
      })
    } catch (err: any) {
      setError('Failed to analyze resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Resume Analyzer</h1>
        <p className="text-neutral-500 mt-1">Get an ATS-style score and skill gap analysis.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Target Job Title</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Frontend Developer, Data Analyst"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Upload Resume</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary/50 transition cursor-pointer">
                <input type="file" accept=".txt,.pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="resume-upload" />
                <label htmlFor="resume-upload" className="cursor-pointer block">
                  <p className="text-sm text-neutral-500">{file ? file.name : '📁 Click to upload PDF, DOCX, or TXT'}</p>
                </label>
              </div>
            </div>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 text-center">
              <h3 className="text-sm font-medium text-neutral-500 mb-3">ATS Match Score</h3>
              <div className={`text-5xl font-bold mb-2 ${result.score >= 70 ? 'text-secondary' : result.score >= 50 ? 'text-primary' : 'text-orange-500'}`}>
                {result.score}%
              </div>
              <p className="text-sm text-neutral-600">
                {result.score >= 70 ? '✅ Excellent match!' : result.score >= 50 ? '⚠️ Good match, room for improvement' : '❌ Needs significant improvement'}
              </p>
            </div>
            {result.gaps.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-neutral-200">
                <h3 className="font-semibold mb-3">Skill Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {result.gaps.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Placeholder Components
function Learning() { return (<div className="p-6"><h1 className="text-2xl font-bold">Learning Paths</h1><p className="text-neutral-500 mt-2">Course recommendations coming soon!</p></div>) }
function Interview() { return (<div className="p-6"><h1 className="text-2xl font-bold">Mock Interview</h1><p className="text-neutral-500 mt-2">AI interview practice coming soon!</p></div>) }
function Profile() { return (<div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p className="text-neutral-500 mt-2">Manage your account settings.</p></div>) }

// Layout Component with Sidebar
function Layout({ children, onSignOut }: { children: React.ReactNode, onSignOut: () => void }) {
  const location = useLocation()
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/analyzer', icon: FileText },
    { name: 'Learning', path: '/learning', icon: BookOpen },
    { name: 'Interview', path: '/interview', icon: Mic },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-neutral-200 fixed left-0 top-0">
        <div className="p-6 border-b border-neutral-100">
          <h1 className="text-xl font-bold text-primary">LetMeCheck</h1>
          <p className="text-xs text-neutral-500 mt-1">Career Compass AI</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                <item.icon className="w-5 h-5" />{item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-neutral-100">
          <button onClick={onSignOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-10">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-3 z-50">
        {navItems.slice(0, 4).map((item) => (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? 'text-primary' : 'text-neutral-500'}`}>
            <item.icon className="w-5 h-5" /><span className="text-[10px]">{item.name.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

// Main App Component
export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({  { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
  }

  if (!session) return <Login />

  return (
    <BrowserRouter>
      <Layout onSignOut={handleSignOut}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
