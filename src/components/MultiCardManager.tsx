import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Copy, Share2, MoreVertical, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import CardSettingsLIFF from './CardSettingsLIFF';
import CardPreview from './CardPreview';

interface CardData {
  id: string;
  name: string;
  companyName: string;
  jobTitle?: string;
  phone: string;
  email: string;
  photo?: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  lastModified: string;
  category?: string; // 分類：商務、個人、兼職等
}

interface MultiCardManagerProps {
  onClose: () => void;
}

const MultiCardManager: React.FC<MultiCardManagerProps> = ({ onClose }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [showCardSettings, setShowCardSettings] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [previewCardData, setPreviewCardData] = useState<any>(null);

  useEffect(() => {
    loadCards();
    
    // 監聽名片資料更新事件
    const handleCardDataUpdate = () => {
      loadCards();
    };

    window.addEventListener('cardDataUpdated', handleCardDataUpdate);
    return () => {
      window.removeEventListener('cardDataUpdated', handleCardDataUpdate);
    };
  }, []);

  const loadCards = () => {
    const savedCards = localStorage.getItem('aile-multi-cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    } else {
      // 如果沒有多名片資料，檢查是否有現有的單一名片資料
      const existingCardData = localStorage.getItem('aile-card-data');
      if (existingCardData) {
        const cardInfo = JSON.parse(existingCardData);
        const defaultCard: CardData = {
          id: 'default',
          name: cardInfo.name || '我的名片',
          companyName: cardInfo.companyName || '',
          jobTitle: cardInfo.jobTitle || '',
          phone: cardInfo.phone || '',
          email: cardInfo.email || '',
          photo: cardInfo.photo || null,
          isDefault: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          category: '商務'
        };
        setCards([defaultCard]);
        localStorage.setItem('aile-multi-cards', JSON.stringify([defaultCard]));
      }
    }
  };

  const saveCards = (updatedCards: CardData[]) => {
    setCards(updatedCards);
    localStorage.setItem('aile-multi-cards', JSON.stringify(updatedCards));
    
    // 同步預設名片到原有的儲存位置
    const defaultCard = updatedCards.find(card => card.isDefault);
    if (defaultCard) {
      const existingCardData = localStorage.getItem('aile-card-data');
      const cardData = existingCardData ? JSON.parse(existingCardData) : {};
      
      // 更新基本資訊，保留其他設定
      cardData.name = defaultCard.name;
      cardData.companyName = defaultCard.companyName;
      cardData.jobTitle = defaultCard.jobTitle;
      cardData.phone = defaultCard.phone;
      cardData.email = defaultCard.email;
      cardData.photo = defaultCard.photo;
      
      localStorage.setItem('aile-card-data', JSON.stringify(cardData));
      window.dispatchEvent(new CustomEvent('cardDataUpdated'));
    }
  };

  const handleCreateCard = () => {
    setEditingCardId(null);
    setShowCardSettings(true);
  };

  const handleEditCard = (cardId: string) => {
    setEditingCardId(cardId);
    
    // 載入該名片的完整資料到CardSettingsLIFF
    const card = cards.find(c => c.id === cardId);
    if (card) {
      // 如果編輯非預設名片，需要建立臨時的card-data
      const cardData = {
        id: cardId,
        name: card.name,
        companyName: card.companyName,
        jobTitle: card.jobTitle,
        phone: card.phone,
        email: card.email,
        photo: card.photo,
        // 其他欄位使用預設值或從localStorage載入
        website: '',
        address: '',
        introduction: '',
        birthday: '',
        gender: '',
        line: '',
        facebook: '',
        instagram: '',
        // 可見性設定
        nameVisible: true,
        companyNameVisible: true,
        jobTitleVisible: true,
        phoneVisible: true,
        mobilePhoneVisible: false,
        emailVisible: false,
        websiteVisible: true,
        addressVisible: true,
        introductionVisible: false,
        birthdayVisible: false,
        genderVisible: false,
        lineVisible: false,
        facebookVisible: false,
        instagramVisible: false
      };
      
      localStorage.setItem('aile-editing-card-data', JSON.stringify(cardData));
    }
    
    setShowCardSettings(true);
  };

  const handleDeleteCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card?.isDefault) {
      toast({
        title: "無法刪除",
        description: "預設名片無法刪除，請先設定其他名片為預設。"
      });
      return;
    }

    const updatedCards = cards.filter(card => card.id !== cardId);
    saveCards(updatedCards);
    
    toast({
      title: "名片已刪除",
      description: "電子名片已成功刪除。"
    });
  };

  const handleSetDefault = (cardId: string) => {
    const updatedCards = cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    saveCards(updatedCards);
    
    toast({
      title: "預設名片已更新",
      description: "已設定為新的預設名片。"
    });
  };

  const handleToggleActive = (cardId: string) => {
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isActive: !card.isActive } : card
    );
    saveCards(updatedCards);
    
    const card = cards.find(c => c.id === cardId);
    toast({
      title: card?.isActive ? "名片已停用" : "名片已啟用",
      description: card?.isActive ? "此名片將不會在分享時出現。" : "此名片現在可以正常分享。"
    });
  };

  const handleCopyCard = (cardId: string) => {
    const originalCard = cards.find(c => c.id === cardId);
    if (!originalCard) return;

    const newCard: CardData = {
      ...originalCard,
      id: `card_${Date.now()}`,
      name: `${originalCard.name} (副本)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedCards = [...cards, newCard];
    saveCards(updatedCards);
    
    toast({
      title: "名片已複製",
      description: "已建立名片副本，您可以編輯修改。"
    });
  };

  const handleShareCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    if (navigator.share) {
      navigator.share({
        title: `${card.name}的電子名片`,
        text: `${card.companyName} - ${card.name}`,
        url: `${window.location.origin}?cardId=${cardId}`
      });
    } else {
      navigator.clipboard.writeText(`${card.name}的電子名片 - ${card.companyName}`);
      toast({
        title: "已複製到剪貼板",
        description: "名片資訊已複製，可以分享給朋友。"
      });
    }
  };

  const handlePreviewCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // 構建預覽資料
    const previewData = {
      name: card.name,
      companyName: card.companyName,
      jobTitle: card.jobTitle,
      phone: card.phone,
      email: card.email,
      photo: card.photo,
      website: '',
      address: '',
      introduction: '',
      birthday: '',
      gender: '',
      line: '',
      facebook: '',
      instagram: '',
      socialMedia: [],
      // 可見性設定
      nameVisible: true,
      companyNameVisible: true,
      jobTitleVisible: true,
      phoneVisible: true,
      mobilePhoneVisible: false,
      emailVisible: false,
      websiteVisible: true,
      addressVisible: true,
      introductionVisible: false,
      birthdayVisible: false,
      genderVisible: false,
      lineVisible: false,
      facebookVisible: false,
      instagramVisible: false
    };

    setPreviewCardData(previewData);
    setShowCardPreview(true);
  };

  const handleCardSettingsClose = () => {
    setShowCardSettings(false);
    setEditingCardId(null);
    localStorage.removeItem('aile-editing-card-data');
    
    // 重新載入名片列表
    setTimeout(() => {
      loadCards();
    }, 100);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case '商務': return 'bg-blue-100 text-blue-800';
      case '個人': return 'bg-green-100 text-green-800';
      case '兼職': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCardSettings) {
    return <CardSettingsLIFF onClose={handleCardSettingsClose} />;
  }

  if (showCardPreview && previewCardData) {
    return (
      <CardPreview
        cardData={previewCardData}
        onClose={() => setShowCardPreview(false)}
        onEdit={() => {
          setShowCardPreview(false);
          // 找到對應的卡片並編輯
          const cardId = cards.find(c => 
            c.name === previewCardData.name && 
            c.companyName === previewCardData.companyName
          )?.id;
          if (cardId) {
            handleEditCard(cardId);
          }
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">我的電子名片</h1>
          </div>
          <Button
            onClick={handleCreateCard}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            <Plus className="w-4 h-4 mr-1" />
            新增名片
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* 統計資訊 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{cards.length}</p>
            <p className="text-xs text-blue-600">總名片數</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{cards.filter(c => c.isActive).length}</p>
            <p className="text-xs text-green-600">啟用中</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{cards.filter(c => c.isDefault).length}</p>
            <p className="text-xs text-purple-600">預設名片</p>
          </div>
        </div>

        {/* 名片列表 */}
        <div className="space-y-4">
          {cards.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">還沒有電子名片</h3>
              <p className="text-gray-600 mb-4">建立您的第一張電子名片，開始與他人分享聯絡資訊</p>
              <Button onClick={handleCreateCard} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                建立第一張名片
              </Button>
            </div>
          ) : (
            cards.map((card) => (
              <Card key={card.id} className={`${!card.isActive ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* 頭像 */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={card.photo || undefined} />
                      <AvatarFallback>{card.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    {/* 名片資訊 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{card.name}</h3>
                        {card.isDefault && (
                          <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            預設
                          </Badge>
                        )}
                        {!card.isActive && (
                          <Badge variant="outline" className="text-xs border-gray-400 text-gray-500">
                            已停用
                          </Badge>
                        )}
                      </div>
                      
                      {card.companyName && (
                        <p className="text-sm text-gray-600 truncate mb-1">{card.companyName}</p>
                      )}
                      
                      {card.jobTitle && (
                        <p className="text-xs text-gray-500 truncate mb-2">{card.jobTitle}</p>
                      )}

                      {card.category && (
                        <Badge className={`text-xs ${getCategoryColor(card.category)}`}>
                          {card.category}
                        </Badge>
                      )}
                    </div>

                    {/* 操作選單 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handlePreviewCard(card.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          預覽名片
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCard(card.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          編輯名片
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyCard(card.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          複製名片
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareCard(card.id)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          分享名片
                        </DropdownMenuItem>
                        {!card.isDefault && (
                          <DropdownMenuItem onClick={() => handleSetDefault(card.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            設為預設
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleToggleActive(card.id)}>
                          {card.isActive ? <StarOff className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                          {card.isActive ? '停用名片' : '啟用名片'}
                        </DropdownMenuItem>
                        {!card.isDefault && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除名片
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* 底部資訊 */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>建立於 {new Date(card.createdAt).toLocaleDateString()}</span>
                    <span>更新於 {new Date(card.lastModified).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiCardManager;