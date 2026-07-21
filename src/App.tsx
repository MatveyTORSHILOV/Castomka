import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { sceneConfig } from './config/scene'
import { Experience } from './components/Experience'
import { Overlay } from './components/Overlay'
import { PlaceholderObject } from './components/PlaceholderObject'
import { SceneErrorBoundary } from './components/SceneErrorBoundary'
import { useSceneInput } from './hooks/useSceneInput'

function Scene() {
  const { scroll, pointer } = useSceneInput()

  return (
    <SceneErrorBoundary fallback={<PlaceholderObject />}>
      <Suspense fallback={<PlaceholderObject />}>
        <Experience scroll={scroll} pointer={pointer} />
      </Suspense>
    </SceneErrorBoundary>
  )
}

export default function App() {
  const { start, fov, near, far } = sceneConfig.camera

  return (
    <div className="app-shell">
      <div className="canvas-layer">
        <Canvas
          camera={{
            position: start.position,
            fov,
            near,
            far,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
        >
          <Scene />
        </Canvas>
      </div>
      <Overlay />
    </div>
  )
}
