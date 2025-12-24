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
        <div className="text-xs text-gray-500">
          <p>{t('info.size')}: {item.originalImg.width}×{item.originalImg.height}</p>
          <p>{t('info.watermark')}: {item.watermarkInfo.size}×{item.watermarkInfo.size}</p>
          <p>{t('info.position')}: ({item.watermarkInfo.position.x},{item.watermarkInfo.position.y})</p>
          {item.originalStatus && !(item.isGoogle && item.isOriginal) && (
            <p className="inline-block mt-1 text-xs md:text-sm text-warn">{item.originalStatus}</p>
          )}
        </div>
      )
    }
    return ''
  }

  return (
    <div id={`card-${item.id}`} className="bg-white md:h-[140px] rounded-xl shadow-card border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap h-full">
        <div className="w-full md:w-auto h-full flex border-b border-gray-100">
          <div className="w-24 md:w-48 flex-shrink-0 bg-gray-50 p-2 flex items-center justify-center">
            {displaySrc && (
              <img
                id={`result-${item.id}`}
                src={displaySrc}
                className="max-w-full max-h-24 md:max-h-full rounded"
                data-zoomable
                alt={item.name}
              />
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 mb-2 truncate">{item.name}</h4>
            <div className="text-xs text-gray-500" id={`status-${item.id}`}>
              {getStatusText()}
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto ml-auto flex-shrink-0 p-2 md:p-4 flex items-center justify-center">
          {item.status === 'completed' && (
            <button
              id={`download-${item.id}`}
              onClick={() => onDownload(item)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs md:text-sm"
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

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 pb-24 scroll-mt-24">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">
          {t('progress.text')}: {processedCount}/{imageQueue.length}
        </h3>
        {processedCount > 0 && (
          <button
            onClick={onDownloadAll}
            className="py-2.5 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>{t('btn.downloadAll')}</span>
          </button>
        )}
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
