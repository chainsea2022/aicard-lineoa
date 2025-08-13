import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff, ChevronUp, ChevronDown, Download, MessageCircle, Facebook, Instagram, Youtube, Linkedin, Globe, MapPin, Mail, Phone, Twitter, Plus, X, Settings, TrendingUp, Coins, Calendar, Check, Gift, CheckCircle, FileText, Users, Camera, Lock, Unlock, Star, History, Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import CreateCard from './CreateCard';
import OTPVerification from './OTPVerification';
import { ProfileSettings } from './MyCustomers/ProfileSettings';

interface MyCardProps {
  onClose: () => void;
}

const MyCard: React.FC<MyCardProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasRegistrationHistory, setHasRegistrationHistory] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [additionalCards, setAdditionalCards] = useState<any[]>([]);
  const [swipedCardId, setSwipedCardId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    gender: '',
    phone: '',
    email: '',
    birthday: '',
    isPhoneVerified: false,
    isEmailVerified: false,
    publicCard: false,
    allowDirectAdd: false,
    receiveNotifications: true
  });
  const [showGenderDialog, setShowGenderDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showBirthdayDialog, setShowBirthdayDialog] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempBirthday, setTempBirthday] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const formatBirthdayDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男性';
      case 'female':
        return '女性';
      case 'other':
        return '其他';
      default:
        return gender;
    }
  };

  useEffect(() => {
    const loadCardData = () => {
      const savedCardData = localStorage.getItem('aile-card-data');
      const savedUserData = localStorage.getItem('aile-user-data');

      // 檢查是否有註冊歷史記錄
      const registrationHistory = localStorage.getItem('aile-registration-history');
      if (registrationHistory) {
        setHasRegistrationHistory(true);
      }

      // 檢查用戶是否已註冊但未建立名片
      if (!savedCardData && !savedUserData && !registrationHistory) {
        // 未註冊用戶 - 顯示註冊提示
        return;
      }

      if (savedCardData) {
        const cardInfo = JSON.parse(savedCardData);
        setCardData(cardInfo);

        // 自動生成QR Code資料，包含所有欄位和社群媒體
        const qrInfo = `名片資訊
姓名: ${cardInfo.name || ''}
${cardInfo.jobTitle && cardInfo.jobTitleVisible !== false ? `職稱: ${cardInfo.jobTitle}` : ''}
${cardInfo.companyName && cardInfo.companyNameVisible !== false ? `公司: ${cardInfo.companyName}` : ''}
${cardInfo.department && cardInfo.departmentVisible !== false ? `部門: ${cardInfo.department}` : ''}
${cardInfo.position && cardInfo.positionVisible !== false ? `職位: ${cardInfo.position}` : ''}
電話: ${cardInfo.phone || ''}
${cardInfo.mobilePhone && cardInfo.mobilePhoneVisible !== false ? `手機: ${cardInfo.mobilePhone}` : ''}
${cardInfo.officePhone && cardInfo.officePhoneVisible !== false ? `辦公室: ${cardInfo.officePhone}` : ''}
${cardInfo.fax && cardInfo.faxVisible !== false ? `傳真: ${cardInfo.fax}` : ''}
Email: ${cardInfo.email || ''}
${cardInfo.email2 && cardInfo.email2Visible !== false ? `副信箱: ${cardInfo.email2}` : ''}
${cardInfo.website && cardInfo.websiteVisible !== false ? `網站: ${cardInfo.website}` : ''}
${cardInfo.address && cardInfo.addressVisible ? `地址: ${cardInfo.address}` : ''}
${cardInfo.companyAddress && cardInfo.companyAddressVisible !== false ? `公司地址: ${cardInfo.companyAddress}` : ''}
${cardInfo.birthday && cardInfo.birthdayVisible ? `生日: ${formatBirthdayDisplay(cardInfo.birthday)}` : ''}
${cardInfo.gender && cardInfo.genderVisible ? `性別: ${getGenderDisplay(cardInfo.gender)}` : ''}
${cardInfo.skills && cardInfo.skillsVisible !== false ? `專長: ${cardInfo.skills}` : ''}
${cardInfo.line && cardInfo.lineVisible !== false ? `LINE: ${cardInfo.line}` : ''}
${cardInfo.facebook && cardInfo.facebookVisible !== false ? `Facebook: ${cardInfo.facebook}` : ''}
${cardInfo.instagram && cardInfo.instagramVisible !== false ? `Instagram: ${cardInfo.instagram}` : ''}
${cardInfo.youtube && cardInfo.youtubeVisible !== false ? `YouTube: ${cardInfo.youtube}` : ''}
${cardInfo.linkedin && cardInfo.linkedinVisible !== false ? `LinkedIn: ${cardInfo.linkedin}` : ''}
${cardInfo.twitter && cardInfo.twitterVisible !== false ? `Twitter: ${cardInfo.twitter}` : ''}
${cardInfo.tiktok && cardInfo.tiktokVisible !== false ? `TikTok: ${cardInfo.tiktok}` : ''}
${cardInfo.threads && cardInfo.threadsVisible !== false ? `Threads: ${cardInfo.threads}` : ''}
${cardInfo.wechat && cardInfo.wechatVisible !== false ? `WeChat: ${cardInfo.wechat}` : ''}
${cardInfo.whatsapp && cardInfo.whatsappVisible !== false ? `WhatsApp: ${cardInfo.whatsapp}` : ''}
${cardInfo.introduction && cardInfo.introductionVisible !== false ? `個人介紹: ${cardInfo.introduction}` : ''}
${cardInfo.otherInfo && cardInfo.otherInfoVisible !== false ? `其他資訊: ${cardInfo.otherInfo}` : ''}`;
        setQrCodeData(qrInfo);
        console.log('生成QR Code:', qrInfo);
      }
      
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }

      // 載入額外名片資料
      const savedAdditionalCards = localStorage.getItem('aile-additional-cards');
      if (savedAdditionalCards) {
        setAdditionalCards(JSON.parse(savedAdditionalCards));
      }

      // 載入點數資訊
      const savedPoints = localStorage.getItem('aile-user-points');
      if (savedPoints) {
        setCurrentPoints(parseInt(savedPoints));
      }

      // 載入個人資料設定
      const savedProfileData = localStorage.getItem('aile-profile-data');
      if (savedProfileData) {
        const parsedData = JSON.parse(savedProfileData);
        setProfileData(parsedData);
      } else if (savedUserData) {
        // 如果有用戶資料但沒有個人資料設定，初始化
        const userData = JSON.parse(savedUserData);
        setProfileData(prev => ({
          ...prev,
          phone: userData.phone || '',
          isPhoneVerified: userData.isVerified || false
        }));
      }
    };

    // 初始載入
    loadCardData();

    // 監聽名片資料更新事件
    const handleCardDataUpdate = () => {
      console.log('MyCard: cardDataUpdated event received');
      loadCardData();
    };
    window.addEventListener('cardDataUpdated', handleCardDataUpdate);
    return () => {
      window.removeEventListener('cardDataUpdated', handleCardDataUpdate);
    };
  }, []);

  const handleVerificationComplete = (phone: string) => {
    // 手機驗證完成後創建用戶資料
    const phoneUser = {
      phone: phone,
      displayName: '',
      pictureUrl: null,
      loginMethod: 'phone',
      registeredAt: new Date(),
      isVerified: true
    };

    // 儲存用戶登入資訊和註冊歷史
    localStorage.setItem('aile-user-data', JSON.stringify(phoneUser));
    localStorage.setItem('aile-registration-history', JSON.stringify({
      registeredAt: new Date(),
      method: 'phone',
      hasRegistered: true
    }));
    setUserData(phoneUser);
    setHasRegistrationHistory(true);

    // 創建預設名片資料（只包含手機號碼）
    const defaultCardData = {
      companyName: '',
      name: '',
      phone: phone,
      email: '',
      website: '',
      line: '',
      facebook: '',
      instagram: '',
      photo: null
    };

    // 儲存預設名片資料
    localStorage.setItem('aile-card-data', JSON.stringify(defaultCardData));
    setCardData(defaultCardData);

    // 生成QR Code資料
    const qrInfo = `名片資訊
姓名: ${defaultCardData.name || ''}
公司: ${defaultCardData.companyName || ''}
電話: ${defaultCardData.phone || ''}
Email: ${defaultCardData.email || ''}`;
    setQrCodeData(qrInfo);

    // 標記為新用戶並關閉驗證界面
    setIsNewUser(true);
    setShowOTPVerification(false);
  };

  const handleLineLogin = () => {
    // 模擬 LINE 登入 - 生成模擬的 LINE 用戶資料
    const mockLineUser = {
      lineId: `line_${Math.random().toString(36).substr(2, 8)}`,
      displayName: '王小明',
      pictureUrl: null,
      loginMethod: 'line',
      registeredAt: new Date(),
      isVerified: true
    };

    // 儲存用戶登入資訊
    localStorage.setItem('aile-user-data', JSON.stringify(mockLineUser));
    setUserData(mockLineUser);

    // 檢查是否有現有名片資料
    const existingCardData = localStorage.getItem('aile-card-data');
    let cardInfo;
    if (existingCardData) {
      // 如果有現有名片資料，保留並更新LINE相關資訊
      cardInfo = JSON.parse(existingCardData);
      cardInfo.line = mockLineUser.lineId;
      if (!cardInfo.name && mockLineUser.displayName) {
        cardInfo.name = mockLineUser.displayName;
      }
      if (!cardInfo.photo && mockLineUser.pictureUrl) {
        cardInfo.photo = mockLineUser.pictureUrl;
      }
    } else {
      // 創建新的名片資料
      cardInfo = {
        companyName: '',
        name: mockLineUser.displayName,
        phone: '',
        email: '',
        website: '',
        line: mockLineUser.lineId,
        facebook: '',
        instagram: '',
        photo: mockLineUser.pictureUrl
      };
    }

    // 儲存名片資料
    localStorage.setItem('aile-card-data', JSON.stringify(cardInfo));
    setCardData(cardInfo);
  };

  const handleCardCreated = () => {
    setShowCreateCard(false);
    setIsNewUser(false);
    // 重新載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setCardData(cardInfo);
      
      // 發送註冊完成事件給 ChatRoom
      window.dispatchEvent(new CustomEvent('registrationCompleted'));
    }
  };

  const handleLogout = () => {
    // 清除當前用戶資料，但保留註冊歷史
    localStorage.removeItem('aile-card-data');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aile-profile-settings');
    localStorage.removeItem('aile-user-points');

    // 重置狀態，但保留註冊歷史
    setCardData(null);
    setUserData(null);
    setQrCodeData('');
    setShowCreateCard(false);
    setShowOTPVerification(false);
    setShowProfileSettings(false);
    setIsNewUser(false);
    setCurrentPoints(0);
    toast({
      title: "已登出",
      description: "您已成功登出，可重新登入使用服務。"
    });
  };

  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} onRegistrationComplete={handleCardCreated} userData={userData} />;
  }

  if (showOTPVerification) {
    return <OTPVerification onClose={() => setShowOTPVerification(false)} onVerificationComplete={handleVerificationComplete} />;
  }

  if (showProfileSettings) {
    return <ProfileSettings onClose={() => setShowProfileSettings(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* 頂部導航欄 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <Button variant="ghost" size="sm" onClick={onClose} className="mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-800 flex-1">
          {userData && cardData ? '會員資料' : (hasRegistrationHistory ? '設置電子名片' : '會員註冊')}
        </h1>
        {userData && (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </header>

      {/* 內容區域 */}
      <div className="flex-1 overflow-y-auto">
        {/* 未登入/註冊介面 */}
        {!userData && (
          <div className="p-6">
            {/* 歡迎資訊 */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                歡迎加入 AiCard
              </h2>
              <p className="text-gray-600 text-sm px-2">
                {hasRegistrationHistory ? '請重新登入以繼續使用服務' : '建立您的專屬電子名片'}
              </p>
            </div>

            {/* 登入/註冊選項 */}
            <div className="space-y-3 mb-6">
              {/* 手機註冊 */}
              <Card 
                className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer" 
                onClick={() => setShowOTPVerification(true)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">手機號碼註冊</h3>
                      <p className="text-xs text-gray-600">使用手機號碼快速註冊，安全可靠</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* LINE 登入 (有註冊歷史時顯示) */}
              {hasRegistrationHistory && (
                <Card 
                  className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer" 
                  onClick={handleLineLogin}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">LINE 快速登入</h3>
                        <p className="text-xs text-gray-600">使用LINE帳號快速登入</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 註冊/登入按鈕 */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowOTPVerification(true)} 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base font-medium shadow-lg"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {hasRegistrationHistory ? '手機號碼登入' : '開始手機註冊'}
              </Button>
              
              {hasRegistrationHistory && (
                <Button 
                  onClick={handleLineLogin} 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-base font-medium shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  LINE 登入
                </Button>
              )}
            </div>

            {/* 服務條款 */}
            <div className="mt-6 text-center px-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                {hasRegistrationHistory ? '登入' : '註冊'}即表示您同意我們的
                <span className="text-blue-500 underline cursor-pointer mx-1">服務條款</span>
                和
                <span className="text-blue-500 underline cursor-pointer mx-1">隱私政策</span>
              </p>
            </div>
          </div>
        )}

        {/* 已登入用戶的會員資料介面 */}
        {userData && cardData && (
          <div className="p-6">
            {/* 新用戶提示 */}
            {isNewUser && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  🎉 註冊成功！您的電子名片已建立，點擊「編輯個人資料」完善您的資訊
                </p>
              </div>
            )}

            {/* 會員資料卡片 */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-gray-200">
                    <AvatarImage src={cardData?.photo} alt={cardData?.name} />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                      {cardData?.name ? cardData.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{cardData?.name || '未設定姓名'}</h4>
                    {cardData?.companyName && <p className="text-sm text-gray-600">{cardData.companyName}</p>}
                    {cardData?.jobTitle && <p className="text-sm text-gray-500">{cardData.jobTitle}</p>}
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setShowProfileSettings(true)}>
                    <Settings className="w-4 h-4 mr-1" />
                    設定
                  </Button>
                </div>

                {/* 聯絡資訊 */}
                <div className="space-y-2 mb-4">
                  {cardData?.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{cardData.phone}</span>
                    </div>
                  )}
                  {cardData?.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{cardData.email}</span>
                    </div>
                  )}
                </div>

                {/* 編輯按鈕 */}
                <Button size="sm" variant="outline" className="w-full" onClick={() => setShowCreateCard(true)}>
                  <Edit className="w-4 h-4 mr-1" />
                  編輯個人資料
                </Button>
              </CardContent>
            </Card>

            {/* 提示訊息 */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">功能已整合至選單</h4>
                    <p className="text-sm text-blue-700">
                      名片管理和點數優惠功能已移至下方選單中，您可以透過選單快速存取這些功能。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCard;
