import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Experience } from './components/Experience'
import { Overlay } from './components/Overlay'
import { ScrollProgressProvider } from './hooks/useScrollProgress'

export default function App() {
  return (
    <ScrollProgressProvider>
      <div className="app-shell">
        <div className="canvas-layer" aria-hidden="true">
          <Canvas
            camera={{ position: [0, 0.35, 4.2], fov: 42, near: 0.1, far: 100 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </div>
        <Overlay />
      </div>
    </ScrollProgressProvider>
  )
}
