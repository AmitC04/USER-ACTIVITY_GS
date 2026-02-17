import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineEventProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  date: string;
  location?: string;
  ipAddress?: string;
  device?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isLast?: boolean;
}

export function TimelineEvent({ 
  icon: Icon, 
  iconColor, 
  title, 
  date, 
  location, 
  ipAddress, 
  device, 
  description,
  action,
  isLast = false 
}: TimelineEventProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div 
          className={`size-12 rounded-full flex items-center justify-center ${iconColor}`}
        >
          <Icon className="size-6 text-white" />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gray-200 border-dashed my-2 min-h-[40px]" />
        )}
      </div>

      <div className="flex-1 pb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-base mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{date}</p>

          {location && (
            <p className="text-sm text-gray-700 mb-1">📍 {location}</p>
          )}
          {ipAddress && (
            <p className="text-sm text-gray-700 mb-1">🌐 IP: {ipAddress}</p>
          )}
          {device && (
            <p className="text-sm text-gray-700 mb-3">💻 {device}</p>
          )}

          {description && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs text-gray-700">{description}</p>
            </div>
          )}

          {action && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
