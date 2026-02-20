'use client';

import { useState, useEffect } from 'react';
import { SessionCard } from '@/components/session-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface Session {
  id: string;
  device: string;
  browser?: string;
  ipAddress?: string;
  location?: string;
  isActive: boolean;
  lastActive: string;
  createdAt: string;
}

export function SessionsPage() {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        
        // Fetch all user sessions
        const response = await apiClient.sessions.getAll({ limit: 20 });
        const rawData = response.data.data;
        const sessions = Array.isArray(rawData) ? rawData : (rawData?.sessions || []);
        
        // Separate active and inactive sessions
        const active = sessions.filter((session: any) => session.isActive);
        const inactive = sessions
          .filter((session: any) => !session.isActive)
          .slice(0, 5); // Take only the 5 most recent inactive sessions
        
        setActiveSessions(active);
        setRecentSessions(inactive);
        setError(null);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again later.');
        toast.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleEndSession = async (sessionId: string, device: string) => {
    try {
      await apiClient.sessions.endSession(sessionId);
      toast.success(`Session ended successfully for ${device}`);
      
      // Refresh the session lists
      const response = await apiClient.sessions.getAll({ limit: 20 });
      const rawData = response.data.data;
      const sessions = Array.isArray(rawData) ? rawData : (rawData?.sessions || []);
      
      const active = sessions.filter((session: any) => session.isActive);
      const inactive = sessions
        .filter((session: any) => !session.isActive)
        .slice(0, 5);
      
      setActiveSessions(active);
      setRecentSessions(inactive);
    } catch (err) {
      console.error('Error ending session:', err);
      toast.error('Failed to end session. Please try again.');
    }
  };

  const handleEndAllSessions = async () => {
    try {
      await apiClient.sessions.endAllSessions();
      toast.success('All other sessions have been ended');
      
      // Refresh the session lists
      const response = await apiClient.sessions.getAll({ limit: 20 });
      const rawData = response.data.data;
      const sessions = Array.isArray(rawData) ? rawData : (rawData?.sessions || []);
      
      const active = sessions.filter((session: any) => session.isActive);
      const inactive = sessions
        .filter((session: any) => !session.isActive)
        .slice(0, 5);
      
      setActiveSessions(active);
      setRecentSessions(inactive);
    } catch (err) {
      console.error('Error ending all sessions:', err);
      toast.error('Failed to end all sessions. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

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
            Active Sessions ({activeSessions.length})
          </h2>
          <Button variant="destructive" onClick={handleEndAllSessions}>
            End All Other Sessions
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeSessions.length > 0 ? (
            activeSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                device={session.browser || session.device}
                location={session.location || "Unknown Location"}
                ipAddress={session.ipAddress || "Unknown IP"}
                activeSince={new Date(session.createdAt).toLocaleString()}
                lastActivity={new Date(session.lastActive).toLocaleString()}
                isCurrent={index === 0} // Mark the first session as current
                onEndSession={() => handleEndSession(session.id, session.device)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-white rounded-xl">
              <h3 className="text-lg mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
                No Active Sessions
              </h3>
              <p className="text-gray-600">You have no active sessions on other devices.</p>
            </div>
          )}
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
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSessions.length > 0 ? (
              recentSessions.map((session, index) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{session.browser || session.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>{session.location || "Unknown"}</TableCell>
                  <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(session.lastActive).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      session.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }>
                      {session.isActive ? 'Active' : 'Ended'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No recent sessions found
                </TableCell>
              </TableRow>
            )}
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