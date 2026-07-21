import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box3, Group, Mesh, Vector3 } from 'three'
import { sceneConfig } from '../config/scene'
import { PlaceholderObject } from './PlaceholderObject'
import { SceneErrorBoundary } from './SceneErrorBoundary'

type BlenderObjectProps = {
  url: string
  scale?: number
  offset?: [number, number, number]
  playAnimations?: boolean
  onBounds?: (size: Vector3) => void
}

async function isGlbAvailable(url: string) {
  try {
    const response = await fetch(url, { method: 'GET', cache: 'no-store' })

    if (!response.ok) return false

    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('text/html')) return false

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength < 12) return false

    const magic = new TextDecoder().decode(new Uint8Array(buffer, 0, 4))
    return magic === 'glTF'
  } catch {
    return false
  }
}

export function BlenderObject({
  url,
  scale = sceneConfig.model.scale,
  offset = sceneConfig.model.offset,
  playAnimations = sceneConfig.model.playAnimations,
  onBounds,
}: BlenderObjectProps) {
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    isGlbAvailable(url).then((ok) => {
      if (!cancelled) setAvailable(ok)
    })

    return () => {
      cancelled = true
    }
  }, [url])

  if (available === null || !available) {
    return <PlaceholderObject />
  }

  return (
    <SceneErrorBoundary fallback={<PlaceholderObject />}>
      <GltfModel
        url={url}
        scale={scale}
        offset={offset}
        playAnimations={playAnimations}
        onBounds={onBounds}
      />
    </SceneErrorBoundary>
  )
}

function GltfModel({
  url,
  scale,
  offset,
  playAnimations,
  onBounds,
}: {
  url: string
  scale: number
  offset: [number, number, number]
  playAnimations: boolean
  onBounds?: (size: Vector3) => void
}) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    cloned.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })

    const box = new Box3().setFromObject(cloned)
    const size = box.getSize(new Vector3())
    onBounds?.(size)

    const center = box.getCenter(new Vector3())
    cloned.position.sub(center)
    cloned.position.add(new Vector3(...offset))
  }, [cloned, offset, onBounds])

  useEffect(() => {
    if (!playAnimations || names.length === 0) return

    const action = actions[names[0]]
    action?.reset().fadeIn(0.3).play()

    return () => {
      action?.fadeOut(0.3)
    }
  }, [actions, names, playAnimations])

  return (
    <group ref={group} scale={scale}>
      <primitive object={cloned} />
    </group>
  )
}
