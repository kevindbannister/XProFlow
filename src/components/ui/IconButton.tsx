import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const IconButton = ({ children, className, type = 'button', ...props }: IconButtonProps) => {
  return (
    <button type={type} className={classNames('icon-button', className)} {...props}>
      {children}
    </button>
  );
};

export default IconButton;
