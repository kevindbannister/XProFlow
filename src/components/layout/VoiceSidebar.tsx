import { Headphones, Mic, RadioTower, ScrollText, SlidersHorizontal, Sparkles, Waves } from 'lucide-react';
import { useState } from 'react';
import { SidebarShell, type SidebarNavItem } from './SidebarShell';

type VoiceSidebarProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

const voiceNavItems: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: Headphones },
  { id: 'prompts', label: 'Prompts', icon: Mic },
  { id: 'scripts', label: 'Scripts', icon: ScrollText },
  { id: 'tones', label: 'Tones', icon: Waves },
  { id: 'automation', label: 'Automation', icon: RadioTower },
  { id: 'quality', label: 'Quality', icon: Sparkles },
  { id: 'controls', label: 'Controls', icon: SlidersHorizontal }
];

const VoiceSidebar = ({ isCollapsed, onToggleCollapsed }: VoiceSidebarProps) => {
  const [activeItemId, setActiveItemId] = useState(voiceNavItems[0].id);

  return (
    <SidebarShell
      isCollapsed={isCollapsed}
      onToggleCollapsed={onToggleCollapsed}
      items={voiceNavItems}
      manualActiveItemId={activeItemId}
      onManualSelect={setActiveItemId}
    />
  );
};

export default VoiceSidebar;
