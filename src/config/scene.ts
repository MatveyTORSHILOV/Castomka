import { ACTIVE_PRESET, presets, type Vec3 } from './presets'

export const sceneConfig = presets[ACTIVE_PRESET]

export { ACTIVE_PRESET, presets }
export type { Vec3 }

export function lerp3(from: Vec3, to: Vec3, t: number): Vec3 {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ]
}
