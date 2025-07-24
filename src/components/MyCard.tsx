import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff, ChevronUp, ChevronDown, Download, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CreateCard from './CreateCard';
import Points from './Points';
import OTPVerification from './OTPVerification';
import PointsWidget from './PointsWidget';
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
  const [showPoints, setShowPoints] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
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
    // 載入初始資料的函數
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
    };

    // 初始載入資料
    loadCardData();

    // 監聽localStorage變化，實現即時同步
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aile-card-data' && e.newValue) {
        const cardInfo = JSON.parse(e.newValue);
        setCardData(cardInfo);
        
        // 同步更新QR Code資料
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
      }
    };

    // 監聽跨標籤頁的localStorage變化
    window.addEventListener('storage', handleStorageChange);

    // 監聽同一頁面內的localStorage變化（自定義事件）
    const handleCustomStorageChange = () => {
      loadCardData();
    };
    
    window.addEventListener('cardDataUpdated', handleCustomStorageChange);

    // 清理監聽器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cardDataUpdated', handleCustomStorageChange);
    };

    // 載入點數資訊
    const savedPoints = localStorage.getItem('aile-user-points');
    if (savedPoints) {
      setCurrentPoints(parseInt(savedPoints));
    }
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
    setShowPoints(false);
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
  if (showOTPVerification) {
    return <OTPVerification onClose={() => setShowOTPVerification(false)} onVerificationComplete={handleVerificationComplete} />;
  }
  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} onRegistrationComplete={handleCardCreated} userData={userData} />;
  }
  if (showPoints) {
    return <Points onClose={() => setShowPoints(false)} />;
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
          {/* 新增功能區塊 */}
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-3">
              {/* 名片設置 */}
              <Card className="border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setShowCreateCard(true)}>
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-800">名片設定</h3>
                </CardContent>
              </Card>

              {/* 會員點數 */}
              <Card className="border border-gray-200 hover:border-yellow-300 transition-colors cursor-pointer" onClick={() => setShowPoints(true)}>
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-800">會員點數</h3>
                </CardContent>
              </Card>

              {/* 資料設定 */}
              <Card className="border border-gray-200 hover:border-green-300 transition-colors cursor-pointer" onClick={() => setShowProfileSettings(true)}>
                <CardContent className="p-3 text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-800">資料設定</h3>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="p-6">
            {/* 新用戶提示 */}
            {isNewUser && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  🎉 註冊成功！您的電子名片已建立，點擊「編輯名片」完善您的資訊
                </p>
              </div>}

          {/* 名片預覽 - 包含 QR Code */}
          <Card className="mb-6 shadow-xl border-2 border-green-200">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  {cardData.photo && <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                      <AvatarImage src={cardData.photo} alt="照片" />
                      <AvatarFallback className="bg-white text-green-600 font-bold text-xl">
                        {cardData.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{cardData.name && cardData.nameVisible !== false ? cardData.name : '您的姓名'}</h2>
                    {cardData.jobTitle && cardData.jobTitleVisible !== false && <p className="text-green-100 text-sm mb-1">{cardData.jobTitle}</p>}
                    {cardData.companyName && cardData.companyNameVisible !== false && <p className="text-green-100 text-lg">{cardData.companyName}</p>}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {cardData.introduction && cardData.introductionVisible !== false && <div className="bg-white/10 p-2 rounded text-xs mb-3">
                      <span className="mr-2">💬</span>
                      <span>{cardData.introduction}</span>
                    </div>}
                  {cardData.phone && cardData.phoneVisible !== false && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{cardData.phone}</span>
                    </div>}
                  {cardData.mobilePhone && cardData.mobilePhoneVisible !== false && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{cardData.mobilePhone}</span>
                    </div>}
                  {cardData.email && cardData.emailVisible !== false && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{cardData.email}</span>
                    </div>}
                  {cardData.website && cardData.websiteVisible !== false && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{cardData.website}</span>
                    </div>}
                  {cardData.address && cardData.addressVisible && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{cardData.address}</span>
                    </div>}
                  {cardData.birthday && cardData.birthdayVisible && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{formatBirthdayDisplay(cardData.birthday)}</span>
                    </div>}
                  {cardData.gender && cardData.genderVisible && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{getGenderDisplay(cardData.gender)}</span>
                    </div>}
                </div>

                {/* 社群資訊 */}
                {(cardData.line && cardData.lineVisible !== false || 
                  cardData.facebook && cardData.facebookVisible !== false || 
                  cardData.instagram && cardData.instagramVisible !== false ||
                  (cardData.socialMedia && cardData.socialMedia.some((item: any) => item.visible))) && 
                  <div className="mt-4 pt-4 border-t border-green-300/50">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {cardData.line && cardData.lineVisible !== false && 
                        <button onClick={() => handleLineClick(cardData.line)} className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </button>}
                      {cardData.facebook && cardData.facebookVisible !== false && 
                        <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
                          <Facebook className="w-5 h-5 text-white" />
                        </div>}
                      {cardData.instagram && cardData.instagramVisible !== false && 
                        <div className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
                          <Instagram className="w-5 h-5 text-white" />
                        </div>}
                      
                      {/* 新增的社群媒體 */}
                      {cardData.socialMedia && cardData.socialMedia.filter((item: any) => item.visible).map((item: any) => (
                        <button 
                          key={item.id}
                          onClick={() => window.open(item.url, '_blank')}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                          style={{
                            backgroundColor: 
                              item.platform === 'youtube' ? '#ff0000' : 
                              item.platform === 'linkedin' ? '#0077b5' : 
                              item.platform === 'threads' ? '#000000' : '#666666'
                          }}
                          title={item.platform}
                        >
                          {item.platform === 'youtube' && <span className="text-white font-bold text-xs">YT</span>}
                          {item.platform === 'linkedin' && <span className="text-white font-bold text-xs">in</span>}
                          {item.platform === 'threads' && <span className="text-white">🧵</span>}
                        </button>
                      ))}
                    </div>
                  </div>}

                {/* 其他資訊 */}
                {cardData.otherInfo && cardData.otherInfoVisible !== false && (
                  <div className="mt-4 pt-4 border-t border-green-300/50">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <span className="text-sm opacity-75">📝</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-1 opacity-90">其他資訊</h4>
                          <p className="text-xs opacity-80 leading-relaxed">{cardData.otherInfo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
              
              {/* QR Code 區塊 - 移到名片內部 */}
              <div className="p-4 bg-white border-t">
                <Button variant="ghost" onClick={() => setShowQRCode(!showQRCode)} className="w-full flex items-center justify-between p-2 hover:bg-gray-50">
                  <div className="flex items-center">
                    <QrCode className="w-4 h-4 mr-2" />
                    <span className="font-semibold text-gray-800">我的名片 QR Code</span>
                  </div>
                  {showQRCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                
                {showQRCode && <div className="mt-3 text-center">
                    <div className="flex justify-center mb-3">
                      {generateQRCode(qrCodeData)}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      掃描此QR Code即可獲得我的聯絡資訊
                    </p>
                    <Button onClick={downloadQRCode} variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50">
                      <Download className="w-4 h-4 mr-1" />
                      下載 QR Code
                    </Button>
                  </div>}
              </div>
            </CardContent>
          </Card>

          {/* 操作按鈕 - 移到公開設定上方 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={() => setShowCreateCard(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Edit className="w-4 h-4 mr-1" />
              編輯名片
            </Button>

            <Button onClick={shareCard} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              <Share2 className="w-4 h-4 mr-1" />
              分享名片
            </Button>
          </div>


          <PointsWidget onPointsClick={() => setShowPoints(true)} />
          </div>
        </div>}
    </div>;
};
export default MyCard;