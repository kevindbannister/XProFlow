import type { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div
      className={classNames(
        'mx-auto w-full max-w-[1200px] px-4 pb-10 pt-6 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContainer;
