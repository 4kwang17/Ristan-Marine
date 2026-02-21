'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { translations, type Lang, type Translations } from './translations'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
  t: translations.ko,
})

export function LanguageProvider({
  children,
  defaultLang,
}: {
  children: React.ReactNode
  defaultLang: Lang
}) {
  const [lang, setLangState] = useState<Lang>(defaultLang)

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    // Persist in cookie (1 year) so middleware sees it on next request
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as Translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
