import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, Plus, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import CreateCard from './CreateCard';

interface CardManagementProps {
  onClose: () => void;
}

const CardManagement: React.FC<CardManagementProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [swipedCardId, setSwipedCardId] = useState<string | null>(null);

  useEffect(() => {
    // 載入用戶資料
    const savedUserData = localStorage.getItem('aile-user-data');
    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);
      setUserData(parsedUserData);
    }

    // 載入主要名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const parsedCardData = JSON.parse(savedCardData);
      setCardData(parsedCardData);
    }
  }, []);

  const editCard = (card: any) => {
    localStorage.setItem('editing-card-data', JSON.stringify({
      ...card,
      id: 'current'
    }));
    setShowCreateCard(true);
  };

  const shareCard = (card: any) => {
    const shareData = {
      title: `${card.name} 的電子名片`,
      text: `查看 ${card.name} 的電子名片資訊`,
      url: window.location.origin
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.url);
      toast({
        title: "分享連結已複製",
        description: "電子名片分享連結已複製到剪貼簿"
      });
    }
  };

  const handleRegistrationComplete = () => {
    setShowCreateCard(false);
    // 重新載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const parsedCardData = JSON.parse(savedCardData);
      setCardData(parsedCardData);
    }
    
    // 重新載入多名片資料
    window.location.reload();
  };

  if (showCreateCard) {
    return (
      <CreateCard
        onClose={() => setShowCreateCard(false)}
        onRegistrationComplete={handleRegistrationComplete}
        userData={userData}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-white overflow-y-auto">
      {/* Content */}
      <div className="p-6">
        {/* 多名片管理區塊 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">電子名片列表</h3>
            <Button 
              size="sm" 
              className="bg-blue-500 hover:bg-blue-600 text-white" 
              onClick={() => {
                // 清除編輯狀態，設定為新增模式
                localStorage.removeItem('editing-card-data');
                localStorage.setItem('card-creation-mode', 'new');
                setShowCreateCard(true);
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* 名片列表 */}
          <div className="space-y-3">
            {(() => {
              const multiCards = JSON.parse(localStorage.getItem('aile-additional-cards') || '[]');
              const currentCard = cardData ? {
                ...cardData,
                id: 'current',
                name: cardData.name || '主要名片'
              } : null;
              const allCards = currentCard ? [currentCard, ...multiCards] : multiCards;

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

              const handleCardClick = (cardId: string) => {
                // 電腦版：點擊切換刪除選項顯示
                if (cardId !== 'current') {
                  setSwipedCardId(swipedCardId === cardId ? null : cardId);
                }
              };

              const handleDeleteCard = (card: any) => {
                const existingCards = JSON.parse(localStorage.getItem('aile-additional-cards') || '[]');
                const updatedCards = existingCards.filter((c: any) => c.id !== card.id);
                localStorage.setItem('aile-additional-cards', JSON.stringify(updatedCards));
                setSwipedCardId(null); // 重置滑動狀態
                window.location.reload();
                toast({
                  title: "名片已刪除",
                  description: "電子名片已成功刪除。"
                });
              };

              return allCards.length > 0 ? allCards.map((card, index) => (
                <div 
                  key={card.id || index} 
                  className="relative overflow-hidden bg-white rounded-lg border border-gray-200"
                  onTouchStart={card.id !== 'current' ? e => handleSwipeStart(e, card.id) : undefined}
                  onClick={() => handleCardClick(card.id)}
                >
                  {/* 刪除背景 */}
                  {card.id !== 'current' && (
                    <div className={`absolute right-0 top-0 h-full bg-red-500 flex items-center justify-center text-white font-medium transition-all duration-300 ${
                      swipedCardId === card.id ? 'w-20' : 'w-0'
                    }`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card);
                        }}
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
                    <Card className="border-0 shadow-none hover:border-blue-300 transition-colors">
                      <CardContent className="p-3">
                        {/* 電子名片展示 */}
                        <div 
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 cursor-pointer transition-all hover:shadow-md" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (card.id === 'current') {
                              editCard(cardData);
                            } else {
                              localStorage.setItem('editing-card-data', JSON.stringify(card));
                              setShowCreateCard(true);
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {/* 大頭照 */}
                            <div className="flex-shrink-0">
                              <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                                <AvatarImage src={card.photo || card.avatar || card.profileImage} alt={card.name} />
                                <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                                  {card.name ? card.name.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            
                            {/* 名片主要資訊 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-base truncate">{card.name}</h4>
                                {card.id === 'current' && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                                    預設
                                  </Badge>
                                )}
                              </div>
                              
                              {/* 職位與公司 */}
                              {card.jobTitle && (
                                <p className="text-sm font-medium text-gray-700 truncate mb-1">
                                  {card.jobTitle}
                                </p>
                              )}
                              
                              {/* 公司名稱 */}
                              {card.companyName && (
                                <p className="text-sm text-gray-600 truncate mb-1">
                                  {card.companyName}
                                </p>
                              )}
                              
                              {/* 聯絡資訊 */}
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                {(card.phone || card.mobilePhone) && (
                                  <span className="flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {((card.phone || card.mobilePhone) || '').length > 10 
                                      ? `${(card.phone || card.mobilePhone).slice(0, 10)}...` 
                                      : (card.phone || card.mobilePhone)}
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
                          </div>
                        </div>
                        
                        {/* 操作按鈕 */}
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-8 text-xs" 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (card.id === 'current') {
                                editCard(cardData);
                              } else {
                                localStorage.setItem('editing-card-data', JSON.stringify(card));
                                setShowCreateCard(true);
                              }
                            }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            編輯
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-8 text-xs" 
                            onClick={(e) => {
                              e.stopPropagation();
                              shareCard(card);
                            }}
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            分享
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>尚未建立任何名片</p>
                  <Button 
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => {
                      localStorage.removeItem('editing-card-data');
                      localStorage.setItem('card-creation-mode', 'new');
                      setShowCreateCard(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    建立第一張名片
                  </Button>
                </div>
              );
            })()}
          </div>
          
          {/* APP下載提示 */}
          <div className="mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 border border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1">
                    更多名片與個人化設置，請下載APP
                  </h3>
                  <p className="text-xs text-blue-100">
                    享受完整功能體驗
                  </p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-xs rounded-lg flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "即將前往下載",
                      description: "正在為您準備APP下載連結..."
                    });
                  }}
                >
                  立即下載
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardManagement;