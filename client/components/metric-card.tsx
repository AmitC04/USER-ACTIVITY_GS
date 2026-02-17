import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: string;
}

export function MetricCard({ icon: Icon, value, label, color = "text-blue-600" }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 cursor-pointer">
      <Icon className={`size-8 ${color} mb-3`} />
      <div className="text-4xl mt-4 mb-2 text-center" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
        {value}
      </div>
      <div className="text-sm text-center" style={{ color: '#7f8c8d', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}
