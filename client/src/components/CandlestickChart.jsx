import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { useTheme } from "../context/ThemeContext";

export default function CandlestickChart({ data, height = 400 }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const { dark } = useTheme();

  useEffect(() => {
    if (!containerRef.current || !data?.length) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: dark ? "#a0a0b8" : "#555",
      },
      grid: {
        vertLines: { color: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" },
        horzLines: { color: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: dark ? "#555" : "#ccc", style: 2, width: 1, labelBackgroundColor: dark ? "#2a2a3e" : "#f0f2f5" },
        horzLine: { color: dark ? "#555" : "#ccc", style: 2, width: 1, labelBackgroundColor: dark ? "#2a2a3e" : "#f0f2f5" },
      },
      timeScale: {
        borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
        timeVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#10b981",
      wickDownColor: "#ef4444",
      wickUpColor: "#10b981",
    });

    candleSeries.setData(data);

    chart.timeScale().fitContent();

    chartRef.current = chart;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, dark, height]);

  return <div ref={containerRef} style={{ width: "100%" }} />;
}
