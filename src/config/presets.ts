export type Vec3 = [number, number, number]

export type ScenePreset = {
  id: string
  label: string
  model: {
    url: string
    scale: number
    offset: Vec3
    playAnimations: boolean
  }
  camera: {
    fov: number
    near: number
    far: number
    start: { position: Vec3; lookAt: Vec3 }
    end: { position: Vec3; lookAt: Vec3 }
  }
  sceneRotation: { y: number; x: number }
  mouse: {
    look: Vec3
    orbit: Vec3
    parallax: Vec3
    smoothness: number
  }
  atmosphere: {
    background: string
    fog: [string, number, number]
  }
}

/** Сохранённый пресет «Кораблик» — скажи «верни Кораблик», чтобы вернуть */
export const korablikPreset: ScenePreset = {
  id: 'korablik',
  label: 'Кораблик',
  model: {
    url: '/models/hero.glb',
    scale: 1,
    offset: [0, 0, 0],
    playAnimations: true,
  },
  camera: {
    fov: 68,
    near: 0.01,
    far: 200,
    start: {
      position: [0, 0.02, 0.12],
      lookAt: [0, 0, -2.5],
    },
    end: {
      position: [0.35, 0.18, 0.85],
      lookAt: [0, 0.05, -1.2],
    },
  },
  sceneRotation: { y: Math.PI * 0.35, x: 0.08 },
  mouse: {
    look: [0.35, 0.2, 0.5],
    orbit: [0.12, 0.28, 0],
    parallax: [0.08, 0.05, 0.04],
    smoothness: 5,
  },
  atmosphere: {
    background: '#0c1714',
    fog: ['#0c1714', 2.5, 14],
  },
}

/** Галактика — need_some_space.glb */
export const galaxyPreset: ScenePreset = {
  id: 'galaxy',
  label: 'Need some space',
  model: {
    url: '/models/need_some_space.glb',
    scale: 1,
    offset: [0, 0, 0],
    playAnimations: true,
  },
  camera: {
    fov: 72,
    near: 0.01,
    far: 300,
    start: {
      position: [0, 0, 0.05],
      lookAt: [0, 0, -4],
    },
    end: {
      position: [0, 0.12, 0.65],
      lookAt: [0, 0, -3.2],
    },
  },
  sceneRotation: { y: Math.PI * 0.5, x: 0.04 },
  mouse: {
    look: [0.55, 0.35, 0.25],
    orbit: [0.18, 0.42, 0.06],
    parallax: [0.14, 0.1, 0.06],
    smoothness: 4.5,
  },
  atmosphere: {
    background: '#02020a',
    fog: ['#02020a', 6, 42],
  },
}

export const presets = {
  korablik: korablikPreset,
  galaxy: galaxyPreset,
} as const

export type PresetId = keyof typeof presets

/** Смени на 'korablik', чтобы вернуть корабль */
export const ACTIVE_PRESET: PresetId = 'galaxy'
