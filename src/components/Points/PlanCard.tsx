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
    bg: 'bg-white',
    border: 'border-gray-100',
    text: 'text-gray-900',
    accent: 'text-green-600',
    button: 'bg-gray-900 hover:bg-gray-800'
  },
  elite: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    text: 'text-gray-900',
    accent: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  premium: {
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    border: 'border-purple-100',
    text: 'text-gray-900',
    accent: 'text-purple-600',
    button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
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
    <div className={`${colors.bg} border ${colors.border} rounded-2xl p-5 relative shadow-sm hover:shadow-md transition-shadow`}>
      {isCurrentPlan && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            目前方案
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${colors.accent}`} />
        </div>
        <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>{title}</h3>
        <div className="flex items-baseline justify-center space-x-1">
          <span className={`text-3xl font-bold ${colors.accent}`}>{price}</span>
          {price !== 'Free' && <span className="text-gray-500 text-sm">/月</span>}
        </div>
        {yearlyPrice && (
          <p className="text-sm text-gray-500 mt-1">年付優惠：{yearlyPrice}</p>
        )}
      </div>
      
      <div className="space-y-3 mb-6">
        {features.slice(0, 4).map((feature, index) => (
          <div key={index} className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-600">{feature.name}</span>
            <span className="text-sm font-medium text-gray-900">{feature.value}</span>
          </div>
        ))}
        {features.length > 4 && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">+{features.length - 4} 項功能</span>
          </div>
        )}
      </div>
      
      <Button className={`w-full ${colors.button} text-white font-medium py-3 rounded-xl shadow-sm`}>
        {isCurrentPlan ? '目前方案' : '立即升級'}
      </Button>
    </div>
  );
};

export default PlanCard;