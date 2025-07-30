import React from 'react';
import { ArrowLeft, X, User, Building2, Briefcase, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CardInfo {
  id: string;
  name: string;
  title: string;
  company: string;
  type: 'personal' | 'business' | 'professional';
  isDefault?: boolean;
  phone?: string;
  email?: string;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  photo?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface CardSelectionLIFFProps {
  onClose: () => void;
  onCardSelect: (card: CardInfo) => void;
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
      isDefault: true,
      phone: '+886 912-345-678',
      email: 'ceo@abc-tech.com',
      website: 'https://abc-tech.com',
      line: 'zhang_ceo',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      backgroundColor: '#1e40af',
      textColor: '#ffffff'
    },
    {
      id: '2',
      name: '張小明',
      title: '產品經理',
      company: 'XYZ創新公司',
      type: 'professional',
      phone: '+886 987-654-321',
      email: 'pm@xyz-innovation.com',
      website: 'https://xyz-innovation.com',
      line: 'zhang_pm',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff'
    },
    {
      id: '3',
      name: '張小明',
      title: '個人名片',
      company: '自由工作者',
      type: 'personal',
      phone: '+886 900-123-456',
      email: 'personal@zhang.com',
      instagram: 'zhang_personal',
      facebook: 'zhang.xiaoming',
      backgroundColor: '#059669',
      textColor: '#ffffff'
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

  const handleCardClick = (card: CardInfo) => {
    onCardSelect(card);
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
              className={`cursor-pointer transition-all duration-200 ${getCardBorderColor(card.type)} hover:shadow-md active:scale-98`}
              onClick={() => handleCardClick(card)}
            >
              {/* 電子名片展示 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 m-3">
                <div className="flex items-center space-x-3">
                  {/* 大頭照 */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                      <AvatarImage src={card.photo} alt={card.name} />
                      <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                        {card.name ? card.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* 名片主要資訊 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-base truncate">{card.name}</h4>
                      {card.isDefault && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                          預設
                        </Badge>
                      )}
                    </div>
                    
                    {/* 職位 */}
                    {card.title && (
                      <p className="text-sm font-medium text-gray-700 truncate mb-1">
                        {card.title}
                      </p>
                    )}
                    
                    {/* 公司名稱 */}
                    {card.company && (
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {card.company}
                      </p>
                    )}
                    
                    {/* 聯絡資訊 */}
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {card.phone && (
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {card.phone.length > 10 ? `${card.phone.slice(0, 10)}...` : card.phone}
                        </span>
                      )}
                      {card.email && (
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {card.email.length > 15 ? `${card.email.slice(0, 15)}...` : card.email}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 狀態指示器 */}
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};