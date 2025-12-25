import { useState, useEffect, useRef } from 'react'
import { WatermarkEngine } from './core/watermarkEngine.js'
import { loadImage, checkOriginal, getOriginalStatus } from './utils.js'
import { useI18n } from './hooks/useI18n.js'
import JSZip from 'jszip'
import mediumZoom from 'medium-zoom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import UploadArea from './components/UploadArea.jsx'
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

    // Create descriptive filename with date and count
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    a.download = `gemini_unwatermarked_${completed.length}張_${date}.zip`

    a.click()

    // Clean up URL object
    setTimeout(() => URL.revokeObjectURL(a.href), 100)
  }

  if (i18nLoading) {
    return <LoadingOverlay show={true} text={t('status.loading')} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header t={t} />

      <main className="flex-grow">
        <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 text-center px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <h2 className="bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-extrabold mb-6 md:text-6xl text-3xl text-transparent tracking-tighter gradient-animate neon-text">
            {t('main.title')}
          </h2>
          <p className="text-base md:text-lg text-cyan-100/80 max-w-2xl mx-auto mb-10">
            {t('main.subtitle')}
          </p>

          <UploadArea onFilesSelected={handleFiles} t={t} />
        </section>

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
      </main>

      <Footer t={t} />

      <LoadingOverlay show={loading} text={loadingText} />
    </div>
  )
}

export default App
