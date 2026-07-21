import type { Vec3 } from '../config/presets'

export type InfoPanelConfig = {
  id: string
  scrollAt: number
  /** [вправо, вверх, вперёд по взгляду] — держи lateral < 0.35 */
  offset: Vec3
  tag: string
  title: string
  body: string
}

export const infoPanels: InfoPanelConfig[] = [
  {
    id: 'nebula',
    scrollAt: 0.14,
    offset: [0.1, 0.02, 1.35],
    tag: '01',
    title: 'ТУМАННОСТЬ',
    body: 'Облака газа и пыли, где рождаются звёзды. Свет молодых солнц разгоняет тьму на тысячи световых лет.',
  },
  {
    id: 'black-hole',
    scrollAt: 0.3,
    offset: [-0.14, -0.02, 1.45],
    tag: '02',
    title: 'ЧЁРНАЯ ДЫРА',
    body: 'Гравитация настолько сильна, что даже свет не вырывается. За горизонтом событий время течёт иначе.',
  },
  {
    id: 'light-year',
    scrollAt: 0.46,
    offset: [0.08, 0.1, 1.55],
    tag: '03',
    title: 'СВЕТОВОЙ ГОД',
    body: 'Расстояние, которое свет проходит за год — почти 9.5 триллионов километров. Космос меряют не шагами.',
  },
  {
    id: 'exoplanet',
    scrollAt: 0.62,
    offset: [-0.1, 0.05, 1.65],
    tag: '04',
    title: 'ЭКЗОПЛАНЕТА',
    body: 'Мир за пределами Солнечной системы. Тысячи уже найдены — среди них могут быть океаны и атмосферы.',
  },
  {
    id: 'dust',
    scrollAt: 0.78,
    offset: [0.12, -0.06, 1.75],
    tag: '05',
    title: 'КОСМИЧЕСКАЯ ПЫЛЬ',
    body: 'Микроскопические частицы — строительный материал планет. Из такой пыли когда-то собралась Земля.',
  },
]

export const PANEL_ZONE = 0.1

export function getPanelReveal(scroll: number, scrollAt: number, zone = PANEL_ZONE): number {
  const dist = Math.abs(scroll - scrollAt)

  if (dist > zone * 2.4) return 0

  if (dist <= zone) {
    return 1 - (dist / zone) * 0.12
  }

  const fade = 1 - (dist - zone) / (zone * 1.3)
  return Math.max(0, fade)
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}
