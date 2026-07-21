import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { InstancedMesh, MeshBasicMaterial, Object3D } from 'three'
import { easeOutCubic } from '../../config/infoPanels'

type PanelParticleFieldProps = {
  reveal: number
  width?: number
  height?: number
  particleCount?: number
}

type ParticleLayout = {
  grid: Float32Array
  scatter: Float32Array
}

const tempObject = new Object3D()

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildParticles(width: number, height: number, count: number): ParticleLayout {
  const grid = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const cols = Math.ceil(Math.sqrt(count * (width / height)))
  const rows = Math.ceil(count / cols)
  const rand = mulberry32(90210)

  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const u = cols <= 1 ? 0.5 : col / (cols - 1)
    const v = rows <= 1 ? 0.5 : row / (rows - 1)

    const gx = (u - 0.5) * width
    const gy = (v - 0.5) * height
    const gz = 0

    const angle = rand() * Math.PI * 2
    const radius = 0.35 + rand() * 1.65
    const sx = gx + Math.cos(angle) * radius
    const sy = gy + Math.sin(angle) * radius
    const sz = (rand() - 0.5) * 1.4

    const idx = i * 3
    grid[idx] = gx
    grid[idx + 1] = gy
    grid[idx + 2] = gz

    scatter[idx] = sx
    scatter[idx + 1] = sy
    scatter[idx + 2] = sz
  }

  return { grid, scatter }
}

export function PanelParticleField({
  reveal,
  width = 2.35,
  height = 1.45,
  particleCount = 360,
}: PanelParticleFieldProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const revealRef = useRef(0)
  const layout = useMemo(
    () => buildParticles(width, height, particleCount),
    [width, height, particleCount],
  )

  useLayoutEffect(() => {
    revealRef.current = reveal
  }, [reveal])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    revealRef.current += (reveal - revealRef.current) * Math.min(1, delta * 5.5)
    const t = easeOutCubic(revealRef.current)

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3
      const gx = layout.grid[idx]
      const gy = layout.grid[idx + 1]
      const gz = layout.grid[idx + 2]
      const sx = layout.scatter[idx]
      const sy = layout.scatter[idx + 1]
      const sz = layout.scatter[idx + 2]

      tempObject.position.set(
        sx + (gx - sx) * t,
        sy + (gy - sy) * t,
        sz + (gz - sz) * t,
      )
      tempObject.scale.setScalar(0.018 + t * 0.02)
      tempObject.updateMatrix()
      mesh.setMatrixAt(i, tempObject.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true

    const material = mesh.material as MeshBasicMaterial
    material.opacity = 0.08 + t * 0.72
    material.color.setRGB(0.82 + t * 0.18, 0.84 + t * 0.16, 0.88 + t * 0.12)
  })

  if (reveal <= 0.001 && revealRef.current <= 0.001) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial transparent opacity={0.5} color="#d8dde8" depthWrite={false} />
    </instancedMesh>
  )
}
