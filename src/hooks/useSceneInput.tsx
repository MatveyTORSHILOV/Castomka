import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type PointerState = {
  x: number
  y: number
}

type SceneInputValue = {
  scroll: number
  pointer: PointerState
}

const SceneInputContext = createContext<SceneInputValue>({
  scroll: 0,
  pointer: { x: 0, y: 0 },
})

export function SceneInputProvider({ children }: { children: ReactNode }) {
  const [scroll, setScroll] = useState(0)
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 })
  const target = useRef<PointerState>({ x: 0, y: 0 })
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = media.matches

    const onPrefChange = () => {
      reduced = media.matches
      if (reduced) {
        target.current = { x: 0, y: 0 }
        setPointer({ x: 0, y: 0 })
        setScroll(0)
      }
    }

    const onScroll = () => {
      if (reduced) {
        setScroll(0)
        return
      }

      const max = document.documentElement.scrollHeight - window.innerHeight
      const next = max > 0 ? window.scrollY / max : 0
      setScroll(Math.min(1, Math.max(0, next)))
    }

    const onPointerMove = (event: PointerEvent) => {
      if (reduced) return

      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      target.current = { x, y: -y }
    }

    const onPointerLeave = () => {
      target.current = { x: 0, y: 0 }
    }

    const tick = () => {
      setPointer((current) => {
        const nextX = current.x + (target.current.x - current.x) * 0.08
        const nextY = current.y + (target.current.y - current.y) * 0.08
        return { x: nextX, y: nextY }
      })
      frame.current = requestAnimationFrame(tick)
    }

    media.addEventListener('change', onPrefChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    onScroll()
    frame.current = requestAnimationFrame(tick)

    return () => {
      media.removeEventListener('change', onPrefChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <SceneInputContext.Provider value={{ scroll, pointer }}>
      {children}
    </SceneInputContext.Provider>
  )
}

export function useSceneInput() {
  return useContext(SceneInputContext)
}
