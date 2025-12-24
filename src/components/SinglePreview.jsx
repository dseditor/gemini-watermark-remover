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
  const statusColor = item.isGoogle && item.isOriginal ? 'text-success' : 'text-warn'

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>{t('preview.original')}</span>
              </h3>
              {item.watermarkInfo && (
                <span className="text-xs text-gray-400 font-mono">
                  {item.originalImg.width}×{item.originalImg.height}
                </span>
              )}
            </div>
            <div className="h-[200px] md:h-[500px] p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmRmZCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjJmMmYyIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4=')]">
              <img src={originalSrc} className="max-w-full max-h-full mx-auto rounded-lg shadow-sm block" data-zoomable alt="Original" />
            </div>
          </div>

          {processedSrc && (
            <div id="processedSection" className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100 ring-4 ring-emerald-50 scroll-mt-24">
              <div className="bg-emerald-50/50 px-6 py-3 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span>{t('preview.result')}</span>
                </h3>
                {item.watermarkInfo && (
                  <span className="text-xs text-emerald-600 font-mono">
                    {item.originalImg.width}×{item.originalImg.height}
                  </span>
                )}
              </div>
              <div className="h-[200px] md:h-[500px] p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmRmZCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjJmMmYyIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMmYyZjIiLz48L3N2Zz4=')]">
                <img src={processedSrc} className="max-w-full max-h-full mx-auto rounded-lg shadow-sm block" data-zoomable alt="Processed" />
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h4 className="text-lg font-bold text-gray-900 mb-6">{t('panel.title')}</h4>

            <div className="space-y-3">
              {processedSrc && (
                <button
                  onClick={() => onDownload(item)}
                  className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <span>{t('btn.download')}</span>
                </button>
              )}

              <button
                onClick={onReset}
                className="w-full py-3.5 px-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
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
