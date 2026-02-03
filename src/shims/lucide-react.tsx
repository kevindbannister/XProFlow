import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  color?: string;
  size?: number | string;
};

const createIcon = (name: string) => {
  const Icon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
      <path d="M7 12h10" />
      <title>{name}</title>
    </svg>
  );

  Icon.displayName = name;
  return Icon;
};

export const Bell = createIcon('Bell');
export const ChevronDown = createIcon('ChevronDown');
export const ChevronLeft = createIcon('ChevronLeft');
export const ChevronRight = createIcon('ChevronRight');
export const Clock = createIcon('Clock');
export const Filter = createIcon('Filter');
export const GitBranch = createIcon('GitBranch');
export const Home = createIcon('Home');
export const ListChecks = createIcon('ListChecks');
export const Mail = createIcon('Mail');
export const MailCheck = createIcon('MailCheck');
export const Moon = createIcon('Moon');
export const Plug = createIcon('Plug');
export const PoundSterling = createIcon('PoundSterling');
export const Send = createIcon('Send');
export const Settings = createIcon('Settings');
export const Sparkles = createIcon('Sparkles');
export const Sun = createIcon('Sun');
export const Tag = createIcon('Tag');
export const Timer = createIcon('Timer');
export const X = createIcon('X');
