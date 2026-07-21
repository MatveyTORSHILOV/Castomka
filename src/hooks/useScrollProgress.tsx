import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type ScrollContextValue = {
  progress: number
}

const ScrollProgressContext = createContext<ScrollContextValue>({ progress: 0 })

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = media.matches

    const onPrefChange = () => {
      reduced = media.matches
      if (reduced) setProgress(0)
    }

    const onScroll = () => {
      if (reduced) {
        setProgress(0)
        return
      }

      const max = document.documentElement.scrollHeight - window.innerHeight
      const next = max > 0 ? window.scrollY / max : 0
      setProgress(Math.min(1, Math.max(0, next)))
    }

    media.addEventListener('change', onPrefChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      media.removeEventListener('change', onPrefChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <ScrollProgressContext.Provider value={{ progress }}>
      {children}
    </ScrollProgressContext.Provider>
  )
}

export function useScrollProgress() {
  return useContext(ScrollProgressContext)
}
