import { Star, Edit, MoreVertical, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  courseTitle: string;
  rating: number;
  submittedDate: string;
  status: 'Published' | 'Pending' | 'Draft' | 'Rejected';
  content: string;
  helpfulCount: number;
  replyCount: number;
}

export function ReviewCard({ courseTitle, rating, submittedDate, status, content, helpfulCount, replyCount }: ReviewCardProps) {
  const getStatusBadge = () => {
    const configs = {
      Published: { icon: '📝', color: 'bg-green-100 text-green-800' },
      Pending: { icon: '⏳', color: 'bg-yellow-100 text-yellow-800' },
      Draft: { icon: '✏️', color: 'bg-gray-100 text-gray-800' },
      Rejected: { icon: '🚫', color: 'bg-red-100 text-red-800' }
    };
    const config = configs[status];
    return (
      <Badge variant="secondary" className={config.color}>
        {config.icon} {status}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg flex-1" style={{ color: '#2c3e50', fontWeight: 600 }}>
          {courseTitle}
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="size-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`size-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm" style={{ color: '#2c3e50', fontWeight: 600 }}>
            {rating}.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
        <span>Submitted: {submittedDate}</span>
        <span>|</span>
        {getStatusBadge()}
      </div>

      <div className="border-t pt-4 mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          {content}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <ThumbsUp className="size-4" /> Helpful ({helpfulCount})
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-4" /> {replyCount} Replies
          </span>
        </div>
        <Button variant="link" style={{ color: '#3498db' }}>
          Read Full Review →
        </Button>
      </div>
    </div>
  );
}
