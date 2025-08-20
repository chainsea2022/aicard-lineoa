import React, { useState, useEffect } from 'react';
import { Plus, X, User, Zap, Scan, Users, BarChart3, Calendar, Send, Bot, UserPlus, Edit, Share2, Download, BookmarkPlus, ChevronDown, ChevronUp, QrCode, MessageCircle, Facebook, Instagram, Youtube, Linkedin, CheckCircle, Coins, Crown, RotateCcw, Phone, Mail, Globe, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCard from './CreateCard';
import MyCard from './MyCard';
import Scanner from './Scanner';
import MyCustomers from './MyCustomers';
import UnifiedCardFolder from './UnifiedCardFolder';
import Analytics from './Analytics';
import Schedule from './Schedule';
import Points from './Points';
import MemberPoints from './MemberPoints';
import UpgradeExperience from './UpgradeExperience';
import CardManagement from './CardManagement';
import MemberInterface from './MemberInterface';
import { CardSelectionLIFF } from './CardSelectionLIFF';
import { FullCardLIFF } from './FullCardLIFF';
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
  showFullCard?: boolean;
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
const menuItems: MenuItem[] = [{
  id: 'my-card',
  title: '我的電子名片',
  icon: Zap,
  color: 'bg-gradient-to-br from-green-500 to-green-600'
}, {
  id: 'customers',
  title: '名片夾',
  icon: Users,
  color: 'bg-gradient-to-br from-orange-500 to-orange-600'
}, {
  id: 'create-card',
  title: '會員註冊',
  icon: User,
  color: 'bg-gradient-to-br from-blue-500 to-blue-600'
}, {
  id: 'scanner',
  title: '名片識別',
  icon: Scan,
  color: 'bg-gradient-to-br from-purple-500 to-purple-600'
}, {
  id: 'schedule',
  title: '行程管理',
  icon: Calendar,
  color: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
}, {
  id: 'analytics',
  title: '數據分析',
  icon: BarChart3,
  color: 'bg-gradient-to-br from-red-500 to-red-600'
}];

// 新的 Richmenu 模式選項
const newMenuItems: MenuItem[] = [{
  id: 'my-card',
  title: '我的電子名片',
  icon: Zap,
  color: 'bg-gradient-to-br from-green-500 to-green-600'
}, {
  id: 'customers',
  title: '名片夾',
  icon: Users,
  color: 'bg-gradient-to-br from-orange-500 to-orange-600'
}, {
  id: 'member',
  title: '會員',
  icon: User,
  color: 'bg-gradient-to-br from-blue-500 to-blue-600'
}];

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
const LIFFPopup = ({
  isOpen,
  onClose,
  cardOwnerName,
  onUserJoined,
  flowType,
  customerName
}: {
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
  const handleJoinAiCardNetwork = () => {
    setStep(2); // 顯示加LINE成功

    // 模擬加LINE成功
    setTimeout(() => {
      onClose();
      setStep(1);

      // 在聊天室中顯示加LINE成功訊息
      const joinMessage = {
        id: Date.now(),
        text: `🎉 ${actualCustomerName} 已加入您的 AiCard 名片圈！`,
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
          isFullFlexMessage: true,
          // 標記為完整 Flex Message
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

      // 立即新增客戶到名片人脈夾（當客戶加入 AiCard 名片人脈圈時）
      const lineUserId = `U${Math.random().toString(36).substr(2, 32)}`;
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: {
          customerName: actualCustomerName,
          action: flowType === 'qr_scan' ? 'join_aicard_network' : 'direct_contact_add',
          isDigitalCard: true,
          profileImage: `https://via.placeholder.com/40/4ade80/ffffff?text=${actualCustomerName.charAt(0)}`,
          lineAccount: `@${actualCustomerName.toLowerCase()}`,
          lineUserId: lineUserId,
          // LINE userId (scope ID)
          hasBusinessCard: false,
          isLineContact: true // 標記為 LINE 聯絡人
        }
      }));
    }, 2000);
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-2xl overflow-hidden border shadow-lg" style={{
      maxWidth: '320px'
    }}>
        <div className="relative">
          {step === 1 && <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                請加入此{cardOwnerName}電子名片卡
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {flowType === 'qr_scan' ? '加入後即可獲得完整的電子名片資訊' : '加入後即可建立聯絡關係'}
              </p>
              
              <Button onClick={handleJoinAiCardNetwork} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium">
              加入 AiCard 名片圈
              </Button>
            </div>}

          {step === 2 && <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-3">加LINE成功！</h3>
              <p className="text-sm text-gray-600">
                {flowType === 'qr_scan' ? '已成功加入 AiCard 名片圈，完整電子名片已發送至您的LINE聊天室' : '已成功加入 AiCard 名片圈'}
              </p>
            </div>}
          
          {/* 關閉按鈕 */}
          <div className="absolute top-3 right-3">
            <Button onClick={onClose} variant="ghost" size="sm" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};

// 完整電子名片 LIFF 介面
const FullCardLIFFPopup = ({
  isOpen,
  onClose,
  cardData,
  onJoinAiCardOA,
  onSaveCard,
  onShareCard
}: {
  isOpen: boolean;
  onClose: () => void;
  cardData: any;
  onJoinAiCardOA: () => void;
  onSaveCard: (cardData: any) => void;
  onShareCard: (cardData: any) => void;
}) => {
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-2xl overflow-hidden border shadow-lg" style={{
      maxWidth: '340px'
    }}>
        <div className="relative">
          {/* 完整電子名片預覽 */}
          <div className="bg-white">
            {/* Business Card Header */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-3">
                {cardData?.photo && <img src={cardData.photo} alt="照片" className="w-16 h-16 rounded-full object-cover border-3 border-white flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold truncate">{cardData?.name}</h3>
                  <p className="text-blue-100 text-sm truncate">{cardData?.companyName}</p>
                  {cardData?.jobTitle && <p className="text-blue-200 text-sm truncate">{cardData.jobTitle}</p>}
                </div>
              </div>
              
              {/* 聯絡資訊 */}
              <div className="space-y-2 text-sm">
                {/* 自我介紹 */}
                {cardData?.introduction && cardData?.introductionVisible !== false && <div className="bg-white/10 p-2 rounded text-xs mb-3">
                    <span className="mr-2">💬</span>
                    <span>{cardData.introduction}</span>
                  </div>}
                
                {/* 公司電話 */}
                {cardData?.phone && cardData?.phoneVisible !== false && <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">電話: {cardData.phone}</span>
                  </div>}
                
                {/* 手機號碼 */}
                {cardData?.mobilePhone && cardData?.mobilePhoneVisible !== false && <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">手機: {cardData.mobilePhone}</span>
                  </div>}
                
                {cardData?.email && cardData?.emailVisible !== false && <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{cardData.email}</span>
                  </div>}
                {cardData?.website && cardData?.websiteVisible !== false && <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{cardData.website}</span>
                  </div>}
                {cardData?.address && cardData?.addressVisible !== false && <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{cardData.address}</span>
                  </div>}
              </div>
            </div>

            {/* 社群媒體與操作區域 */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* 其他資訊 */}
              {cardData?.otherInfo && cardData?.otherInfoVisible !== false && <div className="mb-4 p-3 bg-white/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-600 mt-0.5">📋</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">其他資訊</p>
                      <p className="text-xs text-gray-600">{cardData.otherInfo}</p>
                    </div>
                  </div>
                </div>}
              
              {/* 社群媒體符號 */}
              {(cardData?.line || cardData?.facebook || cardData?.instagram || cardData?.socialMedia && cardData?.socialMedia.length > 0) && <div className="flex justify-center flex-wrap gap-3 mb-4">
                  {cardData.line && cardData.lineVisible !== false && <a href={cardData.line} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </a>}
                  {cardData.facebook && cardData.facebookVisible !== false && <a href={cardData.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm">
                      <Facebook className="w-5 h-5 text-white" />
                    </a>}
                  {cardData.instagram && cardData.instagramVisible !== false && <a href={cardData.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm">
                      <Instagram className="w-5 h-5 text-white" />
                    </a>}
                  
                  {/* 其他社群媒體 */}
                  {cardData?.socialMedia && cardData.socialMedia.filter(item => item.visible).map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${social.platform === 'YouTube' ? 'bg-red-600 hover:bg-red-700' : social.platform === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800' : social.platform === 'Threads' ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-600 hover:bg-gray-700'}`}>
                      {social.platform === 'YouTube' && <Youtube className="w-5 h-5 text-white" />}
                      {social.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-white" />}
                      {social.platform === 'Threads' && <MessageCircle className="w-5 h-5 text-white" />}
                      {!['YouTube', 'LinkedIn', 'Threads'].includes(social.platform) && <Share2 className="w-5 h-5 text-white" />}
                    </a>)}
                </div>}
              
              {/* 操作按鈕組 */}
              <div className="space-y-2">
                <Button onClick={onJoinAiCardOA} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2.5 h-auto rounded-xl font-medium shadow-sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  加入名片好友
                </Button>
                
                <Button onClick={() => onSaveCard(cardData)} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2.5 h-auto rounded-xl font-medium shadow-sm">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  儲存名片
                </Button>
                
                <Button onClick={() => onShareCard(cardData)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-sm py-2.5 h-auto rounded-xl font-medium shadow-sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>
            </div>
          </div>
          
          {/* 關閉按鈕 */}
          <div className="absolute top-3 right-3">
            <Button onClick={onClose} variant="ghost" size="sm" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 p-0 backdrop-blur-sm">
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
const ChatRoom = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // 預設展開圖文選單
  const [activeView, setActiveView] = useState<string | null>(null); // 不預設載入任何介面
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showLIFFPopup, setShowLIFFPopup] = useState(false);
  const [currentCardOwner, setCurrentCardOwner] = useState('');
  const [liffFlowType, setLiffFlowType] = useState<'qr_scan' | 'direct_add'>('qr_scan');
  const [expandedQrCodes, setExpandedQrCodes] = useState<Record<number, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [pendingCustomerName, setPendingCustomerName] = useState<string>('');
  const [showFullCardPopup, setShowFullCardPopup] = useState(false);
  const [fullCardData, setFullCardData] = useState<any>(null);
  const [showCardSelectionLIFF, setShowCardSelectionLIFF] = useState(false);
  const [showFullCardLIFF, setShowFullCardLIFF] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const [useNewMenu, setUseNewMenu] = useState(false); // 新增：控制選單模式

  // 初始化歡迎訊息
  useEffect(() => {
    if (!hasInitialized) {
      // 檢查用戶註冊狀態
      const userRegistered = localStorage.getItem('aicard-user-registered') === 'true';
      const cardDataExists = localStorage.getItem('aile-card-data');
      const hasStartedRegistration = localStorage.getItem('aicard-user-started-registration') === 'true';
      if (!userRegistered && !cardDataExists && !hasStartedRegistration) {
        // 全新用戶 - 顯示歡迎文案和電子名片預覽
        // 初次加入用戶 - 顯示歡迎文案和電子名片預覽
        const welcomeMessage = {
          id: 1,
          text: '👋 歡迎加入 AiCard 智能電子名片平台！\n🎯 快速建立您的第一張電子名片，開啟人脈新連結！\n🔒 只需手機註冊，即可打造專屬個人名片，輕鬆分享、智能管理。',
          isBot: true,
          timestamp: new Date()
        };

        // 電子名片預覽卡片
        const cardPreviewMessage = {
          id: 2,
          text: '開始使用 AiCard 電子名片！',
          isBot: true,
          timestamp: new Date(),
          isCard: true,
          isClientFlexMessage: true,
          cardData: {
            name: '立即開始',
            companyName: 'AiCard 電子名片平台',
            jobTitle: '・建立名片，立即擁有專屬 QR Code\n・可新增多張名片，打造個人與工作身份\n・完成設定可獲得 50 點 AiPoint 獎勵！',
            phone: '',
            email: '',
            website: '',
            line: '',
            facebook: '',
            instagram: '',
            photo: null,
            introduction: '👉 點擊下方按鈕立即開始',
            welcomeCard: true // 特殊標記為歡迎卡片
          }
        };
        setMessages([welcomeMessage, cardPreviewMessage]);
      } else if (userRegistered && cardDataExists) {
        // 已註冊用戶返回
        const welcomeBackMessage = {
          id: 1,
          text: '👋 歡迎回來 AiCard！\n🎯 點選下方功能即可編輯名片、管理人脈、查詢點數！',
          isBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeBackMessage]);
      } else {
        // 已加入但尚未註冊完成的用戶
        const registerPromptMessage = {
          id: 1,
          text: '👋 歡迎加入 AiCard！\n🎯 您尚未建立專屬電子名片，點擊下方按鈕立即開始註冊！',
          isBot: true,
          timestamp: new Date()
        };
        setMessages([registerPromptMessage]);
      }
      setHasInitialized(true);
    }
  }, [hasInitialized]);
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
      const {
        customer
      } = event.detail;
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: {
          customerName: customer.name,
          action: 'qr_scanned',
          isDigitalCard: true
        }
      }));
    };
    const handlePaperScanned = (event: CustomEvent) => {
      const {
        customer
      } = event.detail;
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: {
          customerName: customer.name,
          action: 'paper_scanned',
          isDigitalCard: false
        }
      }));
    };
    const handleLiffCardShared = (event: CustomEvent) => {
      const {
        joinMessage,
        cardMessage,
        fullCardMessage,
        customerName,
        flowType
      } = event.detail;

      // 檢查是否開啟通知接收
      const savedSettings = localStorage.getItem('aile-profile-settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {
        receiveNotifications: true
      };
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
    const handleRegistrationCompleted = () => {
      handleRegistrationComplete();
    };
    window.addEventListener('customerScannedCard', handleCustomerAdded as EventListener);
    window.addEventListener('qrCodeScanned', handleQRScanned as EventListener);
    window.addEventListener('paperCardScanned', handlePaperScanned as EventListener);
    window.addEventListener('liffCardShared', handleLiffCardShared as EventListener);
    window.addEventListener('registrationCompleted', handleRegistrationCompleted as EventListener);
    return () => {
      window.removeEventListener('customerScannedCard', handleCustomerAdded as EventListener);
      window.removeEventListener('qrCodeScanned', handleQRScanned as EventListener);
      window.removeEventListener('paperCardScanned', handlePaperScanned as EventListener);
      window.removeEventListener('liffCardShared', handleLiffCardShared as EventListener);
      window.removeEventListener('registrationCompleted', handleRegistrationCompleted as EventListener);
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
    if (useNewMenu) {
      const baseItems = [...newMenuItems];
      if (isRegistered()) {
        baseItems[2] = {
          id: 'create-card',
          title: '會員',
          icon: User,
          color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        };
      } else {
        baseItems[2] = {
          id: 'create-card',
          title: '註冊',
          icon: User,
          color: 'bg-gradient-to-br from-blue-500 to-blue-600'
        };
      }
      return baseItems;
    }
    const baseItems = [...menuItems];
    if (isRegistered()) {
      baseItems[2] = {
        id: 'create-card',
        title: '設置電子名片',
        icon: User,
        color: 'bg-gradient-to-br from-blue-500 to-blue-600'
      };
    }
    return baseItems;
  };
  const handleMenuItemClick = (itemId: string) => {
    if (itemId === 'create-card') {
      setActiveView(itemId);
      setIsMenuOpen(false);
    } else if (itemId === 'my-card') {
      // 檢查用戶註冊狀態
      const isUserRegistered = localStorage.getItem('aicard-user-registered') === 'true';
      const userData = localStorage.getItem('aile-user-data');
      const cardData = localStorage.getItem('aile-card-data');
      
      // 調試信息
      console.log('Debug - 我的電子名片點擊:', {
        isUserRegistered,
        hasUserData: !!userData,
        hasCardData: !!cardData,
        userData: userData ? JSON.parse(userData) : null,
        cardData: cardData ? JSON.parse(cardData) : null
      });
      
      if (isUserRegistered && userData && cardData) {
        // 已註冊完成且有電子名片，顯示名片選擇LIFF介面
        console.log('Debug - 顯示名片選擇LIFF');
        setShowCardSelectionLIFF(true);
        setIsMenuOpen(false);
      } else {
        // 尚未註冊完成，引導用戶註冊
        console.log('Debug - 顯示註冊提示訊息');
        const noCardMessage: Message = {
          id: Date.now(),
          text: "⚠️ 您尚未完成會員註冊，無法使用此功能。\n🎯 立即註冊，打造您的第一張專屬電子名片！\n👇 點擊下方「會員註冊」開始設定：",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, noCardMessage]);
        setIsMenuOpen(false);
      }
    } else if (itemId === 'customers-manage') {
      // 名片管理：同步設置電子名片中的名片管理功能
      setActiveView('card-management');
      setIsMenuOpen(false);
    } else if (itemId === 'points') {
      // 點數優惠：同步會員點數的內容和樣式
      setActiveView('points');
      setIsMenuOpen(false);
    } else if (itemId === 'member') {
      // 會員介面：包含名片管理、點數優惠、資料設定三個分頁
      setActiveView('member');
      setIsMenuOpen(false);
    } else if (itemId === 'upgrade') {
      // 升級體驗
      setActiveView('upgrade');
      setIsMenuOpen(false);
    } else {
      setActiveView(itemId);
      setIsMenuOpen(false);
    }
  };
  const handleCardSelected = (selectedCard: any) => {
    // 從localStorage獲取完整的名片數據
    const savedCardData = localStorage.getItem('aile-card-data');
    let fullCardData: any = {};
    
    if (savedCardData) {
      fullCardData = JSON.parse(savedCardData);
    }
    
    // 根據選擇的名片創建對應的名片數據，包含完整的可見性設置
    const cardData = {
      // 基本資訊
      name: selectedCard.name,
      companyName: selectedCard.company,
      jobTitle: selectedCard.title,
      
      // 聯絡方式
      phone: selectedCard.phone || fullCardData.phone || '',
      mobilePhone: fullCardData.mobilePhone || '',
      email: selectedCard.email || fullCardData.email || '',
      website: selectedCard.website || fullCardData.website || '',
      
      // 社群媒體
      line: selectedCard.line || fullCardData.line || '',
      facebook: selectedCard.facebook || fullCardData.facebook || '',
      instagram: selectedCard.instagram || fullCardData.instagram || '',
      socialMedia: fullCardData.socialMedia || [],
      
      // 額外資訊
      address: fullCardData.address || '',
      birthday: fullCardData.birthday || '',
      gender: fullCardData.gender || '',
      introduction: fullCardData.introduction || '',
      otherInfo: fullCardData.otherInfo || '',
      
      // 可見性設置
      nameVisible: fullCardData.nameVisible !== false,
      companyNameVisible: fullCardData.companyNameVisible !== false,
      jobTitleVisible: fullCardData.jobTitleVisible !== false,
      phoneVisible: fullCardData.phoneVisible !== false,
      mobilePhoneVisible: fullCardData.mobilePhoneVisible !== false,
      emailVisible: fullCardData.emailVisible !== false,
      websiteVisible: fullCardData.websiteVisible !== false,
      lineVisible: fullCardData.lineVisible !== false,
      facebookVisible: fullCardData.facebookVisible !== false,
      instagramVisible: fullCardData.instagramVisible !== false,
      addressVisible: fullCardData.addressVisible || false,
      birthdayVisible: fullCardData.birthdayVisible || false,
      genderVisible: fullCardData.genderVisible || false,
      introductionVisible: fullCardData.introductionVisible !== false,
      otherInfoVisible: fullCardData.otherInfoVisible !== false,
      
      // 其他
      photo: selectedCard.photo || fullCardData.photo || null,
      backgroundColor: selectedCard.backgroundColor || '#3b82f6',
      textColor: selectedCard.textColor || '#ffffff',
      cardType: selectedCard.type,
      cardPublic: fullCardData.cardPublic || false
    };
    
    const cardTypeText = selectedCard.type === 'business' ? '商務' : 
                        selectedCard.type === 'professional' ? '專業' : '個人';
    
    const cardMessage: Message = {
      id: Date.now(),
      text: `✨ 您選擇了${cardTypeText}電子名片${selectedCard.isDefault ? '（預設名片）' : ''}`,
      isBot: true,
      timestamp: new Date()
    };
    
    const cardPreviewMessage: Message = {
      id: Date.now() + 1,
      text: "",
      isBot: true,
      timestamp: new Date(),
      isCard: true,
      cardData: cardData,
      isClientFlexMessage: true
    };
    
    setMessages(prev => [...prev, cardMessage, cardPreviewMessage]);
    setShowCardSelectionLIFF(false);
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
  const handleWelcomeCardAction = () => {
    // 歡迎卡片按鈕 - 開啟註冊流程
    setActiveView('create-card');
    setIsMenuOpen(false);

    // 標記用戶已開始註冊流程
    localStorage.setItem('aicard-user-started-registration', 'true');
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
          isClientFlexMessage: true,
          // 標記為客戶端 Flex Message
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
  const handleJoinAiCardOA = () => {
    toast({
      title: "成功加入！",
      description: "已成功加入 AiCard LINE OA 好友"
    });
  };
  const handleSaveCard = (cardData: any) => {
    toast({
      title: "儲存成功！",
      description: "電子名片已儲存至您的名片人脈夾"
    });
  };
  const handleShareCard = async (cardData: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardData?.name}的電子名片`,
          text: `${cardData?.companyName} - ${cardData?.name}`,
          url: window.location.href
        });
        toast({
          title: "分享成功！",
          description: "電子名片已成功分享"
        });
      } catch (error) {
        console.log('分享取消');
      }
    } else {
      // 備選方案：複製到剪貼簿
      navigator.clipboard.writeText(`${cardData?.name}的電子名片 - ${cardData?.companyName}`);
      toast({
        title: "已複製到剪貼簿！",
        description: "電子名片資訊已複製，您可以貼上分享"
      });
    }
  };
  const handleRegistrationComplete = () => {
    // 註冊完成後的處理邏輯
    localStorage.setItem('aicard-user-registered', 'true');

    // 關閉註冊界面，回到聊天室
    setActiveView(null);
    setIsMenuOpen(true);
    setUseNewMenu(true); // 註冊完成後使用新版 Richmenu

    // 顯示註冊成功訊息
    const successMessage = {
      id: Date.now(),
      text: '🎉 恭喜您！電子名片建立成功！\n✅ 您已獲得 50 點 AiPoint 獎勵！\n📱 現在可以透過下方 Richmenu 管理您的名片！',
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, successMessage]);
    toast({
      title: "註冊成功！",
      description: "歡迎加入 AiCard 電子名片平台！"
    });
  };
  const renderActiveView = () => {
    switch (activeView) {
      case 'my-card':
        return <MyCard onClose={handleCloseView} />;
      case 'scanner':
        return;
      case 'customers':
        return <UnifiedCardFolder onClose={handleCloseView} />;
      case 'analytics':
        return <Analytics onClose={handleCloseView} />;
      case 'schedule':
        return <Schedule onClose={handleCloseView} />;
      case 'member':
        return <MemberInterface onClose={handleCloseView} />;
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
        squares.push(<div key={`${i}-${j}`} className={`w-3 h-3 ${isBlack ? 'bg-black' : 'bg-white'}`} />);
      }
    }
    return <div className="grid grid-cols-8 gap-0 p-4 bg-white border-2 border-gray-300 rounded-lg">
        {squares}
      </div>;
  };
  return <div className="flex flex-col h-screen w-full bg-white relative overflow-hidden" style={{
    maxWidth: '375px',
    margin: '0 auto'
  }}>
      {/* Header - LINE style */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h1 className="font-bold text-base">AiCard</h1>
            <p className="text-green-100 text-xs">名片人脈圈</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full min-h-0">
        {activeView ? <div className="absolute inset-0 w-full h-full overflow-hidden">
            {renderActiveView()}
          </div> : <>
            {/* Chat Messages Area - LINE style background */}
            <div className="flex-1 overflow-y-auto px-3 py-2 bg-gray-50" style={{
          backgroundImage: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}>
              <div className="space-y-4 pb-2">
                {messages.filter((_, index) => index !== 1).map(message => (
                  <div key={message.id} className="flex justify-start">
                    <div className="max-w-[90%] w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          
                          {/* 電子名片預覽 */}
                          {message.isCard && message.cardData ? (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden max-w-sm">
                              {/* 名片頭部預覽 - 與CardPreview風格一致 */}
                              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <div className="flex items-center space-x-3">
                                  {message.cardData.photo && (
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                      <img src={message.cardData.photo} alt="頭像" className="w-10 h-10 rounded-full object-cover" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    {message.cardData.companyName && (
                                      <p className="text-blue-100 text-xs">{message.cardData.companyName}</p>
                                    )}
                                    <h4 className="text-white text-base font-semibold">
                                      {message.cardData.name || '您的姓名'}
                                    </h4>
                                    {message.cardData.jobTitle && (
                                      <p className="text-blue-100 text-xs">{message.cardData.jobTitle}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* 基本聯絡資訊預覽 */}
                              <div className="p-3 space-y-2">
                                {message.cardData.phone && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">📱</span>
                                    <span className="text-gray-800">{message.cardData.phone}</span>
                                  </div>
                                )}
                                {message.cardData.email && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">✉️</span>
                                    <span className="text-gray-800">{message.cardData.email}</span>
                                  </div>
                                )}
                                {message.cardData.line && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">💬</span>
                                    <span className="text-gray-800">LINE: {message.cardData.line}</span>
                                  </div>
                                )}
                              </div>

                              {/* 操作按鈕區域 */}
                              <div className="bg-gray-50 p-2">
                                {/* 查看更多按鈕 */}
                                <Button 
                                  onClick={() => {
                                    setSelectedCardData(message.cardData);
                                    setShowFullCardLIFF(true);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="w-full h-8 text-xs mb-2 border-gray-300"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  查看更多
                                </Button>
                                
                                {/* 操作按鈕 */}
                                <div className="grid grid-cols-3 gap-1">
                                  <Button 
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white h-8 text-xs px-2"
                                  >
                                    <UserPlus className="w-3 h-3 mr-1" />
                                    加入
                                  </Button>
                                  
                                  <Button 
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 text-white h-8 text-xs px-2"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    儲存
                                  </Button>
                                  
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs border-gray-300 px-2"
                                  >
                                    <Share2 className="w-3 h-3 mr-1" />
                                    分享
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* 一般聊天訊息 */
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm max-w-xs">
                              <p className="text-sm text-gray-800 whitespace-pre-line">{message.text}</p>
                              
                              {/* 建立電子名片按鈕 - 在所有聊天訊息下方顯示 */}
                              <div className="mt-3">
                                <Button onClick={() => setActiveView('mycard')} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg py-2">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  建立電子名片
                                </Button>
                              </div>
                              
                              {/* 如果訊息包含建立名片的提示，顯示額外的按鈕 */}
                              {(message.text.includes('尚未建立電子名片') || message.text.includes('立即註冊，打造您的第一張專屬名片')) && (
                                <div className="mt-2">
                                  <Button onClick={() => setActiveView('mycard')} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    ✅ 建立我的電子名片
                                  </Button>
                                </div>
                              )}
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
            {!isMenuOpen && !activeView && <div className="bg-white border-t border-gray-200 px-3 py-2 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 border border-gray-200">
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={handleKeyPress} placeholder="請輸入訊息..." className="w-full bg-transparent outline-none text-sm" />
                  </div>
                  <Button onClick={handleSendMessage} disabled={!inputText.trim()} className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed p-0 flex-shrink-0" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>}
          </>}

        {/* Menu Grid - LINE style bottom menu */}
        {isMenuOpen && !activeView && <div className="bg-white border-t border-gray-200 flex-shrink-0">
            <div className="px-3 py-3">
              <div className="flex items-center justify-between mb-3">
                <Button onClick={() => setIsMenuOpen(false)} className="w-6 h-6 rounded-full bg-gray-400 hover:bg-gray-500 rotate-45" size="sm">
                  <X className="w-3 h-3" />
                </Button>
                
                <div className="flex-1"></div>
              </div>
              
              {/* Central Toggle Button */}
              <div className="flex justify-center mb-3">
                <Button onClick={() => setUseNewMenu(!useNewMenu)} className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-md" size="sm">
                  <RotateCcw className="w-4 h-4" />
                  <span>{useNewMenu ? '切換至原版選單' : '切換至新版選單'}</span>
                </Button>
              </div>
              
              {/* Menu Grid - 3x2 layout for mobile */}
              <div className="grid grid-cols-3 gap-2">
                {getDynamicMenuItems().map(item => <button key={item.id} onClick={() => handleMenuItemClick(item.id)} className="flex flex-col items-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium text-center leading-tight">
                      {item.title}
                    </span>
                  </button>)}
              </div>
            </div>
          </div>}

        {/* Floating + Button - LINE style */}
        {(!isMenuOpen || activeView) && <div className="absolute bottom-4 right-4 z-20">
            <Button onClick={() => {
          if (activeView) {
            handleCloseView();
          } else {
            setIsMenuOpen(true);
          }
        }} className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg active:scale-95 transition-transform" size="sm">
              <Plus className="w-5 h-5" />
            </Button>
          </div>}
      </div>

      {/* LIFF 彈跳介面 */}
      <LIFFPopup isOpen={showLIFFPopup} onClose={() => {
      setShowLIFFPopup(false);
      setPendingCustomerName(''); // 清除暫存的客戶名稱
    }} cardOwnerName={currentCardOwner} onUserJoined={handleUserJoined} flowType={liffFlowType} customerName={pendingCustomerName} // 傳遞統一的客戶名稱
    />

      {/* 完整電子名片 LIFF 彈跳介面 */}
      <FullCardLIFFPopup isOpen={showFullCardPopup} onClose={() => setShowFullCardPopup(false)} cardData={fullCardData} onJoinAiCardOA={handleJoinAiCardOA} onSaveCard={handleSaveCard} onShareCard={handleShareCard} />

      {/* 名片選擇 LIFF 介面 */}
      {showCardSelectionLIFF && <CardSelectionLIFF onClose={() => setShowCardSelectionLIFF(false)} onCardSelect={handleCardSelected} />}

      {/* 完整電子名片 LIFF 介面 */}
      <FullCardLIFF 
        isOpen={showFullCardLIFF} 
        onClose={() => setShowFullCardLIFF(false)} 
        cardData={selectedCardData} 
      />
    </div>;
};
export default ChatRoom;