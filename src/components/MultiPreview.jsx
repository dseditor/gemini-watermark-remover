import { useEffect, useRef } from 'react'

function ImageCard({ item, onDownload, t }) {
  const originalSrc = item.originalImg?.src
  const processedSrc = item.processedBlob ? URL.createObjectURL(item.processedBlob) : null
  const displaySrc = processedSrc || originalSrc

  const getStatusText = () => {
    if (item.status === 'pending') return t('status.pending')
    if (item.status === 'processing') return t('status.processing')
    if (item.status === 'error') return t('status.failed')
    if (item.status === 'completed' && item.watermarkInfo) {
      return (
        <div className="text-xs text-cyan-300/70">
          <p>{t('info.size')}: {item.originalImg.width}×{item.originalImg.height}</p>
          <p>{t('info.watermark')}: {item.watermarkInfo.size}×{item.watermarkInfo.size}</p>
          <p>{t('info.position')}: ({item.watermarkInfo.position.x},{item.watermarkInfo.position.y})</p>
          {item.originalStatus && !(item.isGoogle && item.isOriginal) && (
            <p className="inline-block mt-1 text-xs md:text-sm text-yellow-400">{item.originalStatus}</p>
          )}
        </div>
      )
    }
    return ''
  }

  return (
    <div id={`card-${item.id}`} className="glass card-glass md:h-[140px] rounded-xl border border-cyan-500/20 overflow-hidden">
      <div className="flex flex-wrap h-full">
        <div className="w-full md:w-auto h-full flex border-b md:border-b-0 md:border-r border-cyan-500/20">
          <div className="w-24 md:w-48 flex-shrink-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-2 flex items-center justify-center">
            {displaySrc && (
              <img
                id={`result-${item.id}`}
                src={displaySrc}
                className="max-w-full max-h-24 md:max-h-full rounded border border-cyan-400/20"
                data-zoomable
                alt={item.name}
              />
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col min-w-0">
            <h4 className="font-semibold text-sm text-cyan-200 mb-2 truncate">{item.name}</h4>
            <div className="text-xs text-cyan-300/70" id={`status-${item.id}`}>
              {getStatusText()}
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto ml-auto flex-shrink-0 p-2 md:p-4 flex items-center justify-center">
          {item.status === 'completed' && (
            <button
              id={`download-${item.id}`}
              onClick={() => onDownload(item)}
              className="btn-neon px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg text-xs md:text-sm font-medium"
            >
              {t('btn.download')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function MultiPreview({ imageQueue, processedCount, onDownload, onDownloadAll, t }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && imageQueue.length > 0) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [imageQueue.length])

  const progressPercent = (processedCount / imageQueue.length) * 100

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 pb-24 scroll-mt-24">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent">
            {t('progress.text')}: {processedCount}/{imageQueue.length}
          </h3>
          {processedCount > 0 && (
            <button
              onClick={onDownloadAll}
              className="btn-neon py-2.5 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>{t('btn.downloadAll')}</span>
            </button>
          )}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            className="progress-neon h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="space-y-4">
        {imageQueue.map(item => (
          <ImageCard key={item.id} item={item} onDownload={onDownload} t={t} />
        ))}
      </div>
    </section>
  )
}

export default MultiPreview
