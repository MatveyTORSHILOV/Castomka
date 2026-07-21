import { Center, useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Mesh } from 'three'
import { PlaceholderObject } from './PlaceholderObject'

type BlenderObjectProps = {
  url: string
  scale?: number
}

/**
 * Loads a Blender GLB if present.
 * Falls back to a procedural hero object so the scene works before export.
 */
export function BlenderObject({ url, scale = 1.15 }: BlenderObjectProps) {
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok)
      })
      .catch(() => {
        if (!cancelled) setAvailable(false)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  if (available === null) return null
  if (!available) return <PlaceholderObject />

  return <GltfModel url={url} scale={scale} />
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
