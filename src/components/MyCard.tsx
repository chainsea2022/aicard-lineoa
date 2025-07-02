
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, QrCode, Download, Zap, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MyCardProps {
  onClose: () => void;
  onCustomerAdded?: (customer: any) => void;
}

interface CardData {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  line: string;
  facebook: string;
  instagram: string;
  photo: string | null;
}

interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isCard?: boolean;
  cardData?: CardData;
}

const MyCard: React.FC<MyCardProps> = ({ onClose, onCustomerAdded }) => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('aile-card-data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCardData(data);
      
      // 初始化聊天訊息，包含電子名片預覽
      const initialMessages: ChatMessage[] = [
        {
          id: 1,
          text: "這是您的電子名片預覽：",
          isBot: true,
          timestamp: new Date()
        },
        {
          id: 2,
          text: "",
          isBot: true,
          timestamp: new Date(),
          isCard: true,
          cardData: data
        },
        {
          id: 3,
          text: "💡 建議您加入 AIWOW 名片簿，享受更多便利功能！透過 AIWOW LINE OA，您可以：\n\n• 註冊即獲100可兌換點\n📱 最方便的電子名片簿\n📊 獲得詳細的名片互動數據\n🚀 使用更多智能商務功能",
          isBot: true,
          timestamp: new Date()
        }
      ];
      setMessages(initialMessages);
    }

    // 監聽來自其他組件的客戶加入事件
    const handleCustomerScan = (event: CustomEvent) => {
      const newCustomer = event.detail;
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        text: `🎉 ${newCustomer.name} 已透過掃描您的名片加入客戶列表！`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      if (onCustomerAdded) {
        onCustomerAdded(newCustomer);
      }
    };

    window.addEventListener('customerScannedCard', handleCustomerScan as EventListener);
    
    return () => {
      window.removeEventListener('customerScannedCard', handleCustomerScan as EventListener);
    };
  }, [messages.length, onCustomerAdded]);

  const handleShare = () => {
    const shareUrl = `https://aile.app/card/${cardData?.name || 'user'}`;
    
    // 模擬分享功能
    if (navigator.share) {
      navigator.share({
        title: `${cardData?.name} 的電子名片`,
        text: `查看 ${cardData?.name} 的電子名片`,
        url: shareUrl,
      });
    } else {
      // 複製到剪貼板作為備用方案
      navigator.clipboard.writeText(shareUrl);
    }

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: "您的電子名片分享連結已準備好！當有人透過此連結查看您的名片時，將會自動加入您的客戶列表。",
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    toast({
      title: "分享成功！",
      description: "您的電子名片已準備好分享。",
    });
  };

  const generateQRCode = () => {
    setShowQR(true);
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: "QR Code 已生成！其他人可以掃描此 QR Code 來獲取您的名片並自動加入您的客戶列表。",
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // 模擬 QR Code 被掃描的情況 (測試用)
    setTimeout(() => {
      const mockCustomer = {
        id: Date.now(),
        name: '測試客戶',
        phone: '0912345678',
        email: 'test@example.com',
        company: '測試公司',
        photo: null,
        isAileUser: Math.random() > 0.5, // 隨機決定是否為 Aile 用戶
        addedVia: 'qrcode'
      };
      
      // 觸發客戶加入事件
      const event = new CustomEvent('customerScannedCard', { detail: mockCustomer });
      window.dispatchEvent(event);
    }, 3000);
    
    toast({
      title: "QR Code 已生成！",
      description: "其他人可以掃描此 QR Code 來獲取您的名片。",
    });
  };

  const handleJoinAIWOW = () => {
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: "感謝您的興趣！請點擊以下連結加入 AIWOW LINE OA，開始享受更多智能商務功能。",
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  if (!cardData) {
    return (
      <div className="absolute inset-0 bg-white z-50">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">我的電子名片</h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="text-gray-400 mb-4">
            <QrCode className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">尚未建立名片</h2>
          <p className="text-gray-600 mb-6">請先建立您的電子名片，才能在此查看和分享。</p>
          <Button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600"
          >
            返回建立名片
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <h1 className="font-bold text-lg">AILE 智能助手</h1>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
        {messages.map((message) => (
          <div key={message.id} className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              {/* Bot Avatar */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  {message.isCard && message.cardData ? (
                    /* Electronic Business Card Preview with integrated buttons */
                    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg mb-2">
                      {/* Business Card */}
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl p-4 text-white">
                        <div className="flex items-center space-x-3 mb-3">
                          {message.cardData.photo && (
                            <img
                              src={message.cardData.photo}
                              alt="照片"
                              className="w-12 h-12 rounded-full object-cover border-2 border-white"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-bold">{message.cardData.name}</h3>
                            <p className="text-blue-100 text-sm">{message.cardData.companyName}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          {message.cardData.phone && (
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              <span>{message.cardData.phone}</span>
                            </div>
                          )}
                          {message.cardData.email && (
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              <span>{message.cardData.email}</span>
                            </div>
                          )}
                          {message.cardData.website && (
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              <span>{message.cardData.website}</span>
                            </div>
                          )}
                        </div>

                        {/* Social Media Links */}
                        {(message.cardData.line || message.cardData.facebook || message.cardData.instagram) && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs text-blue-100 mb-1">社群媒體</p>
                            <div className="space-y-1 text-xs">
                              {message.cardData.line && <div>LINE: {message.cardData.line}</div>}
                              {message.cardData.facebook && <div>Facebook: {message.cardData.facebook}</div>}
                              {message.cardData.instagram && <div>Instagram: {message.cardData.instagram}</div>}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Integrated QR Code and Buttons */}
                      <div className="p-4 bg-gray-50 rounded-b-xl">
                        {/* QR Code */}
                        {showQR && (
                          <div className="mb-4 text-center">
                            <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <QrCode className="w-16 h-16 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-600">掃描 QR Code 獲取名片</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={generateQRCode}
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
                          >
                            <QrCode className="w-3 h-3 mr-1" />
                            QR Code
                          </Button>
                          
                          <Button
                            onClick={handleShare}
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs h-8"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            分享
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Regular Chat Message */
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-800 whitespace-pre-line">{message.text}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1 ml-2">
                    {message.timestamp.toLocaleTimeString('zh-TW', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* AIWOW Recommendation Card */}
        <div className="flex justify-start">
          <div className="max-w-xs lg:max-w-md">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2 text-sm">🎯 AIWOW 推薦</h4>
                <p className="text-xs text-blue-700 mb-3">
                  升級至 AIWOW 名片簿，解鎖更多商務功能！
                </p>
                <Button
                  onClick={handleJoinAIWOW}
                  size="sm"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
                >
                  了解更多
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
