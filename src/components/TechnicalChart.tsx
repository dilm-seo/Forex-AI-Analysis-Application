import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface ChartData {
  time: string;
  value: number;
}

interface TechnicalChartProps {
  data: ChartData[];
  pair: string;
  levels?: {
    support: number[];
    resistance: number[];
  };
}

export default function TechnicalChart({ data, pair, levels }: TechnicalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#e2e8f0' },
        horzLines: { color: '#e2e8f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const lineSeries = chart.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
    });

    lineSeries.setData(data);

    // Add support and resistance levels
    if (levels) {
      levels.support.forEach(level => {
        chart.addHorizontalLine({
          price: level,
          color: '#22c55e',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'Support',
        });
      });

      levels.resistance.forEach(level => {
        chart.addHorizontalLine({
          price: level,
          color: '#ef4444',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'Résistance',
        });
      });
    }

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, levels]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{pair}</h3>
      <div ref={chartContainerRef} />
    </div>
  );
}