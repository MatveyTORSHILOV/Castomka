/**
 * Настройки камеры и модели.
 * Подкручивай значения здесь, пока не попадёшь «внутрь облака».
 *
 * Как ориентироваться:
 * - position [x, y, z]: где стоит камера (y вниз = ниже, z вперёд = глубже в сцену)
 * - lookAt [x, y, z]: куда смотрит камера (корабль обычно по центру или чуть впереди по -Z)
 * - fov: шире = больше «внутри», уже = киношнее
 */
export const sceneConfig = {
  model: {
    url: '/models/hero.glb',
    /** Уменьши, если модель огромная; увеличь, если корабль мелкий */
    scale: 1,
    /** Сдвиг всей сцены после Center: [x, y, z] */
    offset: [0, 0, 0] as [number, number, number],
    playAnimations: true,
  },

  camera: {
    fov: 68,
    near: 0.01,
    far: 200,

    /** Старт: камера внутри облака, смотрит на корабль */
    start: {
      position: [0, 0.02, 0.12] as [number, number, number],
      lookAt: [0, 0, -2.5] as [number, number, number],
    },

    /** Конец скролла: чуть отъезжает и оборачивает облако */
    end: {
      position: [0.35, 0.18, 0.85] as [number, number, number],
      lookAt: [0, 0.05, -1.2] as [number, number, number],
    },
  },

  /** Вращение всей сцены по скроллу (облако «обволакивает») */
  sceneRotation: {
    y: Math.PI * 0.35,
    x: 0.08,
  },
}

export function lerp3(
  from: [number, number, number],
  to: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ]
}
