'use client';

import { useState, useEffect } from 'react';
import { TimelineEvent } from '@/components/timeline-event';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Lock, Globe, Mail, Shield, CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface SecurityEvent {
  id: string;
  type: string;
  icon: any;
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
}

export function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch user's security-related activities
        const response = await apiClient.activities.getAll({ 
          type: 'security',
          limit: 20 
        });
        const rawData = response.data.data;
        const activities = Array.isArray(rawData) ? rawData : (rawData?.activities || []);
        
        // Transform activities to security events
        const transformedEvents = activities.map((activity: any) => {
          let metadata = activity.metadata;
          if (typeof metadata === 'string') {
            try {
              metadata = JSON.parse(metadata);
            } catch {
              metadata = undefined;
            }
          }
          let icon, iconColor;
          switch (activity.type) {
            case 'password_changed':
              icon = Lock;
              iconColor = 'bg-blue-600';
              break;
            case 'login':
              icon = Globe;
              iconColor = 'bg-green-600';
              break;
            case 'profile_updated':
              icon = Mail;
              iconColor = 'bg-purple-600';
              break;
            case '2fa_enabled':
              icon = CheckCircle;
              iconColor = 'bg-green-600';
              break;
            case 'security_checkup':
              icon = Shield;
              iconColor = 'bg-blue-600';
              break;
            default:
              icon = Shield;
              iconColor = 'bg-gray-600';
          }

          return {
            id: activity.id,
            type: activity.type,
            icon,
            iconColor,
            title: activity.description,
            date: new Date(activity.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            location: metadata?.location,
            ipAddress: metadata?.ipAddress,
            device: metadata?.device,
            description: metadata?.description,
            action: activity.type === 'login' && metadata?.isNewDevice ? {
              label: 'This wasn\'t me?',
              onClick: () => toast.error('Security alert submitted. Our team will review this activity.')
            } : undefined
          };
        });

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching security events:', err);
        setError('Failed to load security events. Please try again later.');
        toast.error('Failed to load security events');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading security events...</span>
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
          Account Security
        </h1>
        <p className="text-gray-600">Track all security-related activities on your account</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Select defaultValue="30days">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="login">Logins</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="profile">Profile</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button variant="outline">
          <Download className="size-4 mr-2" /> Export Security Log
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="py-4">
          {events.length > 0 ? (
            events.map((event, index) => (
              <TimelineEvent
                key={event.id}
                icon={event.icon}
                iconColor={event.iconColor}
                title={event.title}
                date={event.date}
                location={event.location}
                ipAddress={event.ipAddress}
                device={event.device}
                description={event.description}
                action={event.action}
                isLast={index === events.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <Shield className="size-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
                No Security Events
              </h3>
              <p className="text-gray-600">Your account activity will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}