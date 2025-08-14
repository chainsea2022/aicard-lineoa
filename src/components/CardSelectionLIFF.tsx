import React, { useState, useEffect } from 'react';
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
  const [cards, setCards] = useState<CardInfo[]>([]);

  useEffect(() => {
    // 從localStorage加載用戶的名片數據
    const loadUserCards = () => {
      const cardData = localStorage.getItem('aile-card-data');
      const userData = localStorage.getItem('aile-user-data');
      
      if (cardData && userData) {
        const parsedCardData = JSON.parse(cardData);
        const parsedUserData = JSON.parse(userData);
        
        // 創建主要名片（預設名片）
        const mainCard: CardInfo = {
          id: 'main',
          name: parsedCardData.name || parsedUserData.name || '您的姓名',
          title: parsedCardData.jobTitle || '您的職位',
          company: parsedCardData.companyName || '您的公司',
          type: 'business',
          isDefault: true,
          phone: parsedCardData.phone || parsedCardData.mobilePhone || '',
          email: parsedCardData.email || '',
          website: parsedCardData.website || '',
          line: parsedCardData.line || '',
          facebook: parsedCardData.facebook || '',
          instagram: parsedCardData.instagram || '',
          photo: parsedCardData.photo || null,
          backgroundColor: '#1e40af',
          textColor: '#ffffff'
        };

        // 檢查是否有額外的名片數據
        const additionalCards = localStorage.getItem('aile-additional-cards');
        let allCards = [mainCard];
        
        if (additionalCards) {
          try {
            const parsed = JSON.parse(additionalCards);
            if (Array.isArray(parsed)) {
              const formattedAdditionalCards = parsed.map((card, index) => ({
                id: `additional-${index}`,
                name: card.name || mainCard.name,
                title: card.jobTitle || card.title || '',
                company: card.companyName || card.company || '',
                type: card.type || 'professional',
                isDefault: false,
                phone: card.phone || card.mobilePhone || '',
                email: card.email || '',
                website: card.website || '',
                line: card.line || '',
                facebook: card.facebook || '',
                instagram: card.instagram || '',
                photo: card.photo || mainCard.photo,
                backgroundColor: card.backgroundColor || '#7c3aed',
                textColor: card.textColor || '#ffffff'
              }));
              allCards = [...allCards, ...formattedAdditionalCards];
            }
          } catch (error) {
            console.error('Error parsing additional cards:', error);
          }
        }
        
        setCards(allCards);
      } else {
        // 如果沒有名片數據，顯示空狀態
        setCards([]);
      }
    };

    loadUserCards();
  }, []);

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
          {cards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">您還沒有任何電子名片</p>
              <Button onClick={onClose} variant="outline">
                先去建立名片
              </Button>
            </div>
          ) : (
            cards.map((card) => (
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
            ))
          )}
        </div>

      </div>
    </div>
  );
};