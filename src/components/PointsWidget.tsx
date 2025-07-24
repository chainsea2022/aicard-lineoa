import React from 'react';
import { Coins, TrendingUp, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface PointsWidgetProps {
  onPointsClick: () => void;
}
const PointsWidget: React.FC<PointsWidgetProps> = ({
  onPointsClick
}) => {
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
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onPointsClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">會員點數</h3>
              <p className="text-2xl font-bold text-orange-600">{currentPoints}</p>
            </div>
          </div>
          <div className="text-right">
            {canRedeem ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Gift className="w-3 h-3 mr-1" />
                可兌換
              </Badge>
            ) : (
              <p className="text-sm text-gray-500">
                還需 {50 - currentPoints} 點
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default PointsWidget;