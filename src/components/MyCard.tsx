import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff, ChevronUp, ChevronDown, Download, MessageCircle, Facebook, Instagram, Settings, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CreateCard from './CreateCard';
import Points from './Points';
import ProfileSettings from './ProfileSettings';
import OTPVerification from './OTPVerification';
import PointsWidget from './PointsWidget';

interface MyCardProps {
  onClose: () => void;
}

const MyCard: React.FC<MyCardProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [activeTab, setActiveTab] = useState<'card' | 'points' | 'profile'>('card');
  const [qrCodeData, setQrCodeData] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPublicSettings, setShowPublicSettings] = useState(true);
  const [publicSettings, setPublicSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: false,
    receiveNotifications: true
  });
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasRegistrationHistory, setHasRegistrationHistory] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);

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

      // 自動生成QR Code資料
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
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      setPublicSettings(JSON.parse(savedSettings));
    }

    // 載入點數資訊
    const savedPoints = localStorage.getItem('aile-user-points');
    if (savedPoints) {
      setCurrentPoints(parseInt(savedPoints));
    }
  }, []);

  const handleVerificationComplete = (phone: string) => {
    const phoneUser = {
      phone: phone,
      displayName: '',
      pictureUrl: null,
      loginMethod: 'phone',
      registeredAt: new Date(),
      isVerified: true
    };

    localStorage.setItem('aile-user-data', JSON.stringify(phoneUser));
    localStorage.setItem('aile-registration-history', JSON.stringify({
      registeredAt: new Date(),
      method: 'phone',
      hasRegistered: true
    }));
    setUserData(phoneUser);
    setHasRegistrationHistory(true);

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

    localStorage.setItem('aile-card-data', JSON.stringify(defaultCardData));
    setCardData(defaultCardData);

    const qrInfo = `名片資訊
姓名: ${defaultCardData.name || ''}
公司: ${defaultCardData.companyName || ''}
電話: ${defaultCardData.phone || ''}
Email: ${defaultCardData.email || ''}
LINE: ${defaultCardData.line || ''}
網站: ${defaultCardData.website || ''}`;
    setQrCodeData(qrInfo);

    setIsNewUser(true);
    setShowOTPVerification(false);
  };

  const handleLineLogin = () => {
    const mockLineUser = {
      lineId: `line_${Math.random().toString(36).substr(2, 8)}`,
      displayName: '王小明',
      pictureUrl: null,
      loginMethod: 'line',
      registeredAt: new Date(),
      isVerified: true
    };

    localStorage.setItem('aile-user-data', JSON.stringify(mockLineUser));
    setUserData(mockLineUser);

    const existingCardData = localStorage.getItem('aile-card-data');
    let cardInfo;
    if (existingCardData) {
      cardInfo = JSON.parse(existingCardData);
      cardInfo.line = mockLineUser.lineId;
      if (!cardInfo.name && mockLineUser.displayName) {
        cardInfo.name = mockLineUser.displayName;
      }
      if (!cardInfo.photo && mockLineUser.pictureUrl) {
        cardInfo.photo = mockLineUser.pictureUrl;
      }
    } else {
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

    localStorage.setItem('aile-card-data', JSON.stringify(cardInfo));
    setCardData(cardInfo);

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
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setCardData(cardInfo);

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
    localStorage.removeItem('aile-card-data');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aile-profile-settings');
    localStorage.removeItem('aile-user-points');

    setCardData(null);
    setUserData(null);
    setQrCodeData('');
    setShowCreateCard(false);
    setShowPoints(false);
    setShowOTPVerification(false);
    setIsNewUser(false);
    setCurrentPoints(0);
    setPublicSettings({
      isPublicProfile: false,
      allowDirectContact: false,
      receiveNotifications: true
    });
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

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: `${cardData.name}的電子名片`,
        text: `${cardData.companyName} - ${cardData.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${cardData.name}的電子名片 - ${cardData.companyName}`);
      toast({
        title: "已複製到剪貼板",
        description: "名片資訊已複製，可以分享給朋友。"
      });
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = {
      ...publicSettings,
      [key]: value
    };
    setPublicSettings(newSettings);
    localStorage.setItem('aile-profile-settings', JSON.stringify(newSettings));

    if (key === 'receiveNotifications') {
      toast({
        title: value ? "已開啟通知" : "已關閉通知",
        description: value ? "當有用戶加入您的名片時，將在Aipower聊天室中彈跳通知提醒。" : "將不再接收用戶加入名片的通知提醒。"
      });
    } else {
      toast({
        title: "設定已儲存",
        description: "您的電子名片設定已更新。"
      });
    }
  };

  if (showOTPVerification) {
    return <OTPVerification onClose={() => setShowOTPVerification(false)} onVerificationComplete={handleVerificationComplete} />;
  }
  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} onRegistrationComplete={handleCardCreated} userData={userData} />;
  }
  if (showPoints) {
    return <Points onClose={() => setShowPoints(false)} />;
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
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
          {userData && cardData && (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 如果沒有用戶資料或名片資料，顯示登入/註冊介面 */}
      {(!userData || !cardData) && (
        <div className="p-4">
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

          <div className="space-y-3 mb-6">
            {!hasRegistrationHistory && (
              <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setShowOTPVerification(true)}>
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
            )}

            {hasRegistrationHistory && (
              <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer" onClick={handleLineLogin}>
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
              </Card>
            )}
          </div>

          <div className="space-y-3">
            {!hasRegistrationHistory ? (
              <Button onClick={() => setShowOTPVerification(true)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base font-medium shadow-lg">
                <Smartphone className="w-4 h-4 mr-2" />
                開始手機註冊
              </Button>
            ) : (
              <Button onClick={handleLineLogin} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-base font-medium shadow-lg">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z" />
                </svg>
                LINE 快速登入
              </Button>
            )}
          </div>

          {hasRegistrationHistory && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <Button onClick={() => setHasRegistrationHistory(false)} variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Smartphone className="w-4 h-4 mr-2" />
                  立即註冊
                </Button>
              </div>
            </div>
          )}

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

          <div className="mt-4 text-center px-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              {hasRegistrationHistory ? '登入' : '註冊'}即表示您同意我們的
              <span className="text-blue-500 underline cursor-pointer mx-1">服務條款</span>
              和
              <span className="text-blue-500 underline cursor-pointer mx-1">隱私政策</span>
            </p>
          </div>
        </div>
      )}

      {/* 如果有用戶資料和名片資料，顯示名片內容 */}
      {userData && cardData && (
        <div className="p-4 max-w-sm mx-auto">
          {/* 點數信息小工具 */}
          <PointsWidget onPointsClick={() => setShowPoints(true)} />
          
          {/* Tab Navigation */}
          <div className="flex bg-white border border-gray-200 rounded-lg mb-6 shadow-sm">
            <button 
              onClick={() => setActiveTab('card')} 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'card' 
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-4 h-4 inline-block mr-1" />
              名片設置
            </button>
            <button 
              onClick={() => setActiveTab('points')} 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'points' 
                  ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
              }`}
            >
              <Award className="w-4 h-4 inline-block mr-1" />
              會員點數
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'text-green-600 bg-green-50 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4 inline-block mr-1" />
              資料設定
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'card' && (
            <CreateCard 
              onClose={() => {}} 
              onRegistrationComplete={() => {}} 
              userData={userData} 
            />
          )}

          {activeTab === 'points' && (
            <Points onClose={() => {}} />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings onClose={() => {}} />
          )}
        </div>
      )}
    </div>
  );
};

export default MyCard;
