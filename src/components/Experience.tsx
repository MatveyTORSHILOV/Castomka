import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, PerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import { sceneConfig } from '../config/scene'
import type { PointerState } from '../hooks/useSceneInput'
import { getCameraState } from '../utils/cameraPath'
import { BlenderObject } from './BlenderObject'
import { DiscoveryPanels } from './panels/DiscoveryPanels'

type ExperienceProps = {
  scroll: number
  pointer: PointerState
}

const lookTarget = new Vector3()
const smoothPointer = { x: 0, y: 0 }

export function Experience({ scroll, pointer }: ExperienceProps) {
  const group = useRef<Group>(null)
  const { camera: cam, sceneRotation, model, mouse, atmosphere } = sceneConfig
  const isSpace = sceneConfig.id === 'galaxy'

  useFrame((state, delta) => {
    const blend = Math.min(1, delta * mouse.smoothness)
    smoothPointer.x += (pointer.x - smoothPointer.x) * blend
    smoothPointer.y += (pointer.y - smoothPointer.y) * blend

    const { position: camPos, lookAt: camLook } = getCameraState(scroll)
    const [px, py, pz] = camPos
    const [lx, ly, lz] = camLook

    const perspective = state.camera as PerspectiveCamera
    perspective.fov = cam.fov
    perspective.near = cam.near
    perspective.far = cam.far
    perspective.updateProjectionMatrix()

    const camX = px + smoothPointer.x * mouse.parallax[0]
    const camY = py + smoothPointer.y * mouse.parallax[1]
    const camZ = pz + smoothPointer.x * mouse.parallax[2]

    state.camera.position.x += (camX - state.camera.position.x) * Math.min(1, delta * 4)
    state.camera.position.y += (camY - state.camera.position.y) * Math.min(1, delta * 4)
    state.camera.position.z += (camZ - state.camera.position.z) * Math.min(1, delta * 4)

    lookTarget.set(
      lx + smoothPointer.x * mouse.look[0],
      ly + smoothPointer.y * mouse.look[1],
      lz + smoothPointer.x * mouse.look[2],
    )
    state.camera.lookAt(lookTarget)

    if (!group.current) return

    const targetRotY =
      scroll * sceneRotation.y + smoothPointer.x * mouse.orbit[0] + smoothPointer.y * mouse.orbit[2]
    const targetRotX = scroll * sceneRotation.x + smoothPointer.y * mouse.orbit[1]

    group.current.rotation.y += (targetRotY - group.current.rotation.y) * Math.min(1, delta * 3)
    group.current.rotation.x += (targetRotX - group.current.rotation.x) * Math.min(1, delta * 3)
  })

  return (
    <>
      <color attach="background" args={[atmosphere.background]} />
      <fog attach="fog" args={atmosphere.fog} />

      {isSpace ? (
        <>
          <ambientLight intensity={0.35} />
          <pointLight position={[0, 0, 1]} intensity={3} color="#8eb4ff" distance={20} />
          <pointLight position={[-2, 1, -1]} intensity={2} color="#c4a0ff" distance={16} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.7} />
          <hemisphereLight args={['#d8ff6e', '#12231f', 0.55]} />
          <directionalLight position={[2, 3, 1]} intensity={0.9} color="#fff4e5" />
          <pointLight position={[0, 0.2, 0.4]} intensity={6} color="#7ee0c3" distance={8} />
          <pointLight position={[0, -0.3, -1]} intensity={4} color="#d8ff6e" distance={6} />
        </>
      )}

      <group ref={group}>
        <BlenderObject
          url={model.url}
          scale={model.scale}
          offset={model.offset}
          playAnimations={model.playAnimations}
        />
      </group>

      {isSpace && <DiscoveryPanels scroll={scroll} />}
    </>
  )
}
