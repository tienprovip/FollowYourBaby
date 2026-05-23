import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { differenceInDays, parseISO, subDays } from 'date-fns';
import type { WeightGainPoint } from '@/lib/standards/weightGainCurves';
import { getWeightGainCurve } from '@/lib/standards/weightGainCurves';
import type { BmiCategory } from '@/lib/standards/weightGainCurves';
import type { Database } from '@/types/database';

type WeightRow = Database['public']['Tables']['pregnancy_weights']['Row'];

interface WeightChartProps {
  weights: WeightRow[];
  pregnancyWeek: number;
  /** User's pre-pregnancy weight (kg) — required to compute gain */
  baseWeightKg: number | null;
  bmiCategory?: BmiCategory;
  /** ISO date string — used to compute accurate week positions for each entry */
  dueDate?: string | null;
  width?: number;
  height?: number;
}

const CHART_PADDING = { top: 24, right: 16, bottom: 36, left: 48 };

function WeightChart({
  weights,
  pregnancyWeek,
  baseWeightKg,
  bmiCategory = 'normal',
  dueDate,
  width = 320,
  height = 200,
}: WeightChartProps) {
  const chartWidth = width - CHART_PADDING.left - CHART_PADDING.right;
  const chartHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;

  const curve = useMemo(() => getWeightGainCurve(bmiCategory), [bmiCategory]);

  // LMP = due_date - 280 days; used to map recorded_at → pregnancy week
  const lmpDate = useMemo(() => (dueDate ? subDays(parseISO(dueDate), 280) : null), [dueDate]);

  function weekForEntry(recordedAt: string): number {
    if (lmpDate) {
      const days = differenceInDays(parseISO(recordedAt), lmpDate);
      return Math.max(0, Math.min(40, Math.floor(days / 7)));
    }
    // fallback: approximate from current week (legacy behaviour)
    return pregnancyWeek;
  }

  // We plot weeks 0–40 on x-axis
  const xMin = 0;
  const xMax = 40;

  // Compute actual weight gain from base
  const weightGains = useMemo(() => {
    if (!baseWeightKg || weights.length === 0) return [];
    return weights
      .map((w) => ({
        ...w,
        gain: parseFloat((w.weight_kg - baseWeightKg).toFixed(1)),
      }))
      .filter((w) => w.gain >= -5); // filter out obviously bad data
  }, [weights, baseWeightKg]);

  // Y-axis range: cover both curve max and actual gains
  const maxCurveGain = curve[curve.length - 1].high_kg;
  const maxActualGain =
    weightGains.length > 0
      ? Math.max(...weightGains.map((w) => w.gain))
      : maxCurveGain;
  const yMax = Math.max(maxCurveGain, maxActualGain) + 2;
  const yMin = Math.min(0, ...weightGains.map((w) => w.gain)) - 1;

  function toX(week: number): number {
    return CHART_PADDING.left + ((week - xMin) / (xMax - xMin)) * chartWidth;
  }

  function toY(kg: number): number {
    return (
      CHART_PADDING.top +
      chartHeight -
      ((kg - yMin) / (yMax - yMin)) * chartHeight
    );
  }

  // Build SVG path for reference curve (midpoint between low and high)
  function curveToPath(points: WeightGainPoint[], key: 'low_kg' | 'high_kg'): string {
    return points
      .map((p, i) => {
        const x = toX(p.week);
        const y = toY(p[key]);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  // Shaded band between low and high
  function bandPath(): string {
    const lows = curve.map((p) => `${toX(p.week).toFixed(1)},${toY(p.low_kg).toFixed(1)}`);
    const highs = [...curve]
      .reverse()
      .map((p) => `${toX(p.week).toFixed(1)},${toY(p.high_kg).toFixed(1)}`);
    return `M${lows.join(' L')} L${highs.join(' L')} Z`;
  }

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let v = Math.ceil(yMin); v <= Math.floor(yMax); v += 2) {
      ticks.push(v);
    }
    return ticks;
  }, [yMin, yMax]);

  if (!baseWeightKg) {
    return (
      <View
        style={{ width, height }}
        className="items-center justify-center bg-brand-gray rounded-card"
      >
        <Text className="text-brand-navy/50 text-sm text-center px-4">
          Nhập cân nặng trước khi mang thai để xem biểu đồ so chuẩn
        </Text>
      </View>
    );
  }

  // Actual data path
  const actualPath =
    weightGains.length > 1
      ? weightGains
          .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
          .map((w, i) => {
            const x = toX(weekForEntry(w.recorded_at));
            const y = toY(w.gain);
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(' ')
      : null;

  return (
    <View accessibilityLabel="Biểu đồ tăng cân thai kỳ">
      <Svg width={width} height={height}>
        {/* Band */}
        <Path d={bandPath()} fill="#FF8FA820" />

        {/* Low curve */}
        <Path
          d={curveToPath(curve, 'low_kg')}
          stroke="#FF8FA860"
          strokeWidth={1}
          fill="none"
          strokeDasharray="4,3"
        />

        {/* High curve */}
        <Path
          d={curveToPath(curve, 'high_kg')}
          stroke="#FF8FA860"
          strokeWidth={1}
          fill="none"
          strokeDasharray="4,3"
        />

        {/* Actual weight line */}
        {actualPath && (
          <Path
            d={actualPath}
            stroke="#FF8FA8"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {weightGains.map((w) => {
          const x = toX(weekForEntry(w.recorded_at));
          const y = toY(w.gain);
          return (
            <Circle
              key={w.id}
              cx={x}
              cy={y}
              r={4}
              fill="#FF8FA8"
              stroke="white"
              strokeWidth={2}
            />
          );
        })}

        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <G key={tick}>
            <Line
              x1={CHART_PADDING.left}
              y1={toY(tick)}
              x2={CHART_PADDING.left + chartWidth}
              y2={toY(tick)}
              stroke="#F7F7F7"
              strokeWidth={1}
            />
            <SvgText
              x={CHART_PADDING.left - 4}
              y={toY(tick) + 4}
              fontSize={9}
              fill="#1F2B5B80"
              textAnchor="end"
            >
              {tick >= 0 ? `+${tick}` : tick}
            </SvgText>
          </G>
        ))}

        {/* X-axis labels at weeks 0, 10, 20, 30, 40 */}
        {[0, 10, 20, 30, 40].map((week) => (
          <SvgText
            key={week}
            x={toX(week)}
            y={height - 6}
            fontSize={9}
            fill="#1F2B5B80"
            textAnchor="middle"
          >
            T{week}
          </SvgText>
        ))}

        {/* Current week marker */}
        <Line
          x1={toX(pregnancyWeek)}
          y1={CHART_PADDING.top}
          x2={toX(pregnancyWeek)}
          y2={CHART_PADDING.top + chartHeight}
          stroke="#B79CFF"
          strokeWidth={1.5}
          strokeDasharray="4,3"
        />
      </Svg>

      {/* Legend */}
      <View className="flex-row items-center gap-x-4 px-4 mt-1">
        <View className="flex-row items-center gap-x-1">
          <View className="w-4 h-1 bg-brand-pink rounded-full" />
          <Text className="text-xs text-brand-navy/60">Cân nặng thực</Text>
        </View>
        <View className="flex-row items-center gap-x-1">
          <View className="w-4 h-1 bg-brand-pink/30 rounded-full" />
          <Text className="text-xs text-brand-navy/60">Chuẩn IOM 2009</Text>
        </View>
      </View>
    </View>
  );
}

export default WeightChart;
