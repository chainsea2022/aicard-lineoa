import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, User, Building2, Briefcase, Phone, Mail, Share2, Edit, QrCode, MessageCircle, Globe, Facebook, Instagram } from 'lucide-react';
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

        <div className="space-y-4">
          {cards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">您還沒有任何電子名片</p>
              <Button onClick={onClose} variant="outline">
                先去建立名片
              </Button>
            </div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 完整名片預覽 */}
                <div 
                  className="p-6 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${card.backgroundColor}CC, ${card.backgroundColor}FF)`,
                    color: card.textColor 
                  }}
                >
                  {/* 名片頭像 */}
                  <div className="relative mb-4 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 overflow-hidden border-4 border-white/50 shadow-lg">
                      {card.photo ? (
                        <img 
                          src={card.photo} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/30 flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    {/* 名片類型圖標 */}
                    <div className="absolute -bottom-1 -right-8 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      {getCardIcon(card.type)}
                    </div>
                    {/* 預設標籤 */}
                    {card.isDefault && (
                      <div className="absolute -top-2 -left-8 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        預設
                      </div>
                    )}
                  </div>

                  {/* 基本資訊 */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-white">{card.name}</h3>
                    {card.title && (
                      <p className="text-sm text-white/90 font-medium">{card.title}</p>
                    )}
                    {card.company && (
                      <p className="text-sm text-white/80">{card.company}</p>
                    )}
                  </div>

                  {/* 詳細聯絡資訊 */}
                  <div className="space-y-2 text-sm text-white/90 mb-6">
                    {card.phone && (
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{card.phone}</span>
                      </div>
                    )}
                    {card.email && (
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{card.email}</span>
                      </div>
                    )}
                    {card.website && (
                      <div className="flex items-center justify-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>{card.website}</span>
                      </div>
                    )}
                    {card.line && (
                      <div className="flex items-center justify-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>LINE: {card.line}</span>
                      </div>
                    )}
                    
                    {/* 社群媒體 */}
                    {(card.facebook || card.instagram) && (
                      <div className="flex items-center justify-center space-x-4 pt-2">
                        {card.facebook && (
                          <div className="flex items-center space-x-1">
                            <Facebook className="w-4 h-4" />
                            <span className="text-xs">Facebook</span>
                          </div>
                        )}
                        {card.instagram && (
                          <div className="flex items-center space-x-1">
                            <Instagram className="w-4 h-4" />
                            <span className="text-xs">Instagram</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 操作按鈕區域 */}
                <div className="bg-gray-50 p-4 space-y-3">
                  {/* 主要選擇按鈕 */}
                  <Button
                    onClick={() => handleCardClick(card)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>選擇並發送此名片</span>
                  </Button>
                  
                  {/* 副功能按鈕 */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      className="flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>編輯</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>QR碼</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};