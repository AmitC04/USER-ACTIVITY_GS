import { TimelineEvent } from '@/components/timeline-event';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Lock, Globe, Mail, Shield, CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

export function SecurityPage() {
  const events = [
    {
      icon: Lock,
      iconColor: 'bg-blue-600',
      title: 'Password Changed',
      date: 'Jan 22, 2026 at 10:30 AM',
      location: 'Pune, Maharashtra, India',
      ipAddress: 'xxx.xxx.123.***',
      device: 'Chrome on Windows Desktop',
      description: 'Your password was successfully updated. If this wasn\'t you, contact support immediately.',
    },
    {
      icon: Globe,
      iconColor: 'bg-green-600',
      title: 'Login from New Device',
      date: 'Jan 20, 2026 at 2:15 PM',
      location: 'Mumbai, Maharashtra, India',
      ipAddress: 'xxx.xxx.234.***',
      device: 'Chrome on Windows',
      action: {
        label: 'This wasn\'t me?',
        onClick: () => toast.error('Security alert submitted. Our team will review this activity.'),
      },
    },
    {
      icon: Mail,
      iconColor: 'bg-purple-600',
      title: 'Email Updated',
      date: 'Jan 15, 2026 at 4:00 PM',
      location: 'Pune, Maharashtra, India',
      ipAddress: 'xxx.xxx.123.***',
      device: 'Chrome on Windows Desktop',
    },
    {
      icon: CheckCircle,
      iconColor: 'bg-green-600',
      title: 'Two-Factor Authentication Enabled',
      date: 'Jan 10, 2026 at 9:00 AM',
      location: 'Pune, Maharashtra, India',
      ipAddress: 'xxx.xxx.123.***',
      device: 'Chrome on Windows Desktop',
      description: 'You\'ve enabled 2FA for enhanced account security. Great job!',
    },
    {
      icon: Shield,
      iconColor: 'bg-blue-600',
      title: 'Security Checkup Completed',
      date: 'Jan 5, 2026 at 11:00 AM',
      location: 'Pune, Maharashtra, India',
      ipAddress: 'xxx.xxx.123.***',
      description: 'All security settings reviewed and updated. Your account is secure.',
    },
  ];

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
          {events.map((event, index) => (
            <TimelineEvent
              key={index}
              {...event}
              isLast={index === events.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
