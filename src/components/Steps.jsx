function Steps({ t }) {
  return (
    <section className="max-w-6xl mx-auto px-4 mb-8 md:mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 text-center">
        <div className="step-item relative bg-emerald-50 h-16 md:h-24 flex items-center justify-start px-6 md:pl-16 rounded-lg md:rounded-none md:first:rounded-l-lg md:last:rounded-r-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center mr-3 text-sm">1</div>
          <span className="font-medium flex-1 md:flex-none text-gray-800">{t('step.1')}</span>
        </div>
        <div className="step-item relative bg-emerald-50 h-16 md:h-24 flex items-center justify-start px-6 md:pl-16 rounded-lg md:rounded-none">
          <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center mr-3 text-sm">2</div>
          <span className="font-medium flex-1 md:flex-none text-gray-800">{t('step.2')}</span>
        </div>
        <div className="step-item relative bg-emerald-50 h-16 md:h-24 flex items-center justify-start px-6 md:pl-16 rounded-lg md:rounded-none md:last:rounded-r-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center mr-3 text-sm">3</div>
          <span className="font-medium flex-1 md:flex-none text-gray-800">{t('step.3')}</span>
        </div>
      </div>
    </section>
  )
}

export default Steps
