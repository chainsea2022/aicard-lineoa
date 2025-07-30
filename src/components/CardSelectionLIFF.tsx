import React from 'react';
import { ArrowLeft, X, User, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CardInfo {
  id: string;
  name: string;
  title: string;
  company: string;
  type: 'personal' | 'business' | 'professional';
  isDefault?: boolean;
}

interface CardSelectionLIFFProps {
  onClose: () => void;
  onCardSelect: (cardId: string) => void;
}

export const CardSelectionLIFF: React.FC<CardSelectionLIFFProps> = ({
  onClose,
  onCardSelect
}) => {
  // 模擬多張名片數據
  const mockCards: CardInfo[] = [
    {
      id: '1',
      name: '張小明',
      title: '執行長',
      company: 'ABC科技有限公司',
      type: 'business',
      isDefault: true
    },
    {
      id: '2',
      name: '張小明',
      title: '產品經理',
      company: 'XYZ創新公司',
      type: 'professional'
    },
    {
      id: '3',
      name: '張小明',
      title: '個人名片',
      company: '自由工作者',
      type: 'personal'
    }
  ];

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'professional':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'personal':
        return <User className="w-5 h-5 text-green-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCardBorderColor = (type: string) => {
    switch (type) {
      case 'business':
        return 'border-blue-200 hover:border-blue-300';
      case 'professional':
        return 'border-purple-200 hover:border-purple-300';
      case 'personal':
        return 'border-green-200 hover:border-green-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  const handleCardClick = (cardId: string) => {
    onCardSelect(cardId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LIFF style */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-bold text-lg">我的電子名片</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="mb-4">
          <p className="text-gray-600 text-sm">請選擇要分享的電子名片：</p>
        </div>

        <div className="space-y-3">
          {mockCards.map((card) => (
            <Card 
              key={card.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${getCardBorderColor(card.type)} hover:shadow-md active:scale-98`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getCardIcon(card.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{card.name}</h3>
                    {card.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        預設
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{card.title}</p>
                  <p className="text-xs text-gray-500 truncate">{card.company}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Card Button */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full h-12 border-dashed border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
            onClick={() => {
              // 可以在這裡添加新增名片的邏輯
              console.log('新增名片');
            }}
          >
            <span className="text-xl mr-2">+</span>
            新增電子名片
          </Button>
        </div>
      </div>
    </div>
  );
};