import { useSceneInput } from '../hooks/useSceneInput'

export function Overlay() {
  const { scroll } = useSceneInput()

  return (
    <div className="overlay">
      <div className="scroll-track" aria-hidden="true" />
      <div className="progress-rail">
        <span className="progress-fill" style={{ transform: `scaleX(${Math.max(0.02, scroll)})` }} />
      </div>
    </div>
  )
}
