import { Subsystem } from '../types';
import { BarChart3, LineChart, Database } from 'lucide-react';

interface SubsystemHeaderProps {
  subsystem: Subsystem;
}

const iconMap = {
  BarChart3,
  LineChart,
  Database
};

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600'
};

export function SubsystemHeader({ subsystem }: SubsystemHeaderProps) {
  const Icon = iconMap[subsystem.icon as keyof typeof iconMap] || BarChart3;
  const colorClass =
    colorMap[subsystem.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-3 rounded-lg ${colorClass.split(' ')[0]}`}>
        <Icon className={`h-8 w-8 ${colorClass.split(' ')[1]}`} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{subsystem.name}</h1>
        <p className="text-muted-foreground">{subsystem.description}</p>
      </div>
    </div>
  );
}
