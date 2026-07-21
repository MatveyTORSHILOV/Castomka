import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { getPanelReveal, PANEL_ZONE } from '../../config/infoPanels'
import type { InfoPanelConfig } from '../../config/infoPanels'
import { getPanelWorldPosition } from '../../utils/cameraPath'
import { PanelParticleField } from './PanelParticleField'

type DiscoveryPanelProps = {
  panel: InfoPanelConfig
  scroll: number
}

export function DiscoveryPanel({ panel, scroll }: DiscoveryPanelProps) {
  const groupRef = useRef<Group>(null)
  const reveal = getPanelReveal(scroll, panel.scrollAt)
  const textOpacity = reveal > 0.45 ? Math.min(1, (reveal - 0.45) / 0.3) : 0
  const isNear = Math.abs(scroll - panel.scrollAt) < PANEL_ZONE * 2.5

  useFrame((state) => {
    if (!groupRef.current) return

    const [x, y, z] = getPanelWorldPosition(scroll, panel.offset)
    groupRef.current.position.set(x, y, z)
    groupRef.current.lookAt(state.camera.position)
  })

  if (!isNear && reveal <= 0.01) return null

  return (
    <group ref={groupRef}>
      <PanelParticleField reveal={reveal} />

      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.6, 1.65]} />
        <meshBasicMaterial
          transparent
          opacity={0.08 + reveal * 0.18}
          color="#d0d4dc"
          depthWrite={false}
        />
      </mesh>

      <Html
        transform
        center
        distanceFactor={3.6}
        zIndexRange={[100, 0]}
        style={{
          opacity: textOpacity,
          pointerEvents: 'none',
        }}
      >
        <article className="pixel-panel">
          <span className="pixel-panel__tag">{panel.tag}</span>
          <h2 className="pixel-panel__title">{panel.title}</h2>
          <p className="pixel-panel__body">{panel.body}</p>
        </article>
      </Html>
    </group>
  )
}
