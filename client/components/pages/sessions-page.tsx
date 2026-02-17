import { SessionCard } from '@/components/session-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SessionsPage() {
  const handleEndSession = (device: string) => {
    toast.success(`Session ended successfully for ${device}`);
  };

  const handleEndAllSessions = () => {
    toast.success('All other sessions have been ended');
  };

  const recentSessions = [
    {
      device: '💻 Chrome Desktop',
      location: 'Pune, IN',
      loginTime: 'Jan 24, 3:00 PM',
      duration: '2h 15m',
      status: 'Ended',
    },
    {
      device: '📱 Safari Mobile',
      location: 'Pune, IN',
      loginTime: 'Jan 23, 10:00 AM',
      duration: '45m',
      status: 'Ended',
    },
    {
      device: '💻 Firefox Desktop',
      location: 'Delhi, IN',
      loginTime: 'Jan 22, 2:30 PM',
      duration: '1h 20m',
      status: 'Ended',
    },
    {
      device: '📱 Chrome Mobile',
      location: 'Mumbai, IN',
      loginTime: 'Jan 21, 5:45 PM',
      duration: '30m',
      status: 'Ended',
    },
    {
      device: '💻 Edge Desktop',
      location: 'Bangalore, IN',
      loginTime: 'Jan 20, 11:15 AM',
      duration: '3h 5m',
      status: 'Ended',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl mb-2" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          Active Sessions
        </h1>
        <p className="text-gray-600">Manage your active login sessions</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl" style={{ color: '#2c3e50', fontWeight: 600 }}>
            Active Sessions (2)
          </h2>
          <Button variant="destructive" onClick={handleEndAllSessions}>
            End All Other Sessions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SessionCard
            device="Chrome 120.0 on Windows 11 Desktop"
            location="Pune, Maharashtra, India"
            ipAddress="xxx.xxx.123.***"
            activeSince="Jan 25, 11:30 AM (2 hours ago)"
            lastActivity="Just now"
            isCurrent={true}
          />
          <SessionCard
            device="Safari 17.2 on iPhone 14 Pro (Mobile)"
            location="Mumbai, Maharashtra, India"
            ipAddress="xxx.xxx.234.***"
            activeSince="Jan 25, 9:00 AM (4 hours ago)"
            lastActivity="15 minutes ago"
            isCurrent={false}
            onEndSession={() => handleEndSession('Safari on iPhone')}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl" style={{ color: '#2c3e50', fontWeight: 600 }}>
            Recent Sessions (Last 7 Days)
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSessions.map((session, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{session.device}</span>
                  </div>
                </TableCell>
                <TableCell>{session.location}</TableCell>
                <TableCell>{session.loginTime}</TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {session.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="text-3xl">🔒</div>
          <div className="flex-1">
            <h3 className="text-base mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
              Security Tip
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              If you see a session that you don't recognize, end it immediately and change your password. 
              Enable two-factor authentication for additional security.
            </p>
            <Button variant="outline" size="sm">
              Learn About Account Security
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
