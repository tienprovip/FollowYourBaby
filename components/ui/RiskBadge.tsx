import React from 'react';
import Badge from './Badge';
import { cn } from '@/lib/cn';

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface RiskBadgeProps {
  risk_level: RiskLevel;
  /** NativeWind className override */
  className?: string;
}

const LABELS: Record<RiskLevel, string> = {
  green: 'Bình thường',
  yellow: 'Cần theo dõi',
  red: 'Cần khám bác sĩ',
};

/** Specialized badge for AI-assessed risk levels. */
function RiskBadge({ risk_level, className }: RiskBadgeProps) {
  return (
    <Badge
      label={LABELS[risk_level]}
      variant={risk_level}
      className={cn(className)}
    />
  );
}

export default RiskBadge;
