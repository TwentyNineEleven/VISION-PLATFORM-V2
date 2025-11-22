import React, { CSSProperties } from 'react';
import { semanticColors } from '../../theme';

export interface ConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  className?: string;
  style?: CSSProperties;
}

export const Connector: React.FC<ConnectorProps> = ({
  from,
  to,
  className = '',
  style,
}) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const connectorStyle: CSSProperties = {
    position: 'absolute',
    left: from.x,
    top: from.y,
    width: length,
    height: '2px',
    backgroundColor: semanticColors.borderPrimary,
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg)`,
    zIndex: 0,
    ...style,
  };

  return <div className={className} style={connectorStyle} />;
};

