import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { cloneElement, isValidElement, useEffect, useRef } from 'react';
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
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          onOpenChange(!isOpen);
        },
        onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
          trigger.props.onKeyDown?.(event);
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpenChange(!isOpen);
          }
        }
      })
    : (
        <button
          type="button"
          onClick={() => onOpenChange(!isOpen)}
          className="inline-flex cursor-pointer"
        >
          {trigger}
        </button>
      );

  useEffect(() => {
    const handleClick = (event: globalThis.MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div ref={containerRef} className="relative">
      {triggerElement}
      <div
        role="menu"
        aria-hidden={!isOpen}
        className={classNames(
          'dropdown-surface absolute top-full z-30 mt-2 min-w-[180px] rounded-2xl border p-2 backdrop-blur-xl transition',
          align === 'right' ? 'right-0' : 'left-0',
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
};
