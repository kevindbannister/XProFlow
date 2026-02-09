import type { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type ContentAreaProps = {
  children: ReactNode;
  className?: string;
};

const ContentArea = ({ children, className }: ContentAreaProps) => (
  <main className={classNames('flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10', className)}>
    {children}
  </main>
);

export default ContentArea;
