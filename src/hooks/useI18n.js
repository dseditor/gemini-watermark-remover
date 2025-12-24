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
      const res = await fetch(`/i18n/${newLocale}.json?_=${Date.now()}`)
      const data = await res.json()
      setTranslations(data)
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
      if (data.title) {
        document.title = data.title
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load translations:', error)
      setIsLoading(false)
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
