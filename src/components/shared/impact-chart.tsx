"use client";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ImpactChartProps {
  data: ChartData[];
  title: string;
}

export function ImpactChart({ data, title }: ImpactChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const colors = [
    "bg-green-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  item.color || colors[index % colors.length]
                }`}
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  minWidth: item.value > 0 ? "24px" : "0",
                }}
              />
            </div>
            <div className="w-12 text-right text-sm font-medium text-gray-900">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
