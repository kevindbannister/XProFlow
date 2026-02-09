import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

const IconButton = ({ children, className, type = 'button', ...props }: IconButtonProps) => {
  return (
    <button
      type={type}
      className={classNames('icon-button flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
