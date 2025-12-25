function Steps({ t }) {
  return (
    <section className="max-w-6xl mx-auto px-4 mb-8 md:mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 text-center">
        <div className="step-item relative glass h-16 md:h-24 flex items-center justify-start px-6 md:pl-16 rounded-lg md:rounded-none md:first:rounded-l-lg md:last:rounded-r-lg border border-cyan-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold flex items-center justify-center mr-3 text-sm shadow-lg shadow-cyan-500/50">1</div>
          <span className="font-medium flex-1 md:flex-none text-cyan-200">{t('step.1')}</span>
        </div>
        <div className="step-item relative glass h-16 md:h-24 flex items-center justify-start px-6 md:pl-16 rounded-lg md:rounded-none border border-purple-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold flex items-center justify-center mr-3 text-sm shadow-lg shadow-purple-500/50">2</div>
          <span className="font-medium flex-1 md:flex-none text-purple-200">{t('step.2')}</span>
        </div>
        <div className="step-item relative glass h-16 md:h-24 flex items-center justify-start px-6 md:pl-16 rounded-lg md:rounded-none md:last:rounded-r-lg border border-pink-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold flex items-center justify-center mr-3 text-sm shadow-lg shadow-pink-500/50">3</div>
          <span className="font-medium flex-1 md:flex-none text-pink-200">{t('step.3')}</span>
        </div>
      </div>
    </section>
  )
}

export default Steps
