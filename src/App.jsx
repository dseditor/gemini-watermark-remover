import { useState, useEffect, useRef } from 'react'
import { WatermarkEngine } from './core/watermarkEngine.js'
import { loadImage, checkOriginal, getOriginalStatus } from './utils.js'
import { useI18n } from './hooks/useI18n.js'
import JSZip from 'jszip'
import mediumZoom from 'medium-zoom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import UploadArea from './components/UploadArea.jsx'
import Steps from './components/Steps.jsx'
import SinglePreview from './components/SinglePreview.jsx'
import MultiPreview from './components/MultiPreview.jsx'
import LoadingOverlay from './components/LoadingOverlay.jsx'

function App() {
  const { t, locale, switchLocale, isLoading: i18nLoading } = useI18n()
  const [engine, setEngine] = useState(null)
  const [imageQueue, setImageQueue] = useState([])
  const [processedCount, setProcessedCount] = useState(0)
  const [showSingle, setShowSingle] = useState(false)
  const [showMulti, setShowMulti] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const zoomRef = useRef(null)
  const engineInitialized = useRef(false)

  useEffect(() => {
    async function initEngine() {
      // Prevent re-initialization
      if (engineInitialized.current) {
        console.log('[App] Engine already initialized, skipping...')
        return
      }

      try {
        setLoading(true)
        setLoadingText('正在加载资源...')
        console.log('[App] 开始初始化 WatermarkEngine...')

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('资源加载超时（10秒），请检查网络连接')), 10000)
        )

        const engineInstance = await Promise.race([
          WatermarkEngine.create(),
          timeoutPromise
        ])

        console.log('[App] WatermarkEngine 初始化成功')
        setEngine(engineInstance)
        engineInitialized.current = true
        setLoading(false)

        // Initialize medium-zoom
        zoomRef.current = mediumZoom('[data-zoomable]', {
          margin: 24,
          scrollOffset: 0,
          background: 'rgba(255, 255, 255, .6)',
        })
      } catch (error) {
        setLoading(false)
        console.error('[App] 初始化错误：', error)
        alert(`初始化失败: ${error.message}\n\n请刷新页面重试，或按 F12 打开浏览器控制台查看详细错误信息。`)
      }
    }

    if (!i18nLoading && !engineInitialized.current) {
      initEngine()
    }
  }, [i18nLoading])

  const handleFiles = async (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.match('image/(jpeg|png|webp)')) return false
      if (file.size > 20 * 1024 * 1024) return false
      return true
    })

    if (validFiles.length === 0) return

    const queue = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      status: 'pending',
      originalImg: null,
      processedBlob: null,
      watermarkInfo: null,
      originalStatus: '',
      isGoogle: false,
      isOriginal: false
    }))

    setImageQueue(queue)
    setProcessedCount(0)

    if (validFiles.length === 1) {
      setShowSingle(true)
      setShowMulti(false)
      await processSingle(queue[0])
    } else {
      setShowSingle(false)
      setShowMulti(true)
      await processQueue(queue)
    }
  }

  const processSingle = async (item) => {
    if (!engine) return

    try {
      const img = await loadImage(item.file)
      item.originalImg = img

      const { is_google, is_original } = await checkOriginal(item.file)
      item.isGoogle = is_google
      item.isOriginal = is_original
      item.originalStatus = getOriginalStatus({ is_google, is_original })

      const watermarkInfo = engine.getWatermarkInfo(img.width, img.height)
      item.watermarkInfo = watermarkInfo

      const result = await engine.removeWatermarkFromImage(img)
      const blob = await new Promise(resolve => result.toBlob(resolve, 'image/png'))
      item.processedBlob = blob
      item.status = 'completed'

      setImageQueue([item])

      // Update zoom
      setTimeout(() => {
        zoomRef.current?.detach()
        zoomRef.current?.attach('[data-zoomable]')
      }, 100)
    } catch (error) {
      console.error(error)
      item.status = 'error'
      setImageQueue([item])
    }
  }

  const processQueue = async (queue) => {
    if (!engine) return

    // First load all images
    for (const item of queue) {
      const img = await loadImage(item.file)
      item.originalImg = img
    }

    setImageQueue([...queue])

    // Then process them
    let completed = 0
    for (const item of queue) {
      if (item.status !== 'pending') continue

      item.status = 'processing'
      setImageQueue([...queue])

      try {
        const result = await engine.removeWatermarkFromImage(item.originalImg)
        const blob = await new Promise(resolve => result.toBlob(resolve, 'image/png'))
        item.processedBlob = blob

        item.status = 'completed'
        const watermarkInfo = engine.getWatermarkInfo(item.originalImg.width, item.originalImg.height)
        item.watermarkInfo = watermarkInfo

        const { is_google, is_original } = await checkOriginal(item.file)
        item.isGoogle = is_google
        item.isOriginal = is_original
        item.originalStatus = getOriginalStatus({ is_google, is_original })

        completed++
        setProcessedCount(completed)
        setImageQueue([...queue])
      } catch (error) {
        item.status = 'error'
        setImageQueue([...queue])
        console.error(error)
      }
    }

    // Update zoom after processing
    setTimeout(() => {
      zoomRef.current?.detach()
      zoomRef.current?.attach('[data-zoomable]')
    }, 100)
  }

  const reset = () => {
    setShowSingle(false)
    setShowMulti(false)
    setImageQueue([])
    setProcessedCount(0)
  }

  const downloadImage = (item) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(item.processedBlob)
    a.download = `unwatermarked_${item.name.replace(/\.[^.]+$/, '')}.png`
    a.click()
  }

  const downloadAll = async () => {
    const completed = imageQueue.filter(item => item.status === 'completed')
    if (completed.length === 0) return

    const zip = new JSZip()
    completed.forEach(item => {
      const filename = `unwatermarked_${item.name.replace(/\.[^.]+$/, '')}.png`
      zip.file(filename, item.processedBlob)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `unwatermarked_${Date.now()}.zip`
    a.click()
  }

  if (i18nLoading) {
    return <LoadingOverlay show={true} text={t('status.loading')} />
  }

  return (
    <div className="bg-white text-gray-800 antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen">
      <Header locale={locale} onLanguageSwitch={switchLocale} t={t} />

      <main className="flex-grow">
        <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 text-center px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-white to-white -z-10"></div>

          <h2 className="bg-clip-text bg-gradient-to-br font-extrabold from-slate-900 mb-6 md:text-6xl text-3xl text-transparent to-slate-700 tracking-tighter">
            {t('main.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            {t('main.subtitle')}
          </p>

          <UploadArea onFilesSelected={handleFiles} t={t} />
        </section>

        <Steps t={t} />

        {showSingle && imageQueue.length > 0 && (
          <SinglePreview
            item={imageQueue[0]}
            onDownload={downloadImage}
            onReset={reset}
            t={t}
          />
        )}

        {showMulti && (
          <MultiPreview
            imageQueue={imageQueue}
            processedCount={processedCount}
            onDownload={downloadImage}
            onDownloadAll={downloadAll}
            t={t}
          />
        )}

        <section className="bg-gray-50 py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 md:mb-12">
              <h3 className="text-2xl font-bold text-gray-900">{t('feature.title')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 text-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{t('feature.speed.title')}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{t('feature.speed.desc')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{t('feature.privacy.title')}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{t('feature.privacy.desc')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z M6 6l12 12"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{t('feature.free.title')}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{t('feature.free.desc')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} />

      <LoadingOverlay show={loading} text={loadingText} />
    </div>
  )
}

export default App
