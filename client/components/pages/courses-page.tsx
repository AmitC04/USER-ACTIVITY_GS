'use client';

import { useState, useEffect } from 'react';
import { CourseCard } from '@/components/course-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid3x3, List, BookOpen } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  progress: number;
  enrolledDate: string;
  status: 'Active' | 'Completed' | 'Expired';
  expiryDate?: string;
}

export function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courses, setCourses] = useState<{ active: Course[], completed: Course[], expired: Course[] }>({ 
    active: [], 
    completed: [], 
    expired: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.enrollments.getAll({ status: 'all' });
        const rawData = response.data.data;
        const enrollments = Array.isArray(rawData) ? rawData : (rawData?.enrollments || []);
        
        // Transform the enrollment data to match our expected course structure
        const transformedCourses = {
          active: enrollments.filter((enrollment: any) => 
            enrollment.status === 'active' || enrollment.status === 'in_progress'
          ).map((enrollment: any) => ({
            id: enrollment.id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
            progress: enrollment.progress,
            enrolledDate: new Date(enrollment.enrolledAt).toLocaleDateString(),
            status: 'Active' as const,
            expiryDate: enrollment.expiresAt ? new Date(enrollment.expiresAt).toLocaleDateString() : undefined
          })),
          
          completed: enrollments.filter((enrollment: any) => 
            enrollment.status === 'completed'
          ).map((enrollment: any) => ({
            id: enrollment.id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
            progress: enrollment.progress,
            enrolledDate: new Date(enrollment.enrolledAt).toLocaleDateString(),
            status: 'Completed' as const
          })),
          
          expired: enrollments.filter((enrollment: any) => 
            enrollment.status === 'expired'
          ).map((enrollment: any) => ({
            id: enrollment.id,
            title: enrollment.course.title,
            thumbnail: enrollment.course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
            progress: enrollment.progress,
            enrolledDate: new Date(enrollment.enrolledAt).toLocaleDateString(),
            status: 'Expired' as const,
            expiryDate: enrollment.expiresAt ? new Date(enrollment.expiresAt).toLocaleDateString() : undefined
          }))
        };
        
        setCourses(transformedCourses);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading courses...</span>
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
            {allCourses.length > 0 ? (
              allCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl col-span-full">
                <BookOpen className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
                  No Courses Yet
                </h3>
                <p className="text-gray-600 mb-6">Enroll in a course to get started!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {courses.active.length > 0 ? (
              courses.active.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <BookOpen className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
                  No Active Courses
                </h3>
                <p className="text-gray-600 mb-6">Consider enrolling in a new course!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {courses.completed.length > 0 ? (
              courses.completed.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl">
                <BookOpen className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
                  No Completed Courses
                </h3>
                <p className="text-gray-600 mb-6">Keep going, you're making progress!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="expired">
          {courses.expired.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {courses.expired.map((course) => (
                <CourseCard key={course.id} {...course} />
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
