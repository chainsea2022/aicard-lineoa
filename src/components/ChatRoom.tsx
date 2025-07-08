import React, { useState, useEffect } from 'react';
import { Plus, X, User, Zap, Scan, Users, BarChart3, Calendar, Send, Bot, UserPlus, Edit, Share2, Download, BookmarkPlus, ChevronDown, ChevronUp, QrCode, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCard from './CreateCard';
import MyCard from './MyCard';
import Scanner from './Scanner';
import MyCustomers from './MyCustomers';
import Analytics from './Analytics';
import Schedule from './Schedule';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  { id: 'create-card', title: '註冊電子名片', icon: User, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { id: 'my-card', title: '我的電子名片', icon: Zap, color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'scanner', title: '掃描', icon: Scan, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'customers', title: '名片人脈夾', icon: Users, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
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

// 新增 LIFF 彈跳介面元件
const LIFFPopup = ({ isOpen, onClose, cardOwnerName, onUserJoined }: { 
  isOpen: boolean; 
  onClose: () => void; 
  cardOwnerName: string;
  onUserJoined: (userName: string) => void;
}) => {
  const [step, setStep] = useState(1);
  const [randomCustomerName] = useState(() => generateRandomCustomerName());
  
  const handleJoinAipowerNetwork = () => {
    setStep(2); // 顯示加LINE成功
    
    // 模擬加LINE成功並發送完整電子名片卡
    setTimeout(() => {
      onClose();
      setStep(1);
      
      // 在聊天室中顯示加LINE成功訊息
      const joinMessage = {
        id: Date.now(),
        text: `🎉 ${randomCustomerName} 已加入您的 Aipower 名片人脈圈！`,
        isBot: true,
        timestamp: new Date()
      };
      
      // 發送完整的電子名片卡訊息
      const cardMessage = {
        id: Date.now() + 1,
        text: `已發送完整電子名片給 ${randomCustomerName}：`,
        isBot: true,
        timestamp: new Date()
      };
      
      // 獲取當前用戶名片資料
      const savedData = localStorage.getItem('aile-card-data');
      const cardData = savedData ? JSON.parse(savedData) : null;
      
      const fullCardMessage = {
        id: Date.now() + 2,
        text: "",
        isBot: true,
        timestamp: new Date(),
        isCard: true,
        cardData: cardData,
        isFullFlexMessage: true, // 標記為完整 Flex Message
        customerName: randomCustomerName // 傳遞客戶名稱
      };
      
      // 模擬在聊天室中顯示這些訊息
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('liffCardShared', {
          detail: { 
            joinMessage,
            cardMessage,
            fullCardMessage,
            customerName: randomCustomerName
          }
        }));
      }, 500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-2xl overflow-hidden">
        {step === 1 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              請加入此{cardOwnerName}電子名片卡
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              加入後即可獲得完整的電子名片資訊
            </p>
            
            <Button 
              onClick={handleJoinAipowerNetwork}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
            >
              加入 Aipower 名片人脈圈
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-2">加LINE成功！</h3>
            <p className="text-sm text-gray-600">
              已成功加入 Aipower 名片人脈圈，完整電子名片已發送至您的LINE聊天室
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ChatRoom = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '歡迎使用 Aipower！請點選下方圖文選單開始使用各項功能。', isBot: true, timestamp: new Date() }
  ]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showLIFFPopup, setShowLIFFPopup] = useState(false);
  const [currentCardOwner, setCurrentCardOwner] = useState('');
  const [expandedQrCodes, setExpandedQrCodes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleCustomerAdded = (event: CustomEvent) => {
      const newCustomer = event.detail;
      setCustomers(prev => [...prev, newCustomer]);
      
      const customerName = generateRandomCustomerName();
      const newMessage = {
        id: Date.now(),
        text: `🎉 ${customerName}已加入您的人脈列表！`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    };

    const handleQRScanned = (event: CustomEvent) => {
      const { customer } = event.detail;
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: { 
          customerName: customer.name, 
          action: 'qr_scanned',
          isDigitalCard: true 
        }
      }));
    };

    const handlePaperScanned = (event: CustomEvent) => {
      const { customer } = event.detail;
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: { 
          customerName: customer.name, 
          action: 'paper_scanned',
          isDigitalCard: false
        }
      }));
    };

    const handleLiffCardShared = (event: CustomEvent) => {
      const { joinMessage, cardMessage, fullCardMessage, customerName } = event.detail;
      setMessages(prev => [...prev, joinMessage, cardMessage, fullCardMessage]);
      
      setTimeout(() => {
        const hasBusinessCard = Math.random() > 0.5;
        
        if (hasBusinessCard) {
          const businessCardMessage = {
            id: Date.now() + 10,
            text: `${customerName} 已建立電子名片並加入您的聯絡人`,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, businessCardMessage]);
          
          window.dispatchEvent(new CustomEvent('customerAddedNotification', {
            detail: { 
              customerName: customerName,
              action: 'liff_join_with_card',
              isDigitalCard: true,
              profileImage: `https://via.placeholder.com/40/4ade80/ffffff?text=${customerName.charAt(0)}`,
              lineAccount: `@${customerName.toLowerCase()}`,
              hasBusinessCard: true,
              phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
              email: `${customerName.toLowerCase()}@example.com`,
              company: `${customerName}的公司`,
              jobTitle: '經理'
            }
          }));
        } else {
          const contactMessage = {
            id: Date.now() + 10,
            text: `${customerName} 已加入您的聯絡人`,
            isBot: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, contactMessage]);
          
          window.dispatchEvent(new CustomEvent('customerAddedNotification', {
            detail: { 
              customerName: customerName,
              action: 'liff_join_basic',
              isDigitalCard: true,
              profileImage: `https://via.placeholder.com/40/6b7280/ffffff?text=${customerName.charAt(0)}`,
              lineAccount: `@${customerName.toLowerCase()}`,
              hasBusinessCard: false,
              isBasicLineContact: true
            }
          }));
        }
      }, 3000);
    };

    window.addEventListener('customerScannedCard', handleCustomerAdded as EventListener);
    window.addEventListener('qrCodeScanned', handleQRScanned as EventListener);
    window.addEventListener('paperCardScanned', handlePaperScanned as EventListener);
    window.addEventListener('liffCardShared', handleLiffCardShared as EventListener);
    
    return () => {
      window.removeEventListener('customerScannedCard', handleCustomerAdded as EventListener);
      window.removeEventListener('qrCodeScanned', handleQRScanned as EventListener);
      window.removeEventListener('paperCardScanned', handlePaperScanned as EventListener);
      window.removeEventListener('liffCardShared', handleLiffCardShared as EventListener);
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

  const isRegistered = () => {
    const savedData = localStorage.getItem('aile-card-data');
    return !!savedData;
  };

  const getDynamicMenuItems = () => {
    const baseItems = [...menuItems];
    if (isRegistered()) {
      baseItems[0] = { id: 'create-card', title: '設置電子名片', icon: User, color: 'bg-gradient-to-br from-blue-500 to-blue-600' };
    }
    return baseItems;
  };

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === 'create-card') {
      setActiveView(itemId);
      setIsMenuOpen(false);
    } else if (itemId === 'my-card') {
      const savedData = localStorage.getItem('aile-card-data');
      if (savedData) {
        const cardData = JSON.parse(savedData);
        
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

  const handleUserJoined = (joinerName: string) => {
    const joinMessage: Message = {
      id: Date.now(),
      text: `🎉 ${joinerName} 已加入您的電子名片！`,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, joinMessage]);
  };

  const toggleQrCode = (messageId: number) => {
    setExpandedQrCodes(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleQrCodeClick = (cardData: any) => {
    const ownerName = cardData?.name || '此用戶';
    setCurrentCardOwner(ownerName);
    setShowLIFFPopup(true);
  };

  const handleCardAction = (action: string, cardData: any) => {
    const customerName = generateRandomCustomerName();
    
    switch (action) {
      case 'saveToContacts':
        // 模擬儲存到手機聯絡人
        if (cardData?.name && cardData?.phone) {
          // 在實際應用中，這裡會調用原生 API 來儲存聯絡人
          console.log('Saving to contacts:', {
            name: cardData.name,
            phone: cardData.phone,
            email: cardData.email
          });
          
          toast({
            title: "已儲存到聯絡人！",
            description: `${cardData.name} 的聯絡資訊已儲存到您的手機聯絡人中。`
          });
        }
        break;
        
      case 'share':
        const shareUrl = `https://aile.app/card/${cardData?.name || 'user'}`;
        
        if (navigator.share) {
          navigator.share({
            title: `${cardData?.name} 的電子名片`,
            text: `查看 ${cardData?.name} 的電子名片`,
            url: shareUrl
          }).catch(() => {
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
        return <MyCard onClose={handleCloseView} />;
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

                                {/* 社群媒體圖示顯示 */}
                                {(message.cardData.line || message.cardData.facebook || message.cardData.instagram) && (
                                  <div className="mt-2 pt-2 border-t border-white/20">
                                    <div className="flex items-center space-x-3">
                                      {message.cardData.line && (
                                        <a 
                                          href={message.cardData.line} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-white hover:text-blue-100 transition-colors"
                                          title="LINE"
                                        >
                                          <MessageCircle className="w-5 h-5" />
                                        </a>
                                      )}
                                      {message.cardData.facebook && (
                                        <a 
                                          href={message.cardData.facebook} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-white hover:text-blue-100 transition-colors"
                                          title="Facebook"
                                        >
                                          <Facebook className="w-5 h-5" />
                                        </a>
                                      )}
                                      {message.cardData.instagram && (
                                        <a 
                                          href={message.cardData.instagram} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-white hover:text-blue-100 transition-colors"
                                          title="Instagram"
                                        >
                                          <Instagram className="w-5 h-5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* QR Code 可折疊區塊 */}
                              <div className="bg-gray-50 border-t border-gray-200">
                                <button
                                  onClick={() => toggleQrCode(message.id)}
                                  className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <QrCode className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">QR Code</span>
                                  </div>
                                  {expandedQrCodes[message.id] ? (
                                    <ChevronUp className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                
                                {expandedQrCodes[message.id] && (
                                  <div className="p-4 border-t border-gray-200 bg-white">
                                    <div 
                                      className="w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                                      onClick={() => handleQrCodeClick(message.cardData)}
                                    >
                                      <QrCode className="w-16 h-16 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 text-center mt-2">點擊 QR Code 分享名片</p>
                                  </div>
                                )}
                              </div>

                              {/* 操作按鈕區域 */}
                              <div className="p-3 bg-white">
                                {/* 如果是完整Flex Message，顯示所有按鈕 */}
                                {(message as any).isFullFlexMessage ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                      onClick={() => handleCardAction('saveToContacts', message.cardData)}
                                      size="sm" 
                                      className="bg-green-500 hover:bg-green-600 text-white text-sm h-10 font-medium"
                                    >
                                      <BookmarkPlus className="w-4 h-4 mr-2" />
                                      儲存到聯絡人
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-purple-500 hover:bg-purple-600 text-white text-sm h-10 font-medium"
                                    >
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      加入聯絡人
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm h-10 font-medium"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      建立我的電子名片
                                    </Button>
                                    <Button 
                                      onClick={() => handleCardAction('share', message.cardData)} 
                                      size="sm" 
                                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm h-10 font-medium"
                                    >
                                      <Share2 className="w-4 h-4 mr-2" />
                                      分享
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    onClick={() => handleCardAction('share', message.cardData)} 
                                    size="sm" 
                                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm h-10 font-medium"
                                  >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    分享
                                  </Button>
                                )}
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
                {getDynamicMenuItems().map((item) => (
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

      {/* LIFF 彈跳介面 */}
      <LIFFPopup 
        isOpen={showLIFFPopup} 
        onClose={() => setShowLIFFPopup(false)} 
        cardOwnerName={currentCardOwner}
        onUserJoined={handleUserJoined}
      />
    </div>
  );
};

export default ChatRoom;
