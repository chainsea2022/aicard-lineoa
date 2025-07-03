
import React, { useState, useEffect } from 'react';
import { Plus, X, User, Zap, Scan, Users, BarChart3, Calendar, Send, Bot, QrCode, UserPlus, Edit, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCard from './CreateCard';
import MyCard from './MyCard';
import Scanner from './Scanner';
import MyCustomers from './MyCustomers';
import Analytics from './Analytics';
import Schedule from './Schedule';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isCard?: boolean;
  cardData?: any;
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

const menuItems: MenuItem[] = [
  { id: 'create-card', title: '建立電子名片', icon: User, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { id: 'my-card', title: '我的電子名片', icon: Zap, color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'scanner', title: '掃描', icon: Scan, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'customers', title: '我的客戶', icon: Users, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { id: 'analytics', title: '數據分析', icon: BarChart3, color: 'bg-gradient-to-br from-red-500 to-red-600' },
  { id: 'schedule', title: '行程管理', icon: Calendar, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
];

// 模擬客戶名稱生成器
const generateRandomCustomerName = () => {
  const surnames = ['王', '李', '張', '陳', '林', '黃', '吳', '劉', '蔡', '楊'];
  const names = ['大頭', '小明', '美麗', '志強', '淑芬', '建國', '雅婷', '俊傑', '麗華', '文雄'];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return surname + name;
};

const ChatRoom = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '歡迎使用 AILE！請點選下方圖文選單開始使用各項功能。', isBot: true, timestamp: new Date() }
  ]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // 監聽客戶加入事件
    const handleCustomerAdded = (event: CustomEvent) => {
      const newCustomer = event.detail;
      
      // 添加新客戶到列表
      setCustomers(prev => [...prev, newCustomer]);
      
      // 添加聊天通知
      const customerName = generateRandomCustomerName();
      const newMessage = {
        id: Date.now(),
        text: `🎉 ${customerName}已加入您的客戶列表！`,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
    };

    window.addEventListener('customerScannedCard', handleCustomerAdded as EventListener);
    
    return () => {
      window.removeEventListener('customerScannedCard', handleCustomerAdded as EventListener);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputText,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      
      // 模擬機器人回應
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: '收到您的訊息！如需使用功能請點選下方選單。',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === 'my-card') {
      // 檢查是否有名片資料
      const savedData = localStorage.getItem('aile-card-data');
      if (savedData) {
        const cardData = JSON.parse(savedData);
        
        // 在聊天室中顯示名片
        const cardMessage: Message = {
          id: Date.now(),
          text: "這是您的電子名片：",
          isBot: true,
          timestamp: new Date()
        };
        
        const cardPreviewMessage: Message = {
          id: Date.now() + 1,
          text: "",
          isBot: true,
          timestamp: new Date(),
          isCard: true,
          cardData: cardData
        };
        
        setMessages(prev => [...prev, cardMessage, cardPreviewMessage]);
      } else {
        const noCardMessage: Message = {
          id: Date.now(),
          text: "您尚未建立電子名片，請先建立您的名片。",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, noCardMessage]);
      }
      setIsMenuOpen(false);
    } else {
      setActiveView(itemId);
      setIsMenuOpen(false);
    }
  };

  const handleCloseView = () => {
    setActiveView(null);
    setIsMenuOpen(true);
  };

  const handleCustomerAdded = (customer: any) => {
    setCustomers(prev => [...prev, customer]);
  };

  // 處理名片內的操作
  const handleCardAction = (action: string, cardData: any) => {
    const customerName = generateRandomCustomerName();
    
    switch (action) {
      case 'qrcode':
        setShowQR(true);
        const qrMessage: Message = {
          id: Date.now(),
          text: "QR Code 已生成！其他人可以掃描此 QR Code 來獲取您的名片。",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, qrMessage]);
        
        // 模擬 QR Code 被掃描
        setTimeout(() => {
          const scanMessage: Message = {
            id: Date.now(),
            text: `🎉 ${customerName}已加入您的客戶列表！`,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, scanMessage]);
        }, 3000);
        
        toast({
          title: "QR Code 已生成！",
          description: "其他人可以掃描此 QR Code 來獲取您的名片。"
        });
        break;
        
      case 'addContact':
        const addMessage: Message = {
          id: Date.now(),
          text: `🎉 ${customerName}已加入您的客戶列表！`,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, addMessage]);
        toast({
          title: "已加入聯絡人",
          description: "名片已成功加入聯絡人清單。"
        });
        break;
        
      case 'createCard':
        const createMessage: Message = {
          id: Date.now(),
          text: "正在為您建立電子名片模板，您可以編輯個人資訊和自訂設計。",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, createMessage]);
        break;
        
      case 'share':
        const shareUrl = `https://aile.app/card/${cardData?.name || 'user'}`;
        
        if (navigator.share) {
          navigator.share({
            title: `${cardData?.name} 的電子名片`,
            text: `查看 ${cardData?.name} 的電子名片`,
            url: shareUrl
          }).catch(() => {
            // 如果分享失敗，複製到剪貼板
            navigator.clipboard.writeText(shareUrl);
          });
        } else {
          navigator.clipboard.writeText(shareUrl);
        }
        
        const shareMessage: Message = {
          id: Date.now(),
          text: "您的電子名片分享連結已準備好！",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, shareMessage]);
        toast({
          title: "分享成功！",
          description: "您的電子名片已準備好分享。"
        });
        break;
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'create-card':
        return <CreateCard onClose={handleCloseView} />;
      case 'scanner':
        return <Scanner onClose={handleCloseView} />;
      case 'customers':
        return <MyCustomers onClose={handleCloseView} customers={customers} onCustomersUpdate={setCustomers} />;
      case 'analytics':
        return <Analytics onClose={handleCloseView} />;
      case 'schedule':
        return <Schedule onClose={handleCloseView} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white relative overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LINE style */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h1 className="font-bold text-base">Aipower</h1>
            <p className="text-green-100 text-xs">名片人脈圈</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full min-h-0">
        {activeView ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {renderActiveView()}
          </div>
        ) : (
          <>
            {/* Chat Messages Area - LINE style background */}
            <div className="flex-1 overflow-y-auto px-3 py-2 bg-gray-50" style={{ 
              backgroundImage: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}>
              <div className="space-y-4 pb-2">
                {messages.map((message) => (
                  <div key={message.id} className="flex justify-start">
                    <div className="max-w-[90%] w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {message.isCard && message.cardData ? (
                            /* LINE Flex Message Style Card */
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden max-w-[280px]">
                              {/* Business Card Header */}
                              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
                                <div className="flex items-center space-x-3 mb-2">
                                  {message.cardData.photo && (
                                    <img 
                                      src={message.cardData.photo} 
                                      alt="照片" 
                                      className="w-10 h-10 rounded-full object-cover border-2 border-white flex-shrink-0" 
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-bold truncate">{message.cardData.name}</h3>
                                    <p className="text-blue-100 text-xs truncate">{message.cardData.companyName}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-1 text-xs">
                                  {message.cardData.phone && (
                                    <div className="flex items-center space-x-2">
                                      <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                                      <span className="truncate">{message.cardData.phone}</span>
                                    </div>
                                  )}
                                  {message.cardData.email && (
                                    <div className="flex items-center space-x-2">
                                      <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                                      <span className="truncate">{message.cardData.email}</span>
                                    </div>
                                  )}
                                  {message.cardData.website && (
                                    <div className="flex items-center space-x-2">
                                      <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                                      <span className="truncate">{message.cardData.website}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Social Media Links */}
                                {(message.cardData.line || message.cardData.facebook || message.cardData.instagram) && (
                                  <div className="mt-2 pt-2 border-t border-white/20">
                                    <p className="text-xs text-blue-100 mb-1">社群媒體</p>
                                    <div className="space-y-1 text-xs">
                                      {message.cardData.line && <div className="truncate">LINE: {message.cardData.line}</div>}
                                      {message.cardData.facebook && <div className="truncate">Facebook: {message.cardData.facebook}</div>}
                                      {message.cardData.instagram && <div className="truncate">Instagram: {message.cardData.instagram}</div>}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* QR Code Section */}
                              {showQR && (
                                <div className="p-3 text-center bg-gray-50 border-b border-gray-100">
                                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg mx-auto mb-1 flex items-center justify-center">
                                    <QrCode className="w-12 h-12 text-gray-400" />
                                  </div>
                                  <p className="text-xs text-gray-600">掃描獲取名片</p>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="p-3 bg-white space-y-2">
                                <Button 
                                  onClick={() => handleCardAction('qrcode', message.cardData)} 
                                  size="sm" 
                                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
                                >
                                  <QrCode className="w-3 h-3 mr-2" />
                                  QR Code
                                </Button>
                                
                                <Button 
                                  onClick={() => handleCardAction('addContact', message.cardData)} 
                                  size="sm" 
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-8"
                                >
                                  <UserPlus className="w-3 h-3 mr-2" />
                                  加入聯絡人
                                </Button>
                                
                                <Button 
                                  onClick={() => handleCardAction('createCard', message.cardData)} 
                                  size="sm" 
                                  className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs h-8"
                                >
                                  <Edit className="w-3 h-3 mr-2" />
                                  建立我的名片
                                </Button>
                                
                                <Button 
                                  onClick={() => handleCardAction('share', message.cardData)} 
                                  size="sm" 
                                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xs h-8"
                                >
                                  <Share2 className="w-3 h-3 mr-2" />
                                  分享
                                </Button>
                              </div>
                            </div>
                          ) : (
                            /* Regular Chat Message */
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm max-w-xs">
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
              </div>
            </div>

            {/* Input Bar - LINE style */}
            {!isMenuOpen && !activeView && (
              <div className="bg-white border-t border-gray-200 px-3 py-2 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 border border-gray-200">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="請輸入訊息..."
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed p-0 flex-shrink-0"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Menu Grid - LINE style bottom menu */}
        {isMenuOpen && !activeView && (
          <div className="bg-white border-t border-gray-200 flex-shrink-0">
            <div className="px-3 py-3">
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="w-6 h-6 rounded-full bg-gray-400 hover:bg-gray-500 rotate-45 mb-3 ml-1"
                size="sm"
              >
                <X className="w-3 h-3" />
              </Button>
              
              {/* Menu Grid - 3x2 layout for mobile */}
              <div className="grid grid-cols-3 gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className="flex flex-col items-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                  >
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium text-center leading-tight">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating + Button - LINE style */}
        {(!isMenuOpen || activeView) && (
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              onClick={() => {
                if (activeView) {
                  handleCloseView();
                } else {
                  setIsMenuOpen(true);
                }
              }}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg active:scale-95 transition-transform"
              size="sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
