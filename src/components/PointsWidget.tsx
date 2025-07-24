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
  return null;
};
export default PointsWidget;