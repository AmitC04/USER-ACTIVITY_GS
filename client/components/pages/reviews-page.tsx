import { useState, useEffect } from 'react';
import { ReviewCard } from '@/components/review-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface Review {
  id: string;
  courseTitle: string;
  rating: number;
  submittedDate: string;
  status: 'Published' | 'Pending' | 'Rejected';
  content: string;
  helpfulCount: number;
  replyCount: number;
}

interface PendingReview {
  id: string;
  thumbnail: string;
  title: string;
  completedDate: string;
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Fetch user's reviews
        const reviewsResponse = await apiClient.reviews.getAll();
        const reviewsRaw = reviewsResponse.data.data;
        const reviewsData = Array.isArray(reviewsRaw) ? reviewsRaw : (reviewsRaw?.reviews || []);
        
        // Transform reviews data
        const transformedReviews = reviewsData.map((review: any) => ({
          id: review.id,
          courseTitle: review.course.title,
          rating: review.rating,
          submittedDate: new Date(review.createdAt).toLocaleDateString(),
          status: review.status.charAt(0).toUpperCase() + review.status.slice(1) as 'Published' | 'Pending' | 'Rejected',
          content: review.content || '',
          helpfulCount: review.helpfulCount || 0,
          replyCount: review.replyCount || 0
        }));
        
        // Fetch completed courses that haven't been reviewed yet
        const enrollmentsResponse = await apiClient.enrollments.getAll({ status: 'completed' });
        const enrollmentsRaw = enrollmentsResponse.data.data;
        const enrollmentsData = Array.isArray(enrollmentsRaw) ? enrollmentsRaw : (enrollmentsRaw?.enrollments || []);
        const completedEnrollments = enrollmentsData.filter((enrollment: any) => {
          // Filter out courses that already have reviews
          return !reviewsData.some((review: any) => review.courseId === enrollment.courseId);
        });
        
        // Transform pending reviews data
        const transformedPendingReviews = completedEnrollments.map((enrollment: any) => ({
          id: enrollment.courseId,
          thumbnail: enrollment.course.thumbnail || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100',
          title: enrollment.course.title,
          completedDate: new Date(enrollment.completedAt || enrollment.enrolledAt).toLocaleDateString()
        }));

        setReviews(transformedReviews);
        setPendingReviews(transformedPendingReviews);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading reviews...</span>
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
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Star className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2" style={{ color: '#2c3e50', fontWeight: 600 }}>
              No Reviews Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Share your experience with courses you've completed!
            </p>
          </div>
        )}
      </div>

      {pendingReviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>
            Courses Awaiting Your Review
          </h3>
          <div className="border-t pt-4 space-y-4">
            {pendingReviews.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-4 rounded-lg border hover:border-blue-300 transition-colors">
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
      )}

      {reviews.length === 0 && pendingReviews.length === 0 && (
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