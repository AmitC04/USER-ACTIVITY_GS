import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title: string;
  thumbnail: string;
  progress: number;
  enrolledDate: string;
  status: 'Active' | 'Completed' | 'Expired';
  expiryDate?: string;
}

export function CourseCard({ title, thumbnail, progress, enrolledDate, status, expiryDate }: CourseCardProps) {
  const getProgressColor = () => {
    if (progress <= 30) return 'bg-orange-500';
    if (progress <= 70) return 'bg-blue-600';
    return 'bg-green-600';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-gray-100 text-gray-800';
    }
  };

  const getCTA = () => {
    switch (status) {
      case 'Active': return 'Continue Learning';
      case 'Completed': return 'View Certificate';
      case 'Expired': return 'Renew Access';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-[120px] bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg mb-3" style={{ color: '#2c3e50', fontWeight: 600 }}>{title}</h3>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-sm" style={{ color: '#2c3e50', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor()} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
          <span>Enrolled: {enrolledDate}</span>
          <Badge variant="secondary" className={getStatusColor()}>
            {status}
          </Badge>
        </div>

        {expiryDate && (
          <p className="text-xs text-gray-500 mb-3">Expires: {expiryDate}</p>
        )}

        <Button className="w-full" style={{ backgroundColor: '#3498db' }}>
          {getCTA()} <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
