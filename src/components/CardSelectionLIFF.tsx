import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, User, Building2, Briefcase, Phone, Mail, Share2, Edit, QrCode, MessageCircle, Globe, Facebook, Instagram, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

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
  const [swipedCardId, setSwipedCardId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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

  const handleSwipeStart = (e: React.TouchEvent, cardId: string) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (moveE: TouchEvent) => {
      const currentTouch = moveE.touches[0];
      const diffX = startX - currentTouch.clientX;
      if (diffX > 50) {
        // 左滑超過50px
        setSwipedCardId(cardId);
      } else if (diffX < -20) {
        // 右滑回復
        setSwipedCardId(null);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleDeleteClick = (cardId: string) => {
    if (showDeleteConfirm === cardId) {
      // 確認刪除
      if (cardId === 'main') {
        // 不能刪除主要名片
        return;
      }
      
      const additionalCards = JSON.parse(localStorage.getItem('aile-additional-cards') || '[]');
      const updatedCards = additionalCards.filter((c: any, index: number) => `additional-${index}` !== cardId);
      localStorage.setItem('aile-additional-cards', JSON.stringify(updatedCards));
      
      // 重新載入卡片列表
      const newCards = cards.filter(c => c.id !== cardId);
      setCards(newCards);
      setShowDeleteConfirm(null);
      setSwipedCardId(null);
      
      // 顯示成功提示
      toast({
        title: "名片已刪除",
        description: "電子名片已成功刪除。"
      });
    } else {
      // 顯示刪除確認
      setShowDeleteConfirm(cardId);
    }
  };

  const handleEditCard = (card: CardInfo) => {
    // 設置編輯模式並關閉此介面
    localStorage.setItem('editing-card-data', JSON.stringify(card));
    onClose();
  };

  const handleShareCard = (card: CardInfo) => {
    handleCardClick(card);
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
              <div 
                key={card.id} 
                className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg"
                onTouchStart={!card.isDefault ? e => handleSwipeStart(e, card.id) : undefined}
              >
                {/* 刪除背景 (mobile swipe) */}
                {!card.isDefault && (
                  <div className={`absolute right-0 top-0 h-full bg-red-500 flex items-center justify-center text-white font-medium transition-all duration-300 ${
                    swipedCardId === card.id ? 'w-20' : 'w-0'
                  }`}>
                    <button 
                      onClick={() => handleDeleteClick(card.id)}
                      className="h-full w-full flex items-center justify-center"
                    >
                      刪除
                    </button>
                  </div>
                )}
                
                {/* 名片內容 */}
                <div className={`bg-white transition-transform duration-300 ${
                  swipedCardId === card.id ? '-translate-x-20' : 'translate-x-0'
                }`}>
                  {/* 名片頭部預覽 - 與聊天室風格一致 */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center space-x-3">
                      {card.photo && (
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <img src={card.photo} alt="頭像" className="w-10 h-10 rounded-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        {card.company && (
                          <p className="text-blue-100 text-xs">{card.company}</p>
                        )}
                        <h4 className="text-white text-base font-semibold">
                          {card.name || '您的姓名'}
                        </h4>
                        {card.title && (
                          <p className="text-blue-100 text-xs">{card.title}</p>
                        )}
                      </div>
                      {/* 名片類型標籤 */}
                      {card.isDefault && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          預設
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 基本聯絡資訊預覽 */}
                  <div className="p-3 space-y-2">
                    {card.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">📱</span>
                        <span className="text-gray-800">{card.phone}</span>
                      </div>
                    )}
                    {card.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">✉️</span>
                        <span className="text-gray-800">{card.email}</span>
                      </div>
                    )}
                    {card.line && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">💬</span>
                        <span className="text-gray-800">LINE: {card.line}</span>
                      </div>
                    )}
                    {card.website && (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">🌐</span>
                        <span className="text-gray-800">{card.website}</span>
                      </div>
                    )}
                  </div>

                  {/* 操作按鈕區域 */}
                  <div className="bg-gray-50 p-4">
                    <div className="flex space-x-2">
                      {/* 編輯按鈕 */}
                      <Button
                        onClick={() => handleEditCard(card)}
                        variant="outline"
                        className="flex-1 py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>編輯</span>
                      </Button>
                      
                      {/* 分享按鈕 */}
                      <Button
                        onClick={() => handleShareCard(card)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>分享</span>
                      </Button>
                      
                      {/* 刪除按鈕 (只顯示非預設名片) */}
                      {!card.isDefault && (
                        <Button
                          onClick={() => handleDeleteClick(card.id)}
                          variant={showDeleteConfirm === card.id ? "destructive" : "outline"}
                          className="flex-1 py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{showDeleteConfirm === card.id ? '確認刪除' : '刪除'}</span>
                        </Button>
                      )}
                    </div>
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