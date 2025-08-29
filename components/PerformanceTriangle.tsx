import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

const data = [
  { metric: "Speed", value: 7 },
  { metric: "Accuracy", value: 5 },
  { metric: "Efficiency", value: 9 }
];

export default function PerformanceTriangle() {
  return (
    <div className="w-full h-80 bg-black flex flex-col items-center justify-center text-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Analytics Hub</h2>
      <p className="text-cyan-400 mb-2">Performance Triangle</p>

      <ResponsiveContainer width="90%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          {/* Background grid */}
          <PolarGrid stroke="#444" />

          {/* Labels around the triangle */}
          <PolarAngleAxis
            dataKey="metric"
            stroke="#aaa"
            fontSize={12}
          />

          {/* Fixed scaling so triangle always shows fully */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}   // <-- keep scale from 0–10 always
            tick={false}
            axisLine={false}
          />

          {/* The actual triangle */}
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
