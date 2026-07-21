import { infoPanels } from '../../config/infoPanels'
import { DiscoveryPanel } from './DiscoveryPanel'

type DiscoveryPanelsProps = {
  scroll: number
}

export function DiscoveryPanels({ scroll }: DiscoveryPanelsProps) {
  return (
    <group>
      {infoPanels.map((panel) => (
        <DiscoveryPanel key={panel.id} panel={panel} scroll={scroll} />
      ))}
    </group>
  )
}
