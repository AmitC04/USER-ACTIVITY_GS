'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/metric-card';
import { ActivityFeedItem } from '@/components/activity-feed-item';
import { BookOpen, CheckCircle, Award, Flame, GraduationCap, ShoppingCart, Star, Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface DashboardData {
  id: string;
  title: string;
  value: string;
  type: string;
  period: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  isRead: boolean;
}

interface QuickStats {
  loginDays: number;
  totalDays: number;
  testsCompleted: number;
  reviewsWritten: number;
  learningTime: string;
}

export function OverviewPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.dashboard.getData();
        const { dashboardData, recentActivities, quickStats } = response.data.data;
        
        setDashboardData(dashboardData);
        setRecentActivities(recentActivities);
        setQuickStats(quickStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading dashboard...</span>
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

  // Map activity types to icons
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_enrolled':
        return GraduationCap;
      case 'course_completed':
        return CheckCircle;
      case 'order_placed':
        return ShoppingCart;
      case 'review_submitted':
        return Star;
      case 'login':
        return LogIn;
      case 'password_changed':
        return Shield;
      default:
        return GraduationCap;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          My Activity Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! 👋</p>
        <p className="text-sm text-gray-500">Here's your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardData.map((metric) => {
          let icon;
          switch (metric.title) {
            case 'Total Enrollments':
              icon = BookOpen;
              break;
            case 'Active Courses':
              icon = CheckCircle;
              break;
            case 'Certifications Completed':
              icon = Award;
              break;
            case 'Current Streak':
              icon = Flame;
              break;
            default:
              icon = BookOpen;
          }

          return (
            <MetricCard 
              key={metric.id}
              icon={icon} 
              value={parseInt(metric.value) || metric.value} 
              label={metric.title} 
              color={
                metric.title === 'Total Enrollments' ? 'text-blue-600' :
                metric.title === 'Active Courses' ? 'text-green-600' :
                metric.title === 'Certifications Completed' ? 'text-purple-600' :
                'text-orange-600'
              } 
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl" style={{ color: '#2c3e50', fontWeight: 600 }}>
                Recent Activity
              </h2>
              <div className="flex gap-2">
                <Select defaultValue="7days">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="courses">Courses</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="reviews">Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <ActivityFeedItem 
                      key={activity.id}
                      icon={Icon}
                      description={activity.description}
                      timestamp={new Date(activity.createdAt).toLocaleDateString('en-US', { 
                        hour: 'numeric', 
                        minute: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      isUnread={activity.isRead}
                    />
                  );
                })
              ) : (
                <div className="p-4 text-center text-gray-500">No recent activities</div>
              )}
            </div>
            <div className="p-4 text-center border-t">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>
              Quick Stats
            </h3>
            <p className="text-sm text-gray-600 mb-4">This Month</p>

            {quickStats && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Login Days</span>
                  <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>
                    {quickStats.loginDays}/{quickStats.totalDays}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ 
                      width: `${Math.round((quickStats.loginDays / quickStats.totalDays) * 100)}%` 
                    }} 
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-700">Tests Completed</span>
                  <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>
                    {quickStats.testsCompleted}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Reviews Written</span>
                  <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>
                    {quickStats.reviewsWritten}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Learning Time</span>
                  <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>
                    {quickStats.learningTime}
                  </span>
                </div>
              </div>
            )}

            <Button variant="link" className="w-full mt-6" style={{ color: '#3498db' }}>
              View All Analytics →
            </Button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm p-6 mt-6 text-white">
            <div className="text-center">
              <div className="text-5xl mb-3">🔥</div>
              <h3 className="text-2xl mb-2" style={{ fontWeight: 'bold' }}>
                {dashboardData.find(d => d.title === 'Current Streak')?.value || '7 Days'}
              </h3>
              <p className="text-sm opacity-90 mb-4">Keep it going! Next goal: 30 days</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-xs opacity-75 mb-1">{day}</div>
                    <div className="size-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
