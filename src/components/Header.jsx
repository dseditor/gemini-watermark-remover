function Header({ t }) {
  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"></path>
          </svg>
          <h1 className="text-lg font-bold tracking-tight md:text-2xl">
            <span className="bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent">
              Gemini 水印移除工具
            </span>
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
