import { ReactNode, useEffect, useRef } from 'react';
import { classNames } from '../../lib/utils';

type DropdownMenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  align?: 'left' | 'right';
};

export const DropdownMenu = ({
  trigger,
  children,
  isOpen,
  onOpenChange,
  align = 'right'
}: DropdownMenuProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => onOpenChange(!isOpen)} className="inline-flex cursor-pointer">
        {trigger}
      </div>
      <div
        className={classNames(
          'absolute top-full z-30 mt-2 min-w-[180px] rounded-2xl border border-white/70 bg-white/90 p-2 shadow-[0_20px_40px_rgba(60,100,170,0.15)] backdrop-blur-xl transition',
          align === 'right' ? 'right-0' : 'left-0',
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
};
