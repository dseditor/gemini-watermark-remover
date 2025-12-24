import { useState, useEffect } from 'react'

export function useI18n() {
  const [locale, setLocale] = useState(
    localStorage.getItem('locale') || (navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US')
  )
  const [translations, setTranslations] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTranslations(locale)
  }, [locale])

  const loadTranslations = async (newLocale) => {
    try {
      setIsLoading(true)
      console.log(`[useI18n] 开始加载语言文件: /i18n/${newLocale}.json`)

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('语言文件加载超时')), 5000)
      )

      const fetchPromise = fetch(`/i18n/${newLocale}.json?_=${Date.now()}`)

      const res = await Promise.race([fetchPromise, timeoutPromise])

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log(`[useI18n] 语言文件加载成功，共 ${Object.keys(data).length} 个翻译项`)

      setTranslations(data)
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
      if (data.title) {
        document.title = data.title
      }
      setIsLoading(false)
    } catch (error) {
      console.error('[useI18n] 语言文件加载失败:', error)
      // Provide fallback translations
      const fallback = {
        'status.loading': '正在加载资源...',
        'main.title': 'Gemini AI 图像去水印',
        'main.subtitle': '基于反向 Alpha 混合算法，纯浏览器本地处理，免费、极速、无损'
      }
      setTranslations(fallback)
      setIsLoading(false)
      alert(`语言文件加载失败: ${error.message}\n\n将使用默认语言。请检查网络连接或刷新页面重试。`)
    }
  }

  const t = (key) => {
    return translations[key] || key
  }

  const switchLocale = async (newLocale) => {
    setLocale(newLocale)
  }

  return { t, locale, switchLocale, isLoading }
}
