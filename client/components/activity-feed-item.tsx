import { LucideIcon } from 'lucide-react';

interface ActivityFeedItemProps {
  icon: LucideIcon;
  description: string;
  timestamp: string;
  isUnread?: boolean;
}

export function ActivityFeedItem({ icon: Icon, description, timestamp, isUnread = false }: ActivityFeedItemProps) {
  return (
    <div className={`flex items-start gap-4 py-4 px-4 border-b hover:bg-gray-50 transition-colors ${isUnread ? 'border-l-4 border-l-blue-500' : ''}`}>
      <Icon className="size-6 text-gray-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{timestamp}</span>
    </div>
  );
}
