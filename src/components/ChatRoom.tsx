import React, { useState, useEffect } from 'react';
import { Plus, X, User, Zap, Scan, Users, BarChart3, Calendar, Send, Bot, UserPlus, Edit, Share2, Download, BookmarkPlus, ChevronDown, ChevronUp, QrCode, MessageCircle, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
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
  isClientFlexMessage?: boolean;
  isFullFlexMessage?: boolean;
  customerName?: string;
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
  { id: 'customers', title: '名片夾', icon: Users, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { id: 'my-card', title: '我的電子名片', icon: Zap, color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'scanner', title: '名片識別', icon: Scan, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'schedule', title: '行程管理', icon: Calendar, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
  { id: 'analytics', title: '數據分析', icon: BarChart3, color: 'bg-gradient-to-br from-red-500 to-red-600' },
];

// 統一使用的客戶名稱
const CONSISTENT_CUSTOMER_NAME = '陳淑芬';

// 模擬客戶名稱生成器
const generateRandomCustomerName = () => {
  const surnames = ['王', '李', '張', '陳', '林', '黃', '吳', '劉', '蔡', '楊'];
  const names = ['大頭', '小明', '美麗', '志強', '淑芬', '建國', '雅婷', '俊傑', '麗華', '文雄'];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  return surname + name;
};

// 新增 LIFF 彈跳介面元件
const LIFFPopup = ({ isOpen, onClose, cardOwnerName, onUserJoined, flowType, customerName }: { 
  isOpen: boolean; 
  onClose: () => void; 
  cardOwnerName: string;
  onUserJoined: (userName: string) => void;
  flowType: 'qr_scan' | 'direct_add';
  customerName?: string;
}) => {
  const [step, setStep] = useState(1);
  // 使用統一的客戶名稱
  const [actualCustomerName] = useState(() => customerName || CONSISTENT_CUSTOMER_NAME);
  
  const handleJoinAipowerNetwork = () => {
    setStep(2); // 顯示加LINE成功
    
    // 模擬加LINE成功
    setTimeout(() => {
      onClose();
      setStep(1);
      
      // 在聊天室中顯示加LINE成功訊息
      const joinMessage = {
        id: Date.now(),
        text: `🎉 ${actualCustomerName} 已加入您的 Aipower 名片圈！`,
        isBot: true,
        timestamp: new Date()
      };
      
      // 根據流程類型決定是否發送完整電子名片
      if (flowType === 'qr_scan') {
        // QR Code 掃描流程 - 發送完整的電子名片卡訊息
        const cardMessage = {
          id: Date.now() + 1,
          text: `已發送完整電子名片給 ${actualCustomerName}：`,
          isBot: true,
          timestamp: new Date()
        };
        
        // 獲取當前用戶名片資料（同步更新）
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
          customerName: actualCustomerName // 傳遞客戶名稱
        };
        
        // 模擬在聊天室中顯示這些訊息
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('liffCardShared', {
            detail: { 
              joinMessage,
              cardMessage,
              fullCardMessage,
              customerName: actualCustomerName,
              flowType: 'qr_scan'
            }
          }));
        }, 500);
      } else {
        // 直接加入聯絡人流程 - 只顯示加入訊息，不發送完整電子名片
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('liffCardShared', {
            detail: { 
              joinMessage,
              customerName: actualCustomerName,
              flowType: 'direct_add'
            }
          }));
        }, 500);
      }
      
      // 立即新增客戶到名片人脈夾（當客戶加入 Aipower 名片人脈圈時）
      const lineUserId = `U${Math.random().toString(36).substr(2, 32)}`;
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: { 
          customerName: actualCustomerName,
          action: flowType === 'qr_scan' ? 'join_aipower_network' : 'direct_contact_add',
          isDigitalCard: true,
          profileImage: `https://via.placeholder.com/40/4ade80/ffffff?text=${actualCustomerName.charAt(0)}`,
          lineAccount: `@${actualCustomerName.toLowerCase()}`,
          lineUserId: lineUserId, // LINE userId (scope ID)
          hasBusinessCard: false,
          isLineContact: true // 標記為 LINE 聯絡人
        }
      }));
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-2xl overflow-hidden border shadow-lg" style={{ maxWidth: '320px' }}>
        <div className="relative">
          {step === 1 && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                請加入此{cardOwnerName}電子名片卡
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {flowType === 'qr_scan' 
                  ? '加入後即可獲得完整的電子名片資訊' 
                  : '加入後即可建立聯絡關係'}
              </p>
              
              <Button 
                onClick={handleJoinAipowerNetwork}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium"
              >
              加入 Aipower 名片圈
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
              <h3 className="text-lg font-bold text-green-800 mb-3">加LINE成功！</h3>
              <p className="text-sm text-gray-600">
                {flowType === 'qr_scan' 
                  ? '已成功加入 Aipower 名片圈，完整電子名片已發送至您的LINE聊天室'
                  : '已成功加入 Aipower 名片圈'}
              </p>
            </div>
          )}
          
          {/* 關閉按鈕 */}
          <div className="absolute top-3 right-3">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 完整電子名片 LIFF 介面
const FullCardLIFFPopup = ({ isOpen, onClose, cardData, onJoinAipowerOA, onSaveCard, onShareCard }: { 
  isOpen: boolean; 
  onClose: () => void; 
  cardData: any;
  onJoinAipowerOA: () => void;
  onSaveCard: (cardData: any) => void;
  onShareCard: (cardData: any) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-2xl overflow-hidden border shadow-lg" style={{ maxWidth: '340px' }}>
        <div className="relative">
          {/* 完整電子名片預覽 */}
          <div className="bg-white">
            {/* Business Card Header */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-3">
                {cardData?.photo && (
                  <img 
                    src={cardData.photo} 
                    alt="照片" 
                    className="w-16 h-16 rounded-full object-cover border-3 border-white flex-shrink-0" 
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold truncate">{cardData?.name}</h3>
                  <p className="text-blue-100 text-sm truncate">{cardData?.companyName}</p>
                  {cardData?.jobTitle && (
                    <p className="text-blue-200 text-sm truncate">{cardData.jobTitle}</p>
                  )}
                </div>
              </div>
              
              {/* 聯絡資訊 */}
              <div className="space-y-2 text-sm">
                {/* 自我介紹 */}
                {cardData?.introduction && cardData?.introductionVisible !== false && (
                  <div className="bg-white/10 p-2 rounded text-xs mb-3">
                    <span className="mr-2">💬</span>
                    <span>{cardData.introduction}</span>
                  </div>
                )}
                
                {/* 公司電話 */}
                {cardData?.phone && cardData?.phoneVisible !== false && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">電話: {cardData.phone}</span>
                  </div>
                )}
                
                {/* 手機號碼 */}
                {cardData?.mobilePhone && cardData?.mobilePhoneVisible !== false && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">手機: {cardData.mobilePhone}</span>
                  </div>
                )}
                
                {cardData?.email && cardData?.emailVisible !== false && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{cardData.email}</span>
                  </div>
                )}
                {cardData?.website && cardData?.websiteVisible !== false && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{cardData.website}</span>
                  </div>
                )}
                {cardData?.address && cardData?.addressVisible !== false && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{cardData.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 社群媒體與操作區域 */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* 其他資訊 */}
              {cardData?.otherInfo && cardData?.otherInfoVisible !== false && (
                <div className="mb-4 p-3 bg-white/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-600 mt-0.5">📋</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">其他資訊</p>
                      <p className="text-xs text-gray-600">{cardData.otherInfo}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 社群媒體符號 */}
              {(cardData?.line || cardData?.facebook || cardData?.instagram || (cardData?.socialMedia && cardData?.socialMedia.length > 0)) && (
                <div className="flex justify-center flex-wrap gap-3 mb-4">
                  {cardData.line && cardData.lineVisible !== false && (
                    <a 
                      href={cardData.line} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {cardData.facebook && cardData.facebookVisible !== false && (
                    <a 
                      href={cardData.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {cardData.instagram && cardData.instagramVisible !== false && (
                    <a 
                      href={cardData.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  )}
                  
                  {/* 其他社群媒體 */}
                  {cardData?.socialMedia && cardData.socialMedia.filter(item => item.visible).map((social) => (
                    <a 
                      key={social.id}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                        social.platform === 'YouTube' ? 'bg-red-600 hover:bg-red-700' :
                        social.platform === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800' :
                        social.platform === 'Threads' ? 'bg-gray-800 hover:bg-gray-900' :
                        'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {social.platform === 'YouTube' && <Youtube className="w-5 h-5 text-white" />}
                      {social.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-white" />}
                      {social.platform === 'Threads' && <MessageCircle className="w-5 h-5 text-white" />}
                      {!['YouTube', 'LinkedIn', 'Threads'].includes(social.platform) && <Share2 className="w-5 h-5 text-white" />}
                    </a>
                  ))}
                </div>
              )}
              
              {/* 操作按鈕組 */}
              <div className="space-y-2">
                <Button 
                  onClick={onJoinAipowerOA}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2.5 h-auto rounded-xl font-medium shadow-sm"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  加入名片好友
                </Button>
                
                <Button 
                  onClick={() => onSaveCard(cardData)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2.5 h-auto rounded-xl font-medium shadow-sm"
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  儲存名片
                </Button>
                
                <Button 
                  onClick={() => onShareCard(cardData)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-sm py-2.5 h-auto rounded-xl font-medium shadow-sm"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </div>
          </div>
          
          {/* 關閉按鈕 */}
          <div className="absolute top-3 right-3">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 p-0 backdrop-blur-sm"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
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
  const [liffFlowType, setLiffFlowType] = useState<'qr_scan' | 'direct_add'>('qr_scan');
  const [expandedQrCodes, setExpandedQrCodes] = useState<Record<number, boolean>>({});
  const [pendingCustomerName, setPendingCustomerName] = useState<string>('');
  const [showFullCardPopup, setShowFullCardPopup] = useState(false);
  const [fullCardData, setFullCardData] = useState<any>(null);

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
      const { joinMessage, cardMessage, fullCardMessage, customerName, flowType } = event.detail;
      
      // 檢查是否開啟通知接收
      const savedSettings = localStorage.getItem('aile-profile-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : { receiveNotifications: true };
      
      if (flowType === 'qr_scan') {
        // QR Code 掃描流程 - 顯示完整流程
        setMessages(prev => [...prev, joinMessage, cardMessage, fullCardMessage]);
        
        // 只有在開啟通知時才顯示加入通知
        if (settings.receiveNotifications) {
          // 3秒後判斷客戶是否建立電子名片
          setTimeout(() => {
            const hasBusinessCard = Math.random() > 0.5; // 50% 機率客戶有建立電子名片
            
            if (hasBusinessCard) {
              // 客戶有建立電子名片 - 顯示完整資料
              const businessCardMessage = {
                id: Date.now() + 10,
                text: `🔔 ${customerName} 已建立電子名片並加入您的聯絡人`,
                isBot: true,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, businessCardMessage]);
              
              // 通知名片人脈夾新增客戶（有電子名片）
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
              // 客戶只加入聯絡人 - 只顯示基本資料
              const contactMessage = {
                id: Date.now() + 10,
                text: `🔔 ${customerName} 已加入您的聯絡人`,
                isBot: true,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, contactMessage]);
              
              // 通知名片人脈夾新增客戶（只有基本資料）
              window.dispatchEvent(new CustomEvent('customerAddedNotification', {
                detail: { 
                  customerName: customerName,
                  action: 'liff_join_basic',
                  isDigitalCard: true,
                  profileImage: `https://via.placeholder.com/40/6b7280/ffffff?text=${customerName.charAt(0)}`,
                  lineAccount: `@${customerName.toLowerCase()}`,
                  hasBusinessCard: false,
                  isBasicLineContact: true // 標記為基本LINE聯絡人
                }
              }));
            }
          }, 3000);
        }
      } else {
        // 直接加入聯絡人流程 - 只顯示加入訊息
        setMessages(prev => [...prev, joinMessage]);
        
        // 只有在開啟通知時才顯示後續通知
        if (settings.receiveNotifications) {
          // 直接新增為基本聯絡人，不等待也不發送完整電子名片
          const contactMessage = {
            id: Date.now() + 10,
            text: `🔔 ${customerName} 已加入您的聯絡人`,
            isBot: true,
            timestamp: new Date()
          };
          setTimeout(() => {
            setMessages(prev => [...prev, contactMessage]);
          }, 1000);
        }
      }
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
    setLiffFlowType('qr_scan');
    setPendingCustomerName(CONSISTENT_CUSTOMER_NAME); // 使用統一的客戶名稱
    setShowLIFFPopup(true);
  };

  const handleCardAction = (action: string, cardData: any, customerName?: string) => {
    // 統一使用陳淑芬作為客戶名稱
    const targetCustomerName = CONSISTENT_CUSTOMER_NAME;
    
    switch (action) {
      case 'addContact':
        // 立即加入聯絡人 - 觸發 LIFF 介面（直接加入流程）
        const ownerName = cardData?.name || '此用戶';
        setCurrentCardOwner(ownerName);
        setLiffFlowType('direct_add');
        setPendingCustomerName(targetCustomerName); // 設置統一的客戶名稱
        setShowLIFFPopup(true);
        break;
        
      case 'saveToContacts':
        // 模擬儲存到手機聯絡人
        if (cardData?.name && cardData?.phone) {
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
        // 分享電子名片 - 顯示客戶端的 Flex Message
        const shareMessage: Message = {
          id: Date.now(),
          text: `已分享電子名片給 ${targetCustomerName}：`,
          isBot: true,
          timestamp: new Date()
        };
        
        const clientFlexMessage: Message = {
          id: Date.now() + 1,
          text: "",
          isBot: true,
          timestamp: new Date(),
          isCard: true,
          cardData: cardData,
          isClientFlexMessage: true, // 標記為客戶端 Flex Message
          customerName: targetCustomerName // 確保客戶名稱一致
        };
        
        setMessages(prev => [...prev, shareMessage, clientFlexMessage]);
        
        toast({
          title: "分享成功！",
          description: `電子名片已分享給 ${targetCustomerName}。`
        });
        break;
    }
  };

  const handleViewFullCard = (cardData: any) => {
    // 同步獲取最新的電子名片資料
    const savedData = localStorage.getItem('aile-card-data');
    const latestCardData = savedData ? JSON.parse(savedData) : cardData;
    setFullCardData(latestCardData);
    setShowFullCardPopup(true);
  };

  const handleJoinAipowerOA = () => {
    toast({
      title: "成功加入！",
      description: "已成功加入 Aipower LINE OA 好友",
    });
  };

  const handleSaveCard = (cardData: any) => {
    toast({
      title: "儲存成功！",
      description: "電子名片已儲存至您的名片人脈夾",
    });
  };

  const handleShareCard = async (cardData: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData?.name}的電子名片`,
          text: `${cardData?.companyName} - ${cardData?.name}`,
          url: window.location.href,
        });
        toast({
          title: "分享成功！",
          description: "電子名片已成功分享",
        });
      } catch (error) {
        console.log('分享取消');
      }
    } else {
      // 備選方案：複製到剪貼簿
      navigator.clipboard.writeText(`${cardData?.name}的電子名片 - ${cardData?.companyName}`);
      toast({
        title: "已複製到剪貼簿！",
        description: "電子名片資訊已複製，您可以貼上分享",
      });
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

  const generateQRCode = (data: string) => {
    const size = 8;
    const squares = [];
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const isBlack = (i + j + data.length) % 3 === 0;
        squares.push(
          <div
            key={`${i}-${j}`}
            className={`w-3 h-3 ${isBlack ? 'bg-black' : 'bg-white'}`}
          />
        );
      }
    }
    
    return (
      <div className="grid grid-cols-8 gap-0 p-4 bg-white border-2 border-gray-300 rounded-lg">
        {squares}
      </div>
    );
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
                            <div className="bg-white rounded-2xl shadow-lg max-w-[260px] border border-gray-100 overflow-hidden">
                              {/* Business Card Header - 更緊湊的設計 */}
                              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white">
                                <div className="flex items-center space-x-2.5">
                                  {message.cardData.photo && (
                                    <img 
                                      src={message.cardData.photo} 
                                      alt="照片" 
                                      className="w-9 h-9 rounded-full object-cover border-2 border-white flex-shrink-0" 
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-bold truncate">{message.cardData.name}</h3>
                                    <p className="text-blue-100 text-xs truncate">{message.cardData.companyName}</p>
                                    {message.cardData.jobTitle && (
                                      <p className="text-blue-200 text-xs truncate">{message.cardData.jobTitle}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* 聯絡資訊 - 更緊湊的間距 */}
                              <div className="px-3 py-2 space-y-1.5">
                                {message.cardData.phone && (
                                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                                    <span className="truncate">{message.cardData.phone}</span>
                                  </div>
                                )}
                                {message.cardData.email && (
                                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                                    <span className="truncate">{message.cardData.email}</span>
                                  </div>
                                )}
                                {message.cardData.website && (
                                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                                    <span className="truncate">{message.cardData.website}</span>
                                  </div>
                                )}
                                
                                {/* 查看更多按鈕 */}
                                {(message.cardData.line || message.cardData.facebook || message.cardData.instagram || message.cardData.address) && (
                                  <div className="pt-2 mt-2 border-t border-gray-100">
                                    <Button
                                      onClick={() => handleViewFullCard(message.cardData)}
                                      size="sm"
                                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs h-6 font-medium rounded-md"
                                      variant="outline"
                                    >
                                      <User className="w-3 h-3 mr-1" />
                                      查看更多
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* QR Code 區塊已隱藏 - 彈跳介面中不顯示 */}

                              {/* 操作按鈕區域 - 優化版本 */}
                              <div className="p-3 pt-0 bg-white">
                                {/* 如果是客戶端 Flex Message，顯示客戶端按鈕組 */}
                                {(message as any).isClientFlexMessage ? (
                                  <div className="space-y-1.5">
                                    <Button 
                                      onClick={() => handleCardAction('addContact', message.cardData, CONSISTENT_CUSTOMER_NAME)}
                                      size="sm" 
                                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs h-8 font-medium"
                                    >
                                      <UserPlus className="w-3 h-3 mr-1" />
                                      立即加入聯絡人
                                    </Button>
                                    <Button 
                                      onClick={() => handleCardAction('saveToContacts', message.cardData)}
                                      size="sm" 
                                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xs h-8 font-medium"
                                    >
                                      <BookmarkPlus className="w-3 h-3 mr-1" />
                                      儲存聯絡人
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs h-8 font-medium"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      建立電子名片
                                    </Button>
                                    <Button 
                                      onClick={() => handleCardAction('share', message.cardData)} 
                                      size="sm" 
                                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 font-medium"
                                    >
                                      <Share2 className="w-3 h-3 mr-1" />
                                      分享
                                    </Button>
                                  </div>
                                ) : (message as any).isFullFlexMessage ? (
                                  <div className="space-y-1.5">
                                    <Button 
                                      onClick={() => handleCardAction('saveToContacts', message.cardData)}
                                      size="sm" 
                                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xs h-8 font-medium"
                                    >
                                      <BookmarkPlus className="w-3 h-3 mr-1" />
                                      儲存聯絡人
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs h-8 font-medium"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      建立電子名片
                                    </Button>
                                    <Button 
                                      onClick={() => handleCardAction('share', message.cardData)} 
                                      size="sm" 
                                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 font-medium"
                                    >
                                      <Share2 className="w-3 h-3 mr-1" />
                                      分享
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    {/* 加入 Aipower LINE OA好友 */}
                                    <Button 
                                      onClick={() => handleJoinAipowerOA()}
                                      size="sm" 
                                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xs h-7 font-medium rounded-lg"
                                    >
                                      <UserPlus className="w-3 h-3 mr-1.5" />
                                      加入名片好友
                                    </Button>
                                    {/* 儲存名片 */}
                                    <Button 
                                      onClick={() => handleSaveCard(message.cardData)}
                                      size="sm" 
                                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs h-7 font-medium rounded-lg"
                                    >
                                      <BookmarkPlus className="w-3 h-3 mr-1.5" />
                                      儲存名片
                                    </Button>
                                    {/* 分享 */}
                                    <Button 
                                      onClick={() => handleCardAction('share', message.cardData)} 
                                      size="sm" 
                                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-xs h-7 font-medium rounded-lg"
                                      variant="outline"
                                    >
                                      <Share2 className="w-3 h-3 mr-1.5" />
                                      分享
                                    </Button>
                                  </div>
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
        onClose={() => {
          setShowLIFFPopup(false);
          setPendingCustomerName(''); // 清除暫存的客戶名稱
        }} 
        cardOwnerName={currentCardOwner}
        onUserJoined={handleUserJoined}
        flowType={liffFlowType}
        customerName={pendingCustomerName} // 傳遞統一的客戶名稱
      />

      {/* 完整電子名片 LIFF 彈跳介面 */}
      <FullCardLIFFPopup 
        isOpen={showFullCardPopup} 
        onClose={() => setShowFullCardPopup(false)} 
        cardData={fullCardData}
        onJoinAipowerOA={handleJoinAipowerOA}
        onSaveCard={handleSaveCard}
        onShareCard={handleShareCard}
      />
    </div>
  );
};

export default ChatRoom;
