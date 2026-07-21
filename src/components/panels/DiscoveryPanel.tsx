import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
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
  const position = useMemo(
    () => getPanelWorldPosition(panel.scrollAt, panel.offset),
    [panel.scrollAt, panel.offset],
  )
  const reveal = getPanelReveal(scroll, panel.scrollAt)
  const textOpacity = reveal > 0.52 ? Math.min(1, (reveal - 0.52) / 0.35) : 0
  const isNear = Math.abs(scroll - panel.scrollAt) < PANEL_ZONE * 2.4

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.lookAt(state.camera.position)
  })

  if (!isNear && reveal <= 0.01) return null

  return (
    <group ref={groupRef} position={position}>
      <PanelParticleField reveal={reveal} />

      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.35, 1.45]} />
        <meshBasicMaterial
          transparent
          opacity={0.06 + reveal * 0.14}
          color="#c8ccd4"
          depthWrite={false}
        />
      </mesh>

      <Html
        transform
        center
        distanceFactor={5.8}
        zIndexRange={[40, 0]}
        style={{
          opacity: textOpacity,
          pointerEvents: 'none',
          transition: 'opacity 120ms linear',
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
