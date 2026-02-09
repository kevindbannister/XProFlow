import type { ReactNode } from 'react';
import { classNames } from '../../lib/utils';
import { xProFlowSpacing } from '../../lib/designTokens';

type DashboardShellProps = {
  children: ReactNode;
  className?: string;
};

const DashboardShell = ({ children, className }: DashboardShellProps) => {
  return (
    <section className={classNames(xProFlowSpacing.section, className)}>{children}</section>
  );
};

export default DashboardShell;
