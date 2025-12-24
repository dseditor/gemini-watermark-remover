function Header({ locale, onLanguageSwitch, t }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <svg className="h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z"></path>
          </svg>
          <h1 className="text-sm font-bold tracking-tight text-primary md:text-xl">
            <a href="/" className="hover:text-primary transition-colors" title="Gemini Watermark Remover">
              Gemini <span className="text-gray-700 font-medium">Watermark Remover</span>
            </a>
          </h1>
        </div>
        <nav className="flex gap-2 md:gap-6 text-sm font-medium text-gray-600 items-center">
          <a href="/userscript/gemini-watermark-remover.user.js" target="_blank" className="hidden md:inline-block hover:text-primary transition-colors">
            {t('nav.userscript')}
          </a>
          <a href="https://allenkuo.medium.com/removing-gemini-ai-watermarks-a-deep-dive-into-reverse-alpha-blending-bbbd83af2a3f" target="_blank" className="hidden md:inline-block hover:text-primary transition-colors">
            {t('nav.principle')}
          </a>
          <a href="https://github.com/journey-ad/gemini-watermark-remover" target="_blank" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <button
            onClick={() => onLanguageSwitch(locale === 'zh-CN' ? 'en-US' : 'zh-CN')}
            className="px-3 py-1 text-nowrap border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {locale === 'zh-CN' ? 'EN' : '中文'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
