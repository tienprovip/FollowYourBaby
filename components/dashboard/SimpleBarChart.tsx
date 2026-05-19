import React from 'react';
import { Text, View } from 'react-native';

export interface BarChartDataPoint {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartDataPoint[];
  color?: string;
  unit?: string;
  height?: number;
}

function SimpleBarChart({ data, color = '#FF8FA8', unit = '', height = 80 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View>
      <View className="flex-row items-end gap-1" style={{ height }}>
        {data.map((point, i) => {
          const barHeight = Math.max(2, (point.value / maxValue) * height);
          return (
            <View key={i} className="flex-1 items-center justify-end">
              <View
                style={{
                  height: barHeight,
                  backgroundColor: color,
                  borderRadius: 4,
                  width: '80%',
                }}
              />
            </View>
          );
        })}
      </View>
      <View className="flex-row mt-1 gap-1">
        {data.map((point, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-brand-navy/50 text-xs">{point.label}</Text>
            {point.value > 0 ? (
              <Text className="text-brand-navy/70 text-xs font-medium">
                {point.value}
                {unit}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export default SimpleBarChart;
