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
  return <Card className="mb-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-orange-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" onClick={onPointsClick}>
      
    </Card>;
};
export default PointsWidget;