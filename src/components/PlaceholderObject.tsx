import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import * as THREE from 'three'

/** Stand-in geometry until you drop a Blender .glb into /public/models/hero.glb */
export function PlaceholderObject() {
  const core = useRef<Mesh>(null)
  const ring = useRef<Mesh>(null)

  const materials = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({
        color: '#d8ff6e',
        metalness: 0.55,
        roughness: 0.22,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25,
      }),
      accent: new THREE.MeshPhysicalMaterial({
        color: '#7ee0c3',
        metalness: 0.35,
        roughness: 0.18,
        transmission: 0.15,
        thickness: 0.6,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: '#1a2e29',
        metalness: 0.8,
        roughness: 0.35,
      }),
    }),
    [],
  )

  useFrame((_, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.35
    if (ring.current) ring.current.rotation.z -= delta * 0.55
  })

  return (
    <group>
      <mesh ref={core} material={materials.body} castShadow>
        <icosahedronGeometry args={[0.95, 1]} />
      </mesh>

      <mesh position={[0, 0, 0]} material={materials.accent} castShadow>
        <torusGeometry args={[1.35, 0.08, 24, 96]} />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2.4, 0.4, 0]} material={materials.dark} castShadow>
        <torusGeometry args={[1.7, 0.035, 16, 100]} />
      </mesh>

      <mesh position={[1.15, 0.55, 0.35]} material={materials.accent} castShadow>
        <sphereGeometry args={[0.18, 24, 24]} />
      </mesh>
      <mesh position={[-0.95, -0.45, 0.55]} material={materials.body} castShadow>
        <octahedronGeometry args={[0.22, 0]} />
      </mesh>
    </group>
  )
}
