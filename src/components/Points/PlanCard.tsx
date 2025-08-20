import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, Crown } from 'lucide-react';

interface PlanFeature {
  name: string;
  value: string;
}

interface PlanCardProps {
  type: 'free' | 'elite' | 'premium';
  title: string;
  price: string;
  yearlyPrice?: string;
  features: PlanFeature[];
  isCurrentPlan?: boolean;
}

const planIcons = {
  free: Shield,
  elite: Star,
  premium: Crown
};

const planColors = {
  free: {
    bg: 'from-green-50 to-green-100',
    border: 'border-green-200',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700'
  },
  elite: {
    bg: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  premium: {
    bg: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700'
  }
};

const PlanCard: React.FC<PlanCardProps> = ({
  type,
  title,
  price,
  yearlyPrice,
  features,
  isCurrentPlan = false
}) => {
  const Icon = planIcons[type];
  const colors = planColors[type];

  return (
    <div className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-xl p-4 relative`}>
      {isCurrentPlan && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-600 text-white text-xs">
            目前方案
          </Badge>
        </div>
      )}
      
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Icon className={`w-6 h-6 ${colors.text} mr-2`} />
          <h3 className={`text-lg font-bold ${colors.text}`}>{title}</h3>
        </div>
        <p className={`text-2xl font-bold ${colors.text}`}>{price}</p>
        {yearlyPrice && (
          <p className={`text-sm ${colors.text}`}>年優惠：{yearlyPrice}</p>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex justify-between items-center py-1 text-sm">
            <span className={colors.text}>{feature.name}</span>
            <span className={`font-medium ${colors.text}`}>{feature.value}</span>
          </div>
        ))}
      </div>
      
      <Button className={`w-full ${colors.button} text-white font-semibold py-2`}>
        立即升級
      </Button>
    </div>
  );
};

export default PlanCard;