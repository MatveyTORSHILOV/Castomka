import { useEffect, useState } from 'react'
import { Center, useGLTF } from '@react-three/drei'
import { Mesh } from 'three'
import { PlaceholderObject } from './PlaceholderObject'
import { SceneErrorBoundary } from './SceneErrorBoundary'

type BlenderObjectProps = {
  url: string
  scale?: number
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

/**
 * Loads a Blender GLB if present.
 * Falls back to a procedural hero object so the scene works before export.
 */
export function BlenderObject({ url, scale = 1.15 }: BlenderObjectProps) {
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
      <GltfModel url={url} scale={scale} />
    </SceneErrorBoundary>
  )
}

function GltfModel({ url, scale }: { url: string; scale: number }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  )
}
