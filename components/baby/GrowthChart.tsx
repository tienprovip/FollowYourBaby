// ---------------------------------------------------------------------------
// GrowthChart — SVG line chart with WHO percentile bands (P3 / P50 / P97)
// and the baby's actual measurement data points.
// ---------------------------------------------------------------------------

import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import Svg, { Line, Path, Circle, Text as SvgText, G } from 'react-native-svg';
import {
  getWHOTable,
  type GrowthMetric,
  type Sex,
} from '@/lib/standards/whoGrowthStandards';

interface DataPoint {
  ageMonths: number;
  value: number;
}

interface GrowthChartProps {
  metric: GrowthMetric;
  sex: Sex;
  dataPoints: DataPoint[];
  /** Override chart width (defaults to device width - 40) */
  width?: number;
  height?: number;
}

const PADDING = { top: 16, bottom: 36, left: 40, right: 16 };
const MAX_MONTH = 24;

function GrowthChart({
  metric,
  sex,
  dataPoints,
  width: overrideWidth,
  height = 200,
}: GrowthChartProps) {
  const { width: screenWidth } = useWindowDimensions();
  const width = overrideWidth ?? screenWidth - 40;

  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;

  const whoTable = getWHOTable(metric, sex);

  // Value range — expand to include WHO bands + data points
  const allValues = [
    ...whoTable.map((p) => p.p3),
    ...whoTable.map((p) => p.p97),
    ...dataPoints.map((d) => d.value),
  ];
  const minVal = Math.min(...allValues) * 0.97;
  const maxVal = Math.max(...allValues) * 1.03;

  // Coordinate helpers
  function xPos(month: number) {
    return PADDING.left + (month / MAX_MONTH) * chartW;
  }
  function yPos(value: number) {
    return (
      PADDING.top + chartH - ((value - minVal) / (maxVal - minVal)) * chartH
    );
  }

  // Build SVG path string from an array of {month, value}
  function buildPath(points: { month: number; value: number }[]): string {
    if (points.length === 0) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xPos(p.month)} ${yPos(p.value)}`)
      .join(' ');
  }

  const p3Path = buildPath(whoTable.map((p) => ({ month: p.month, value: p.p3 })));
  const p50Path = buildPath(whoTable.map((p) => ({ month: p.month, value: p.p50 })));
  const p97Path = buildPath(whoTable.map((p) => ({ month: p.month, value: p.p97 })));

  // Axis tick months
  const xTicks = [0, 3, 6, 9, 12, 18, 24];

  // Y ticks — 5 evenly spaced
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => {
    return minVal + (i / (yTickCount - 1)) * (maxVal - minVal);
  });

  const metricLabel: Record<GrowthMetric, string> = {
    weight: 'kg',
    length: 'cm',
    head: 'cm',
  };

  return (
    <View accessibilityRole="image" accessibilityLabel="Biểu đồ tăng trưởng">
      <Svg width={width} height={height}>
        {/* Y-axis ticks + grid lines */}
        {yTicks.map((val, i) => (
          <G key={`ytick-${i}`}>
            <Line
              x1={PADDING.left}
              y1={yPos(val)}
              x2={width - PADDING.right}
              y2={yPos(val)}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
            <SvgText
              x={PADDING.left - 4}
              y={yPos(val) + 4}
              fontSize={9}
              fill="#9CA3AF"
              textAnchor="end"
            >
              {metric === 'weight'
                ? val.toFixed(1)
                : Math.round(val).toString()}
            </SvgText>
          </G>
        ))}

        {/* X-axis ticks */}
        {xTicks.map((m) => (
          <G key={`xtick-${m}`}>
            <Line
              x1={xPos(m)}
              y1={PADDING.top}
              x2={xPos(m)}
              y2={PADDING.top + chartH}
              stroke="#F3F4F6"
              strokeWidth={1}
            />
            <SvgText
              x={xPos(m)}
              y={height - 6}
              fontSize={9}
              fill="#9CA3AF"
              textAnchor="middle"
            >
              {m}T
            </SvgText>
          </G>
        ))}

        {/* P97 line */}
        <Path d={p97Path} stroke="#FCA5A5" strokeWidth={1.5} fill="none" strokeDasharray="4,3" />

        {/* P50 line */}
        <Path d={p50Path} stroke="#A9D6FF" strokeWidth={2} fill="none" />

        {/* P3 line */}
        <Path d={p3Path} stroke="#FCA5A5" strokeWidth={1.5} fill="none" strokeDasharray="4,3" />

        {/* Baby data points + connecting line */}
        {dataPoints.length > 1 && (
          <Path
            d={buildPath(
              dataPoints.map((d) => ({ month: d.ageMonths, value: d.value })),
            )}
            stroke="#1F2B5B"
            strokeWidth={2}
            fill="none"
          />
        )}
        {dataPoints.map((d, i) => (
          <Circle
            key={`dp-${i}`}
            cx={xPos(d.ageMonths)}
            cy={yPos(d.value)}
            r={4}
            fill="#1F2B5B"
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        ))}

        {/* Y-axis label */}
        <SvgText
          x={8}
          y={PADDING.top + chartH / 2}
          fontSize={9}
          fill="#9CA3AF"
          textAnchor="middle"
          rotation={-90}
          originX={8}
          originY={PADDING.top + chartH / 2}
        >
          {metricLabel[metric]}
        </SvgText>
      </Svg>

      {/* Legend */}
      <View className="flex-row gap-x-4 px-2 mt-1">
        <View className="flex-row items-center gap-x-1">
          <View className="w-6 h-0.5 bg-brand-blue" />
          <Text className="text-[10px] text-brand-navy/70">P50</Text>
        </View>
        <View className="flex-row items-center gap-x-1">
          <View className="w-5 h-0.5 bg-red-300" />
          <Text className="text-[10px] text-brand-navy/70">P3 / P97</Text>
        </View>
        <View className="flex-row items-center gap-x-1">
          <View className="w-3 h-3 rounded-full bg-brand-navy" />
          <Text className="text-[10px] text-brand-navy/70">Bé</Text>
        </View>
      </View>
    </View>
  );
}

export default GrowthChart;
