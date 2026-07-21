import { Environment, Float, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { BlenderObject } from './BlenderObject'

export function Experience() {
  const group = useRef<Group>(null)
  const { progress } = useScrollProgress()

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
      <fog attach="fog" args={['#0c1714', 6, 16]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 2]} intensity={1.35} color="#fff4e5" />
      <pointLight position={[-3, 1.5, 2]} intensity={18} color="#7ee0c3" distance={12} />

      <Environment resolution={256}>
        <Lightformer intensity={1.4} position={[0, 4, -2]} scale={[8, 2, 1]} form="rect" color="#d8ff6e" />
        <Lightformer intensity={0.7} position={[-5, 1, 3]} scale={[3, 6, 1]} form="rect" color="#7ee0c3" />
        <Lightformer intensity={0.45} position={[5, -1, 1]} scale={[4, 3, 1]} form="rect" color="#ffffff" />
      </Environment>

      <group ref={group}>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.55}>
          {/* Drop your exported .glb into /public/models/hero.glb */}
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
