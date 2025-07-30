import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff, ChevronUp, ChevronDown, Download, MessageCircle, Facebook, Instagram, Youtube, Linkedin, Globe, MapPin, Mail, Phone, Twitter, Plus, X, Settings, TrendingUp, Coins, Calendar, Check } from 'lucide-react';
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
const MyCard: React.FC<MyCardProps> = ({
  onClose
}) => {
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
  const [activeTab, setActiveTab] = useState<'cards' | 'points' | 'settings'>('cards');
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
Email: ${defaultCardData.email || ''}
LINE: ${defaultCardData.line || ''}
網站: ${defaultCardData.website || ''}`;
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

    // 生成QR Code資料
    const qrInfo = `名片資訊
姓名: ${cardInfo.name || ''}
公司: ${cardInfo.companyName || ''}
電話: ${cardInfo.phone || ''}
Email: ${cardInfo.email || ''}
LINE: ${cardInfo.line || ''}
網站: ${cardInfo.website || ''}`;
    setQrCodeData(qrInfo);
  };
  const handleCardCreated = () => {
    setShowCreateCard(false);
    setIsNewUser(false);
    // 重新載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setCardData(cardInfo);

      // 重新生成QR Code資料
      const qrInfo = `名片資訊
姓名: ${cardInfo.name || ''}
${cardInfo.jobTitle && cardInfo.jobTitleVisible !== false ? `職稱: ${cardInfo.jobTitle}` : ''}
公司: ${cardInfo.companyName || ''}
電話: ${cardInfo.phone || ''}
Email: ${cardInfo.email || ''}
${cardInfo.address && cardInfo.addressVisible ? `地址: ${cardInfo.address}` : ''}
${cardInfo.birthday && cardInfo.birthdayVisible ? `生日: ${formatBirthdayDisplay(cardInfo.birthday)}` : ''}
${cardInfo.gender && cardInfo.genderVisible ? `性別: ${getGenderDisplay(cardInfo.gender)}` : ''}
LINE: ${cardInfo.line || ''}
網站: ${cardInfo.website || ''}`;
      setQrCodeData(qrInfo);
      console.log('生成QR Code:', qrInfo);
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
  const handleLineClick = (lineUrl: string) => {
    if (lineUrl) {
      window.open(lineUrl, '_blank');
    }
  };
  const downloadQRCode = () => {
    toast({
      title: "QR Code 已下載",
      description: "QR Code 圖片已儲存到您的裝置。"
    });
    console.log('下載 QR Code');
  };
  const downloadCard = () => {
    toast({
      title: "名片已下載",
      description: "電子名片已儲存到您的裝置。"
    });
    console.log('下載名片');
  };

  // 儲存個人資料
  const saveProfileData = (updatedData: any) => {
    const newData = { ...profileData, ...updatedData };
    setProfileData(newData);
    localStorage.setItem('aile-profile-data', JSON.stringify(newData));
  };

  // 性別設定處理
  const handleGenderSelect = (gender: string) => {
    saveProfileData({ gender });
    setShowGenderDialog(false);
    toast({
      title: "性別已更新",
      description: "您的性別資訊已成功儲存。"
    });
  };

  // 手機號碼驗證處理
  const handlePhoneUpdate = () => {
    if (!tempPhone) return;
    setShowPhoneOTP(true);
    // 模擬發送OTP
    setTimeout(() => {
      toast({
        title: "驗證碼已發送",
        description: `驗證碼已發送至 ${tempPhone}`
      });
    }, 1000);
  };

  const handlePhoneOTPVerify = () => {
    if (phoneOTP === '123456') {
      saveProfileData({ 
        phone: tempPhone, 
        isPhoneVerified: true 
      });
      setShowPhoneDialog(false);
      setShowPhoneOTP(false);
      setPhoneOTP('');
      setTempPhone('');
      toast({
        title: "手機號碼驗證成功",
        description: "您的手機號碼已成功驗證。"
      });
    } else {
      toast({
        title: "驗證失敗",
        description: "驗證碼錯誤，請重新輸入。",
        variant: "destructive"
      });
    }
  };

  // 電子郵件驗證處理
  const handleEmailVerification = () => {
    if (!tempEmail) return;
    setEmailVerificationSent(true);
    // 模擬發送驗證郵件
    setTimeout(() => {
      toast({
        title: "驗證郵件已發送",
        description: `驗證連結已發送至 ${tempEmail}`
      });
    }, 1000);
  };

  const handleEmailVerificationSuccess = () => {
    saveProfileData({ 
      email: tempEmail, 
      isEmailVerified: true 
    });
    setShowEmailDialog(false);
    setEmailVerificationSent(false);
    setTempEmail('');
    toast({
      title: "✅ 您的 Email 驗證成功！",
      description: "恭喜！您的電子信箱已完成驗證，現在可以完整使用 Aipower 名片功能。"
    });
  };

  // 生日設定處理
  const formatBirthdayInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}/${digits.slice(4)}`;
    return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`;
  };

  const handleBirthdayUpdate = () => {
    if (!tempBirthday) return;
    const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!datePattern.test(tempBirthday)) {
      toast({
        title: "日期格式錯誤",
        description: "請使用 YYYY/MM/DD 格式",
        variant: "destructive"
      });
      return;
    }
    
    saveProfileData({ birthday: tempBirthday });
    setShowBirthdayDialog(false);
    setTempBirthday('');
    toast({
      title: "生日已更新",
      description: "您的生日資訊已成功儲存。"
    });
  };
  const shareCard = (card = cardData) => {
    if (navigator.share) {
      navigator.share({
        title: `${card.name}的電子名片`,
        text: `${card.companyName} - ${card.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${card.name}的電子名片 - ${card.companyName}`);
      toast({
        title: "已複製到剪貼板",
        description: "名片資訊已複製，可以分享給朋友。"
      });
    }
  };

  const editCard = (card = cardData) => {
    // 設定要編輯的名片資料到 localStorage
    localStorage.setItem('editing-card-data', JSON.stringify(card));
    setShowCreateCard(true);
  };

  const addNewCard = () => {
    // 清除編輯狀態，設定為新增模式
    localStorage.removeItem('editing-card-data');
    localStorage.setItem('card-creation-mode', 'new');
    
    // 直接顯示CreateCard組件
    setShowCreateCard(true);
  };

  const deleteAdditionalCard = (cardIndex: number) => {
    const updatedCards = additionalCards.filter((_, index) => index !== cardIndex);
    setAdditionalCards(updatedCards);
    localStorage.setItem('aile-additional-cards', JSON.stringify(updatedCards));
    toast({
      title: "名片已刪除",
      description: "電子名片已成功刪除。"
    });
  };
  if (showOTPVerification) {
    return <OTPVerification onClose={() => setShowOTPVerification(false)} onVerificationComplete={handleVerificationComplete} />;
  }
  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} onRegistrationComplete={handleCardCreated} userData={userData} />;
  }
  if (showProfileSettings) {
    return <ProfileSettings onClose={() => setShowProfileSettings(false)} />;
  }
  return <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">
              {userData && cardData ? '我的電子名片' : hasRegistrationHistory ? 'LINE 快速登入' : '手機號碼註冊'}
            </h1>
          </div>
          {userData && cardData && <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4" />
            </Button>}
        </div>
      </div>

      {/* Tab Navigation */}
      {userData && cardData && (
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('cards')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'cards'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <User className="w-4 h-4 inline-block mr-1" />
              我的名片
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'points'
                  ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Coins className="w-4 h-4 inline-block mr-1" />
              會員點數
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'settings'
                  ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-1" />
              資料設定
            </button>
          </div>
        </div>
      )}

      {/* 如果沒有用戶資料或名片資料，顯示登入/註冊介面 */}
      {(!userData || !cardData) && <div className="p-4">
          {/* 歡迎區塊 */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {hasRegistrationHistory ? '歡迎回來' : '歡迎使用電子名片'}
            </h2>
            <p className="text-gray-600 text-sm px-2">
              {hasRegistrationHistory ? '請使用 LINE 快速登入' : '請先完成手機號碼註冊，建立您的專屬電子名片'}
            </p>
          </div>

          {/* 登入/註冊選項 */}
          <div className="space-y-3 mb-6">
            {/* 沒有註冊歷史時顯示手機註冊 */}
            {!hasRegistrationHistory && <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setShowOTPVerification(true)}>
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
              </Card>}

            {/* 有註冊歷史時顯示 LINE 登入 */}
            {hasRegistrationHistory && <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer" onClick={handleLineLogin}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">LINE 快速登入</h3>
                      <p className="text-xs text-gray-600">使用LINE帳號快速登入</p>
                    </div>
                  </div>
                </CardContent>
              </Card>}
          </div>

          {/* 註冊/登入按鈕 */}
          <div className="space-y-3">
            {!hasRegistrationHistory ? <Button onClick={() => setShowOTPVerification(true)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base font-medium shadow-lg">
                <Smartphone className="w-4 h-4 mr-2" />
                開始手機註冊
              </Button> : <Button onClick={handleLineLogin} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-base font-medium shadow-lg">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z" />
                </svg>
                LINE 快速登入
              </Button>}
          </div>

          {/* 有註冊歷史時，新增立即註冊連結區塊 */}
          {hasRegistrationHistory && <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <Button onClick={() => {
            // 清除註冊歷史，讓用戶回到首次註冊流程
            setHasRegistrationHistory(false);
          }} variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Smartphone className="w-4 h-4 mr-2" />
                  立即註冊
                </Button>
              </div>
            </div>}

          {/* 功能說明 */}
          <Card className="mt-6 bg-blue-50 border border-blue-200">
            <CardContent className="p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">
                {hasRegistrationHistory ? '登入後您可以：' : '註冊後您可以：'}
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center">
                  <QrCode className="w-3 h-3 mr-2 flex-shrink-0" />
                  {hasRegistrationHistory ? '管理您的電子名片' : '建立專屬電子名片'}
                </li>
                <li className="flex items-center">
                  <Share2 className="w-3 h-3 mr-2 flex-shrink-0" />
                  快速分享聯絡資訊
                </li>
                <li className="flex items-center">
                  <Award className="w-3 h-3 mr-2 flex-shrink-0" />
                  {hasRegistrationHistory ? '查看會員點數' : '獲得會員點數獎勵'}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 服務條款 */}
          <div className="mt-4 text-center px-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              {hasRegistrationHistory ? '登入' : '註冊'}即表示您同意我們的
              <span className="text-blue-500 underline cursor-pointer mx-1">服務條款</span>
              和
              <span className="text-blue-500 underline cursor-pointer mx-1">隱私政策</span>
            </p>
          </div>
        </div>}

      {/* 已登入用戶的名片管理介面 */}
      {userData && cardData && <div>

          <div className="p-6">
            {/* 我的名片 Tab */}
            {activeTab === 'cards' && (
              <div>
                {/* 新用戶提示 */}
                {isNewUser && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 註冊成功！您的電子名片已建立，點擊「編輯名片」完善您的資訊
                    </p>
                  </div>}

            {/* 多名片管理區塊 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">我的電子名片</h3>
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
                  <span className="text-lg font-bold mr-1">+</span>
                  新增名片
                </Button>
              </div>

              {/* 名片列表 */}
              <div className="space-y-3">
                {(() => {
                  const multiCards = JSON.parse(localStorage.getItem('aile-additional-cards') || '[]');
                  const currentCard = cardData ? { ...cardData, id: 'current', name: cardData.name || '主要名片' } : null;
                  const allCards = currentCard ? [currentCard, ...multiCards] : multiCards;
                  
                  const handleSwipeStart = (e: React.TouchEvent, cardId: string) => {
                    const touch = e.touches[0];
                    const startX = touch.clientX;
                    
                    const handleTouchMove = (moveE: TouchEvent) => {
                      const currentTouch = moveE.touches[0];
                      const diffX = startX - currentTouch.clientX;
                      
                      if (diffX > 50) { // 左滑超過50px
                        setSwipedCardId(cardId);
                      } else if (diffX < -20) { // 右滑回復
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
                      onTouchStart={card.id !== 'current' ? (e) => handleSwipeStart(e, card.id) : undefined}
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
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div 
                                className="flex-1 cursor-pointer"
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
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-gray-800">{card.name}</h4>
                                  {card.id === 'current' && (
                                    <Badge variant="secondary" className="text-xs">預設</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {card.companyName && `${card.companyName} • `}
                                  {card.phone || card.email || '待完善資訊'}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    shareCard(card);
                                  }}
                                >
                                  <Share2 className="w-3 h-3 mr-1" />
                                  分享
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>尚未建立任何名片</p>
                    </div>
                  );
                })()}
              </div>
            </div>
              </div>
            )}

            {/* 會員點數 Tab */}
            {activeTab === 'points' && (
              <div>
                {/* 超值群募解鎖包 - 置頂 */}
                <Card className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="mb-4">
                        <Badge className="bg-purple-600 text-white mb-2">限時優惠</Badge>
                        <h2 className="text-xl font-bold text-gray-800">超值群募解鎖包</h2>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        $7200/年
                      </div>
                      <p className="text-gray-600 mb-1">每月只要 $600</p>
                      <p className="text-sm text-gray-500 mb-4">預繳一年 $7200，一年不限次數全功能解鎖</p>
                      
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-medium">
                        立即升級
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 點數總覽 */}
                <Card className="mb-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <Coins className="w-16 h-16 mx-auto text-orange-500 mb-2" />
                      <h2 className="text-2xl font-bold text-gray-800">目前點數</h2>
                    </div>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {currentPoints.toLocaleString()}
                    </div>
                    <p className="text-gray-600">點</p>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      {currentPoints >= 50 ? <div className="text-green-600">
                          <Award className="w-5 h-5 inline-block mr-1" />
                          <span className="font-medium">可兌換商務版試用！</span>
                        </div> : <div className="text-gray-600">
                          <span className="text-sm">
                            還需 {50 - currentPoints} 點即可兌換商務版試用
                          </span>
                        </div>}
                    </div>
                  </CardContent>
                </Card>

                {/* 兌點升級 */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Award className="w-5 h-5 mr-2 text-purple-600" />
                      兌點升級
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 relative">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-green-700">商務版試用</h3>
                        <p className="text-2xl font-bold text-green-600 my-2">50點</p>
                        <p className="text-sm text-green-600 mb-4">14天全功能解鎖</p>
                        <Button 
                          className={`w-full ${currentPoints >= 50 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                          disabled={currentPoints < 50}
                        >
                          {currentPoints >= 50 ? '立即兌換' : '點數不足'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 獲得點數方式 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      獲得點數方式
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-blue-900">完成電子名片註冊</span>
                        </div>
                        <Badge className="bg-green-500 text-white">+50點</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                            <Edit className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-purple-900">完整個人資料(70%以上)</span>
                        </div>
                        <Badge className="bg-green-500 text-white">+50點</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                            <Share2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-orange-900">邀請好友註冊</span>
                        </div>
                        <Badge className="bg-green-500 text-white">+50點</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 資料設定 Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {/* 個人資料設定 - 直接展開 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      個人資料設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 性別設定 */}
                    <Dialog open={showGenderDialog} onOpenChange={setShowGenderDialog}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">性別</span>
                              <p className="text-sm text-gray-600">設定您的性別資訊</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {profileData.gender ? (profileData.gender === 'male' ? '男性' : '女性') : '未設定'}
                          </span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>選擇性別</DialogTitle>
                          <DialogDescription>
                            請選擇您的性別
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleGenderSelect('male')}
                          >
                            男性
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleGenderSelect('female')}
                          >
                            女性
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 手機號碼驗證 */}
                    <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Smartphone className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">手機號碼驗證</span>
                              <p className="text-sm text-gray-600">
                                {profileData.phone || '設定您的手機號碼'}
                              </p>
                            </div>
                          </div>
                          <Badge className={profileData.isPhoneVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                            {profileData.isPhoneVerified ? '已驗證' : '未驗證'}
                          </Badge>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>手機號碼驗證</DialogTitle>
                          <DialogDescription>
                            {profileData.phone ? '修改您的手機號碼' : '設定您的手機號碼'}
                          </DialogDescription>
                        </DialogHeader>
                        {!showPhoneOTP ? (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="phone">手機號碼</Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="請輸入手機號碼"
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowPhoneDialog(false)}>
                                取消
                              </Button>
                              <Button onClick={handlePhoneUpdate}>
                                發送驗證碼
                              </Button>
                            </DialogFooter>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="phoneOTP">驗證碼</Label>
                              <Input
                                id="phoneOTP"
                                type="text"
                                placeholder="請輸入驗證碼 (測試用: 123456)"
                                value={phoneOTP}
                                onChange={(e) => setPhoneOTP(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {
                                setShowPhoneOTP(false);
                                setPhoneOTP('');
                              }}>
                                返回
                              </Button>
                              <Button onClick={handlePhoneOTPVerify}>
                                驗證
                              </Button>
                            </DialogFooter>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* 電子郵件驗證 */}
                    <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Mail className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">電子郵件驗證</span>
                              <p className="text-sm text-gray-600">
                                {profileData.email || '設定您的電子郵件'}
                              </p>
                            </div>
                          </div>
                          <Badge className={profileData.isEmailVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                            {profileData.isEmailVerified ? '已驗證' : '未驗證'}
                          </Badge>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>電子郵件驗證</DialogTitle>
                          <DialogDescription>
                            {profileData.email ? '修改您的電子郵件' : '設定您的電子郵件'}
                          </DialogDescription>
                        </DialogHeader>
                        {!emailVerificationSent ? (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="email">電子郵件</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="請輸入電子郵件"
                                value={tempEmail}
                                onChange={(e) => setTempEmail(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                                取消
                              </Button>
                              <Button onClick={handleEmailVerification}>
                                發送驗證信
                              </Button>
                            </DialogFooter>
                          </div>
                        ) : (
                          <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 mb-2">驗證信已發送</h3>
                              <p className="text-sm text-gray-600 mb-4">
                                我們已發送驗證連結至 {tempEmail}，請點擊郵件中的連結完成驗證。
                              </p>
                              <Button 
                                className="w-full mb-2"
                                onClick={handleEmailVerificationSuccess}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                模擬驗證成功
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => {
                                  setEmailVerificationSent(false);
                                  setShowEmailDialog(false);
                                }}
                              >
                                關閉
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* 生日設定 */}
                    <Dialog open={showBirthdayDialog} onOpenChange={setShowBirthdayDialog}>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">生日</span>
                              <p className="text-sm text-gray-600">設定您的生日</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {profileData.birthday || '未設定'}
                          </span>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>設定生日</DialogTitle>
                          <DialogDescription>
                            請輸入您的出生日期 (西元年月日)
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="birthday">生日</Label>
                            <Input
                              id="birthday"
                              type="text"
                              placeholder="YYYY/MM/DD"
                              value={tempBirthday}
                              onChange={(e) => setTempBirthday(formatBirthdayInput(e.target.value))}
                              maxLength={10}
                            />
                            <p className="text-xs text-gray-500 mt-1">格式：1990/01/01</p>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {
                              setShowBirthdayDialog(false);
                              setTempBirthday('');
                            }}>
                              取消
                            </Button>
                            <Button onClick={handleBirthdayUpdate}>
                              確定
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 公開電子名片 */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">公開電子名片</span>
                          <p className="text-sm text-gray-600">您的名片可被其他用戶搜尋與發現</p>
                        </div>
                      </div>
                      <Switch 
                        checked={profileData.publicCard}
                        onCheckedChange={(checked) => saveProfileData({ publicCard: checked })}
                      />
                    </div>

                    {/* 允許直接加入 */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Plus className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">允許直接加入</span>
                          <p className="text-sm text-gray-600">用戶可直接將您的名片儲存至他們的名片夾</p>
                        </div>
                      </div>
                      <Switch 
                        checked={profileData.allowDirectAdd}
                        onCheckedChange={(checked) => saveProfileData({ allowDirectAdd: checked })}
                      />
                    </div>

                    {/* 接收通知 */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">接收通知</span>
                          <p className="text-sm text-gray-600">您將收到各功能相關的系統通知與提醒</p>
                        </div>
                      </div>
                      <Switch 
                        checked={profileData.receiveNotifications}
                        onCheckedChange={(checked) => saveProfileData({ receiveNotifications: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 帳戶管理 - 直接展開 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <LogOut className="w-5 h-5 mr-2 text-red-600" />
                      帳戶管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">登出帳戶</h4>
                        <p className="text-sm text-gray-600">退出當前帳戶</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      登出帳戶
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>}
    </div>;
};
export default MyCard;