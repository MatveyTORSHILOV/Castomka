import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { BlenderObject } from './BlenderObject'

type ExperienceProps = {
  progress: number
}

export function Experience({ progress }: ExperienceProps) {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return

    const targetY = progress * Math.PI * 1.35
    const targetX = Math.sin(progress * Math.PI) * 0.18
    const targetZ = -progress * 0.55
    const targetCamZ = 4.2 - progress * 1.1
    const targetCamY = 0.35 + progress * 0.45

    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 4)
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 4)
    group.current.position.z += (targetZ - group.current.position.z) * Math.min(1, delta * 4)

    state.camera.position.z += (targetCamZ - state.camera.position.z) * Math.min(1, delta * 3.2)
    state.camera.position.y += (targetCamY - state.camera.position.y) * Math.min(1, delta * 3.2)
    state.camera.lookAt(0, 0.1, 0)
  })

  return (
    <>
      <color attach="background" args={['#0c1714']} />
      <fog attach="fog" args={['#0c1714', 7, 18]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#d8ff6e', '#12231f', 0.45]} />
      <directionalLight position={[4, 6, 2]} intensity={1.4} color="#fff4e5" />
      <pointLight position={[-3, 1.5, 2]} intensity={14} color="#7ee0c3" distance={12} />
      <pointLight position={[2.5, -0.5, -1.5]} intensity={8} color="#d8ff6e" distance={10} />

      <group ref={group}>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.55}>
          <BlenderObject url="/models/hero.glb" />
        </Float>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#12231f" roughness={0.92} metalness={0.05} />
      </mesh>
    </>
  )
}
