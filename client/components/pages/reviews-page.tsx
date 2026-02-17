import { ReviewCard } from '@/components/review-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';

export function ReviewsPage() {
  const reviews = [
    {
      courseTitle: 'AWS Solutions Architect Associate',
      rating: 5,
      submittedDate: 'Jan 18, 2026',
      status: 'Published' as const,
      content: 'Excellent course! The hands-on labs were particularly helpful for understanding AWS services in depth. Highly recommend this to anyone preparing for the certification exam.',
      helpfulCount: 24,
      replyCount: 2,
    },
    {
      courseTitle: 'Docker Fundamentals',
      rating: 4,
      submittedDate: 'Jan 10, 2026',
      status: 'Published' as const,
      content: 'Great introduction to Docker and containerization. The practical examples made it easy to follow along. Would have liked more advanced topics covered.',
      helpfulCount: 15,
      replyCount: 1,
    },
    {
      courseTitle: 'Kubernetes Administrator',
      rating: 5,
      submittedDate: 'Jan 5, 2026',
      status: 'Pending' as const,
      content: 'Comprehensive coverage of Kubernetes concepts. The instructor explained complex topics in a very clear manner. Looking forward to applying this knowledge in production.',
      helpfulCount: 0,
      replyCount: 0,
    },
  ];

  const pendingReviews = [
    {
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100',
      title: 'Azure Fundamentals',
      completedDate: 'Jan 15, 2026',
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100',
      title: 'Google Cloud Essentials',
      completedDate: 'Dec 28, 2025',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl mb-2" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
          My Reviews & Ratings
        </h1>
      </div>

      <div className="flex gap-3 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="published">Published Only</SelectItem>
            <SelectItem value="pending">Pending Moderation</SelectItem>
            <SelectItem value="drafts">Drafts</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="recent">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 mb-8">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>
          Courses Awaiting Your Review
        </h3>
        <div className="border-t pt-4 space-y-4">
          {pendingReviews.map((course, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:border-blue-300 transition-colors">
              <div className="size-16 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-base mb-1" style={{ color: '#2c3e50', fontWeight: 600 }}>
                  {course.title}
                </h4>
                <p className="text-sm text-gray-600">Completed: {course.completedDate}</p>
              </div>
              <Button style={{ backgroundColor: '#3498db' }}>
                Write Review
              </Button>
            </div>
          ))}
        </div>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <Star className="size-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
            No Reviews Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Share your experience with courses you've completed!
          </p>
          <Button style={{ backgroundColor: '#3498db' }}>
            View Completed Courses
          </Button>
        </div>
      )}
    </div>
  );
}
