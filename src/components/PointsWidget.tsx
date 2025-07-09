
import React from 'react';
import { Coins, TrendingUp, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PointsWidgetProps {
  onPointsClick: () => void;
}

const PointsWidget: React.FC<PointsWidgetProps> = ({ onPointsClick }) => {
  const [currentPoints, setCurrentPoints] = React.useState(0);
  const [canRedeem, setCanRedeem] = React.useState(false);

  React.useEffect(() => {
    const savedPoints = localStorage.getItem('aile-user-points');
    if (savedPoints) {
      const points = parseInt(savedPoints);
      setCurrentPoints(points);
      setCanRedeem(points >= 50);
    }
  }, []);

  return (
    <Card 
      className="mb-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-orange-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      onClick={onPointsClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg">
                <Coins className="w-6 h-6" />
              </div>
              {canRedeem && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Gift className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-800">會員點數</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-orange-600">
                  {currentPoints.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">點</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            {canRedeem ? (
              <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs animate-pulse">
                可兌換！
              </Badge>
            ) : (
              <Badge className="bg-gray-400 text-white font-bold px-2 py-1 text-xs">
                累積中
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-orange-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {canRedeem ? '立即兌換商務版試用！' : `還需 ${50 - currentPoints} 點可兌換`}
            </span>
            <div className="flex items-center text-orange-600">
              <span className="font-medium">查看詳情</span>
              <div className="ml-1 w-0 h-0 border-l-4 border-l-orange-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsWidget;
