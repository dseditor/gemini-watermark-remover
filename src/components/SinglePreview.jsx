import { useEffect } from 'react'

function SinglePreview({ item, onDownload, onReset, t }) {
  useEffect(() => {
    if (item.status === 'completed') {
      const section = document.getElementById('processedSection')
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [item.status])

  if (!item.originalImg) return null

  const originalSrc = item.originalImg.src
  const processedSrc = item.processedBlob ? URL.createObjectURL(item.processedBlob) : null
  const statusColor = item.isGoogle && item.isOriginal ? 'text-green-400' : 'text-yellow-400'

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="glass card-glass rounded-2xl overflow-hidden border border-cyan-500/20">
            <div className="glass-dark px-6 py-3 border-b border-cyan-500/20 flex justify-between items-center">
              <h3 className="font-semibold text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>{t('preview.original')}</span>
              </h3>
              {item.watermarkInfo && (
                <span className="text-xs text-cyan-400/60 font-mono">
                  {item.originalImg.width}×{item.originalImg.height}
                </span>
              )}
            </div>
            <div className="h-[200px] md:h-[500px] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <img src={originalSrc} className="max-w-full max-h-full mx-auto rounded-lg shadow-lg border border-cyan-400/20 block" data-zoomable alt="Original" />
            </div>
          </div>

          {processedSrc && (
            <div id="processedSection" className="glass card-glass rounded-2xl overflow-hidden border-2 border-cyan-400/50 ring-4 ring-cyan-500/20 scroll-mt-24">
              <div className="glass-dark px-6 py-3 border-b border-cyan-400/30 flex justify-between items-center">
                <h3 className="font-semibold text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{t('preview.result')}</span>
                </h3>
                {item.watermarkInfo && (
                  <span className="text-xs text-cyan-400 font-mono">
                    {item.originalImg.width}×{item.originalImg.height}
                  </span>
                )}
              </div>
              <div className="h-[200px] md:h-[500px] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <img src={processedSrc} className="max-w-full max-h-full mx-auto rounded-lg shadow-lg border border-cyan-400/20 block" data-zoomable alt="Processed" />
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="glass card-glass rounded-2xl border border-cyan-500/30 p-6 sticky top-24">
            <h4 className="text-lg font-bold bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent mb-6">{t('panel.title')}</h4>

            <div className="space-y-3">
              {processedSrc && (
                <button
                  onClick={() => onDownload(item)}
                  className="btn-neon w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <span>{t('btn.download')}</span>
                </button>
              )}

              <button
                onClick={onReset}
                className="w-full py-3.5 px-4 glass border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-400/50 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>{t('btn.reset')}</span>
              </button>
            </div>

            {item.originalStatus && (
              <div className={`mt-6 text-sm ${statusColor} min-h-[1.25rem]`}>
                {item.originalStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SinglePreview
