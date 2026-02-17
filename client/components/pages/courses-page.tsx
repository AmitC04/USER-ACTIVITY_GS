import { useState } from 'react';
import { CourseCard } from '@/components/course-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid3x3, List, BookOpen } from 'lucide-react';

export function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const courses = {
    active: [
      {
        title: 'AWS Solutions Architect Associate',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        progress: 65,
        enrolledDate: 'Jan 10, 2026',
        status: 'Active' as const,
        expiryDate: 'Jul 10, 2026',
      },
      {
        title: 'Azure Fundamentals',
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
        progress: 42,
        enrolledDate: 'Jan 5, 2026',
        status: 'Active' as const,
        expiryDate: 'Jul 5, 2026',
      },
      {
        title: 'Google Cloud Professional',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        progress: 28,
        enrolledDate: 'Dec 28, 2025',
        status: 'Active' as const,
        expiryDate: 'Jun 28, 2026',
      },
      {
        title: 'Kubernetes Administrator',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
        progress: 85,
        enrolledDate: 'Dec 20, 2025',
        status: 'Active' as const,
        expiryDate: 'Jun 20, 2026',
      },
      {
        title: 'DevOps Foundation',
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400',
        progress: 15,
        enrolledDate: 'Jan 15, 2026',
        status: 'Active' as const,
        expiryDate: 'Jul 15, 2026',
      },
    ],
    completed: [
      {
        title: 'Docker Fundamentals',
        thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400',
        progress: 100,
        enrolledDate: 'Nov 1, 2025',
        status: 'Completed' as const,
      },
      {
        title: 'Linux System Administration',
        thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400',
        progress: 100,
        enrolledDate: 'Oct 15, 2025',
        status: 'Completed' as const,
      },
      {
        title: 'Python for DevOps',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
        progress: 100,
        enrolledDate: 'Sep 20, 2025',
        status: 'Completed' as const,
      },
    ],
    expired: [
      {
        title: 'Jenkins CI/CD',
        thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400',
        progress: 72,
        enrolledDate: 'Jun 1, 2025',
        status: 'Expired' as const,
        expiryDate: 'Dec 1, 2025',
      },
      {
        title: 'Terraform Infrastructure',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        progress: 58,
        enrolledDate: 'May 15, 2025',
        status: 'Expired' as const,
        expiryDate: 'Nov 15, 2025',
      },
    ],
  };

  const allCourses = [...courses.active, ...courses.completed, ...courses.expired];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl mb-2" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          My Courses
        </h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All ({allCourses.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({courses.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({courses.completed.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({courses.expired.length})</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="progress">Progress (High to Low)</SelectItem>
                <SelectItem value="expiry">Expiry Date</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {allCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {courses.active.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {courses.completed.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expired">
          {courses.expired.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {courses.expired.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <BookOpen className="size-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
                No Expired Courses
              </h3>
              <p className="text-gray-600 mb-6">All your courses are up to date!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
