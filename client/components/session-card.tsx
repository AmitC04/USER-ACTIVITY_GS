import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SessionCardProps {
  device: string;
  location: string;
  ipAddress: string;
  activeSince: string;
  lastActivity: string;
  isCurrent?: boolean;
  onEndSession?: () => void;
}

export function SessionCard({ 
  device, 
  location, 
  ipAddress, 
  activeSince, 
  lastActivity,
  isCurrent = false,
  onEndSession 
}: SessionCardProps) {
  return (
    <div className={`rounded-xl p-6 shadow-sm border-2 ${
      isCurrent 
        ? 'bg-green-50 border-green-500' 
        : 'bg-yellow-50 border-yellow-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${isCurrent ? '🟢' : '🟡'}`} />
          <span className="text-sm" style={{ fontWeight: 600, color: '#2c3e50' }}>
            {isCurrent ? 'CURRENT SESSION' : 'ACTIVE SESSION'}
          </span>
        </div>
        {isCurrent && (
          <span className="text-xs bg-white px-2 py-1 rounded" style={{ color: '#2c3e50', fontWeight: 500 }}>
            This Device
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm" style={{ color: '#2c3e50', fontWeight: 500 }}>
          💻 {device}
        </p>
        <p className="text-sm text-gray-700">📍 {location}</p>
        <p className="text-sm text-gray-700">🌐 IP Address: {ipAddress}</p>
      </div>

      <div className="border-t pt-3 mb-3" style={{ borderColor: '#ecf0f1' }}>
        <p className="text-xs text-gray-600 mb-1">
          Active since: {activeSince}
        </p>
        <p className="text-xs text-gray-600">
          Last activity: {lastActivity}
        </p>
      </div>

      <div className="flex gap-2">
        {isCurrent ? (
          <>
            <Button variant="outline" size="sm" className="flex-1">
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              View Full Details
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={onEndSession}
            >
              <X className="size-4 mr-1" /> End This Session
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
