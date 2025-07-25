import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff, ChevronUp, ChevronDown, Download, MessageCircle, Facebook, Instagram, Youtube, Linkedin, Globe, MapPin, Mail, Phone } from 'lucide-react';
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

      // 載入點數資訊
      const savedPoints = localStorage.getItem('aile-user-points');
      if (savedPoints) {
        setCurrentPoints(parseInt(savedPoints));
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

          {/* 名片預覽 - 使用與 CardPreview 相同的樣式 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto mb-6">
            {/* 頭部資訊 */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                {cardData.photo && (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <img src={cardData.photo} alt="頭像" className="w-14 h-14 rounded-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  {cardData.companyName && cardData.companyNameVisible !== false && (
                    <p className="text-blue-100 text-sm">{cardData.companyName}</p>
                  )}
                  <h3 className="text-white text-lg font-semibold mb-1">
                    {(cardData.name && cardData.nameVisible !== false) ? cardData.name : '您的姓名'}
                  </h3>
                  {cardData.jobTitle && cardData.jobTitleVisible !== false && (
                    <p className="text-blue-100 text-sm">{cardData.jobTitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className="p-4 space-y-3">
              {/* 電話 */}
              {((cardData.phone && cardData.phoneVisible !== false) || (cardData.mobilePhone && cardData.mobilePhoneVisible !== false)) && (
                <div>
                  {cardData.mobilePhone && cardData.mobilePhoneVisible !== false && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-600">📱</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">手機</p>
                        <p className="text-sm text-gray-800">{cardData.mobilePhone}</p>
                      </div>
                    </div>
                  )}
                  {cardData.phone && cardData.phoneVisible !== false && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">☎️</span>
                      <div>
                        <p className="text-xs font-medium text-gray-700">公司電話</p>
                        <p className="text-sm text-gray-800">{cardData.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 辦公室電話 */}
              {cardData.officePhone && cardData.officePhoneVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">☎️</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">辦公室</p>
                    <p className="text-sm text-gray-800">{cardData.officePhone}</p>
                  </div>
                </div>
              )}

              {/* 傳真 */}
              {cardData.fax && cardData.faxVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">📠</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">傳真</p>
                    <p className="text-sm text-gray-800">{cardData.fax}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              {cardData.email && cardData.emailVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">✉️</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-800">{cardData.email}</p>
                  </div>
                </div>
              )}

              {/* 副信箱 */}
              {cardData.email2 && cardData.email2Visible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">✉️</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">副信箱</p>
                    <p className="text-sm text-gray-800">{cardData.email2}</p>
                  </div>
                </div>
              )}

              {/* 網站 */}
              {cardData.website && cardData.websiteVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">🌐</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">網站</p>
                    <p className="text-sm text-gray-800">{cardData.website}</p>
                  </div>
                </div>
              )}

              {/* 地址 */}
              {cardData.address && cardData.addressVisible && (
                <div className="flex items-start space-x-2">
                  <span className="text-gray-600 mt-0.5">📍</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">地址</p>
                    <p className="text-sm text-gray-800">{cardData.address}</p>
                  </div>
                </div>
              )}

              {/* 公司地址 */}
              {cardData.companyAddress && cardData.companyAddressVisible !== false && (
                <div className="flex items-start space-x-2">
                  <span className="text-gray-600 mt-0.5">📍</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">公司地址</p>
                    <p className="text-sm text-gray-800">{cardData.companyAddress}</p>
                  </div>
                </div>
              )}

              {/* 部門 */}
              {cardData.department && cardData.departmentVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">🏢</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">部門</p>
                    <p className="text-sm text-gray-800">{cardData.department}</p>
                  </div>
                </div>
              )}

              {/* 職位 */}
              {cardData.position && cardData.positionVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">💼</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">職位</p>
                    <p className="text-sm text-gray-800">{cardData.position}</p>
                  </div>
                </div>
              )}

              {/* 專長 */}
              {cardData.skills && cardData.skillsVisible !== false && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">⭐</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">專長</p>
                    <p className="text-sm text-gray-800">{cardData.skills}</p>
                  </div>
                </div>
              )}

              {/* 生日 */}
              {cardData.birthday && cardData.birthdayVisible && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">🎂</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">生日</p>
                    <p className="text-sm text-gray-800">{formatBirthdayDisplay(cardData.birthday)}</p>
                  </div>
                </div>
              )}

              {/* 性別 */}
              {cardData.gender && cardData.genderVisible && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">👤</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">性別</p>
                    <p className="text-sm text-gray-800">{getGenderDisplay(cardData.gender)}</p>
                  </div>
                </div>
              )}

              {/* 自我介紹 */}
              {cardData.introduction && cardData.introductionVisible !== false && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-600 mt-0.5">💬</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">自我介紹</p>
                      <p className="text-sm text-gray-600">{cardData.introduction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 其他資訊 */}
              {cardData.otherInfo && cardData.otherInfoVisible !== false && (
                <div className="p-3 bg-white/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-600 mt-0.5">📋</span>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">其他資訊</p>
                      <p className="text-xs text-gray-600">{cardData.otherInfo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 社群媒體與操作區域 */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              {/* 社群媒體符號 */}
              {(cardData.line && cardData.lineVisible !== false || 
                cardData.facebook && cardData.facebookVisible !== false || 
                cardData.instagram && cardData.instagramVisible !== false ||
                cardData.youtube && cardData.youtubeVisible !== false ||
                cardData.linkedin && cardData.linkedinVisible !== false ||
                cardData.twitter && cardData.twitterVisible !== false ||
                cardData.tiktok && cardData.tiktokVisible !== false ||
                cardData.threads && cardData.threadsVisible !== false ||
                cardData.wechat && cardData.wechatVisible !== false ||
                cardData.whatsapp && cardData.whatsappVisible !== false) && (
                <div className="flex justify-center flex-wrap gap-3 mb-4">
                  {cardData.line && cardData.lineVisible !== false && (
                    <a 
                      href={cardData.line} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">💬</span>
                    </a>
                  )}
                  {cardData.facebook && cardData.facebookVisible !== false && (
                    <a 
                      href={cardData.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">📘</span>
                    </a>
                  )}
                  {cardData.instagram && cardData.instagramVisible !== false && (
                    <a 
                      href={cardData.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">📷</span>
                    </a>
                  )}
                  {cardData.youtube && cardData.youtubeVisible !== false && (
                    <a 
                      href={cardData.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">🎥</span>
                    </a>
                  )}
                  {cardData.linkedin && cardData.linkedinVisible !== false && (
                    <a 
                      href={cardData.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">💼</span>
                    </a>
                  )}
                  {cardData.twitter && cardData.twitterVisible !== false && (
                    <a 
                      href={cardData.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg font-bold">𝕏</span>
                    </a>
                  )}
                  {cardData.tiktok && cardData.tiktokVisible !== false && (
                    <a 
                      href={cardData.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">🎵</span>
                    </a>
                  )}
                  {cardData.threads && cardData.threadsVisible !== false && (
                    <a 
                      href={cardData.threads} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">🧵</span>
                    </a>
                  )}
                  {cardData.wechat && cardData.wechatVisible !== false && (
                    <div 
                      className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      title="WeChat"
                    >
                      <span className="text-white text-lg">💬</span>
                    </div>
                  )}
                  {cardData.whatsapp && cardData.whatsappVisible !== false && (
                    <a 
                      href={`https://wa.me/${cardData.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                      <span className="text-white text-lg">📱</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
              {/* QR Code 區塊 */}
              <Card className="mb-6 shadow-lg">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <QrCode className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-gray-800">我的名片 QR Code</span>
                    </div>
                    {showQRCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  
                  {showQRCode && (
                    <div className="mt-3 text-center">
                      <div className="flex justify-center mb-3">
                        {generateQRCode(qrCodeData)}
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        掃描此QR Code即可獲得我的聯絡資訊
                      </p>
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下載 QR Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 操作按鈕 */}
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
            </div>
          </div>}
    </div>;
};
export default MyCard;