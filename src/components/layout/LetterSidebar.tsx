import { BookText, FilePenLine, FolderKanban, LayoutTemplate, Send, Shapes, Stamp } from 'lucide-react';
import { useState } from 'react';
import { SidebarShell, type SidebarNavItem } from './SidebarShell';

type LetterSidebarProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

const letterNavItems: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: BookText },
  { id: 'drafts', label: 'Drafts', icon: FilePenLine },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'signoffs', label: 'Sign-offs', icon: Stamp },
  { id: 'delivery', label: 'Delivery', icon: Send },
  { id: 'matter-folders', label: 'Matter Folders', icon: FolderKanban },
  { id: 'styles', label: 'Styles', icon: Shapes }
];

const LetterSidebar = ({ isCollapsed, onToggleCollapsed }: LetterSidebarProps) => {
  const [activeItemId, setActiveItemId] = useState(letterNavItems[0].id);

  return (
    <SidebarShell
      isCollapsed={isCollapsed}
      onToggleCollapsed={onToggleCollapsed}
      items={letterNavItems}
      manualActiveItemId={activeItemId}
      onManualSelect={setActiveItemId}
    />
  );
};

export default LetterSidebar;
