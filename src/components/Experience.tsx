import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, PerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import { lerp3, sceneConfig } from '../config/scene'
import { BlenderObject } from './BlenderObject'

type ExperienceProps = {
  progress: number
}

const lookTarget = new Vector3()

export function Experience({ progress }: ExperienceProps) {
  const group = useRef<Group>(null)
  const { camera: cam, sceneRotation, model } = sceneConfig

  useFrame((state, delta) => {
    const t = progress
    const [px, py, pz] = lerp3(cam.start.position, cam.end.position, t)
    const [lx, ly, lz] = lerp3(cam.start.lookAt, cam.end.lookAt, t)

    const perspective = state.camera as PerspectiveCamera
    perspective.fov = cam.fov
    perspective.near = cam.near
    perspective.far = cam.far
    perspective.updateProjectionMatrix()

    state.camera.position.x += (px - state.camera.position.x) * Math.min(1, delta * 4)
    state.camera.position.y += (py - state.camera.position.y) * Math.min(1, delta * 4)
    state.camera.position.z += (pz - state.camera.position.z) * Math.min(1, delta * 4)

    lookTarget.set(lx, ly, lz)
    state.camera.lookAt(lookTarget)

    if (!group.current) return

    const targetRotY = t * sceneRotation.y
    const targetRotX = t * sceneRotation.x

    group.current.rotation.y += (targetRotY - group.current.rotation.y) * Math.min(1, delta * 3)
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * Math.min(1, delta * 3)
  })

  return (
    <>
      <color attach="background" args={['#0c1714']} />
      <fog attach="fog" args={['#0c1714', 2.5, 14]} />

      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#d8ff6e', '#12231f', 0.55]} />
      <directionalLight position={[2, 3, 1]} intensity={0.9} color="#fff4e5" />
      <pointLight position={[0, 0.2, 0.4]} intensity={6} color="#7ee0c3" distance={8} />
      <pointLight position={[0, -0.3, -1]} intensity={4} color="#d8ff6e" distance={6} />

      <group ref={group}>
        <BlenderObject
          url={model.url}
          scale={model.scale}
          offset={model.offset}
          playAnimations={model.playAnimations}
        />
      </group>
    </>
  )
}
