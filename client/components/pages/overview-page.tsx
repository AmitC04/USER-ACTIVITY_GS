import { MetricCard } from '@/components/metric-card';
import { ActivityFeedItem } from '@/components/activity-feed-item';
import { BookOpen, CheckCircle, Award, Flame, GraduationCap, ShoppingCart, Star, Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function OverviewPage() {
  const activities = [
    { icon: GraduationCap, description: 'Enrolled in AWS Solutions Architect Associate', timestamp: '2 hours ago', isUnread: true },
    { icon: CheckCircle, description: 'Completed module "IAM & Security" in Azure Fundamentals', timestamp: '5 hours ago' },
    { icon: ShoppingCart, description: 'Purchase completed - Order #10234 (₹3,500)', timestamp: '1 day ago' },
    { icon: Star, description: 'Submitted review for Google Cloud Essentials', timestamp: '2 days ago' },
    { icon: LogIn, description: 'Logged in from new device (Mumbai)', timestamp: '3 days ago' },
    { icon: Shield, description: 'Password changed successfully', timestamp: '5 days ago' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          My Activity Dashboard
        </h1>
        <p className="text-gray-600">Welcome back, Rajesh! 👋</p>
        <p className="text-sm text-gray-500">Here's your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={BookOpen} value={12} label="Total Enrollments" color="text-blue-600" />
        <MetricCard icon={CheckCircle} value={5} label="Active Courses" color="text-green-600" />
        <MetricCard icon={Award} value={3} label="Certifications Completed" color="text-purple-600" />
        <MetricCard icon={Flame} value="7 Days" label="Current Streak" color="text-orange-600" />
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
              {activities.map((activity, index) => (
                <ActivityFeedItem 
                  key={index}
                  icon={activity.icon}
                  description={activity.description}
                  timestamp={activity.timestamp}
                  isUnread={activity.isUnread}
                />
              ))}
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Login Days</span>
                <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>15/31</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '48%' }} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-700">Tests Completed</span>
                <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>4</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Reviews Written</span>
                <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>2</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Learning Time</span>
                <span className="text-lg" style={{ color: '#2c3e50', fontWeight: 600 }}>12h 35m</span>
              </div>
            </div>

            <Button variant="link" className="w-full mt-6" style={{ color: '#3498db' }}>
              View All Analytics →
            </Button>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-sm p-6 mt-6 text-white">
            <div className="text-center">
              <div className="text-5xl mb-3">🔥</div>
              <h3 className="text-2xl mb-2" style={{ fontWeight: 'bold' }}>7 Day Streak!</h3>
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
