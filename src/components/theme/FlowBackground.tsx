import type { ReactNode } from 'react';

type FlowBackgroundProps = {
  children: ReactNode;
};

const FlowBackground = ({ children }: FlowBackgroundProps) => {
  return (
    <div className="flow-background">
      <div className="flow-background__overlay" aria-hidden="true">
        <div className="flow-background__graphic" />
      </div>
      <div className="flow-background__content">{children}</div>
    </div>
  );
};

export default FlowBackground;
