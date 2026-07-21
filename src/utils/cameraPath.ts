import { Vector3 } from 'three'
import { lerp3, sceneConfig } from '../config/scene'
import type { Vec3 } from '../config/presets'

const _position = new Vector3()
const _lookAt = new Vector3()
const _forward = new Vector3()
const _right = new Vector3()
const _up = new Vector3()
const _world = new Vector3()

export function getCameraState(scroll: number) {
  const { camera: cam } = sceneConfig

  return {
    position: lerp3(cam.start.position, cam.end.position, scroll) as Vec3,
    lookAt: lerp3(cam.start.lookAt, cam.end.lookAt, scroll) as Vec3,
  }
}

/**
 * Панель прямо перед камерой в точке скролла.
 * offset: [вправо, вверх, вперёд по взгляду]
 */
export function getPanelWorldPosition(scroll: number, offset: Vec3): Vec3 {
  const { position, lookAt } = getCameraState(scroll)

  _position.set(...position)
  _lookAt.set(...lookAt)
  _forward.subVectors(_lookAt, _position).normalize()
  _right.crossVectors(_forward, _up.set(0, 1, 0)).normalize()
  _up.crossVectors(_right, _forward).normalize()

  _world
    .copy(_position)
    .addScaledVector(_right, offset[0])
    .addScaledVector(_up, offset[1])
    .addScaledVector(_forward, offset[2])

  return [_world.x, _world.y, _world.z]
}
