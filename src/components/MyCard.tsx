import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff, ChevronUp, ChevronDown, Download, MessageCircle, Facebook, Instagram, Youtube, Linkedin, Globe, MapPin, Mail, Phone, Twitter } from 'lucide-react';
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

          {/* 名片預覽 - 包含 QR Code */}
          <Card className="mb-6 shadow-xl border-2 border-green-200">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  {cardData.photo && <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                      <AvatarImage src={cardData.photo} alt="照片" />
                      <AvatarFallback className="bg-white text-blue-600 font-bold text-xl">
                        {cardData.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>}
                  <div className="flex-1">
                    {cardData.name && cardData.nameVisible !== false && (
                      <h2 className="text-xl font-bold mb-1">{cardData.name}</h2>
                    )}
                    {cardData.jobTitle && cardData.jobTitleVisible !== false && (
                      <p className="text-white/90 text-sm mb-1">{cardData.jobTitle}</p>
                    )}
                    {cardData.companyName && cardData.companyNameVisible !== false && (
                      <p className="text-white/80 text-sm">{cardData.companyName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {cardData.introduction && cardData.introductionVisible !== false && <div className="bg-white/10 p-2 rounded text-xs mb-3">
                      <span className="mr-2">💬</span>
                      <span>{cardData.introduction}</span>
                    </div>}
                  
                  {/* 聯絡資訊 */}
                  {cardData.phone && cardData.phoneVisible !== false && <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-white/80" />
                      <span className="truncate">{cardData.phone}</span>
                    </div>}
                  {cardData.mobilePhone && cardData.mobilePhoneVisible !== false && <div className="flex items-center space-x-3">
                      <Smartphone className="w-4 h-4 text-white/80" />
                      <span className="truncate">{cardData.mobilePhone}</span>
                    </div>}
                  {cardData.officePhone && cardData.officePhoneVisible !== false && <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-white/80" />
                      <span className="truncate">辦公室: {cardData.officePhone}</span>
                    </div>}
                  {cardData.fax && cardData.faxVisible !== false && <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-white/80" />
                      <span className="truncate">傳真: {cardData.fax}</span>
                    </div>}
                  {cardData.email && cardData.emailVisible !== false && <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-white/80" />
                      <span className="truncate">{cardData.email}</span>
                    </div>}
                  {cardData.email2 && cardData.email2Visible !== false && <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-white/80" />
                      <span className="truncate">副信箱: {cardData.email2}</span>
                    </div>}
                  {cardData.website && cardData.websiteVisible !== false && <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-white/80" />
                      <span className="truncate">{cardData.website}</span>
                    </div>}
                  
                  {/* 地址和其他資訊 */}
                  {cardData.address && cardData.addressVisible && <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-white/80" />
                      <span className="truncate">{cardData.address}</span>
                    </div>}
                  {cardData.companyAddress && cardData.companyAddressVisible !== false && <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-white/80" />
                      <span className="truncate">公司: {cardData.companyAddress}</span>
                    </div>}
                  {cardData.birthday && cardData.birthdayVisible && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">生日: {formatBirthdayDisplay(cardData.birthday)}</span>
                    </div>}
                  {cardData.gender && cardData.genderVisible && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">性別: {getGenderDisplay(cardData.gender)}</span>
                    </div>}
                  {cardData.department && cardData.departmentVisible !== false && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">部門: {cardData.department}</span>
                    </div>}
                  {cardData.position && cardData.positionVisible !== false && <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">職位: {cardData.position}</span>
                    </div>}
                   {cardData.skills && cardData.skillsVisible !== false && <div className="flex items-center space-x-3">
                       <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                       <span className="truncate">專長: {cardData.skills}</span>
                     </div>}
                   {cardData.otherInfo && cardData.otherInfoVisible !== false && <div className="bg-white/10 p-2 rounded text-xs mt-3">
                       <span className="mr-2">📝</span>
                       <span>{cardData.otherInfo}</span>
                     </div>}
                </div>

                {/* 社群資訊 */}
                {(cardData.line && cardData.lineVisible !== false || 
                  cardData.facebook && cardData.facebookVisible !== false || 
                  cardData.instagram && cardData.instagramVisible !== false ||
                  cardData.youtube && cardData.youtubeVisible !== false ||
                  cardData.linkedin && cardData.linkedinVisible !== false ||
                  cardData.twitter && cardData.twitterVisible !== false ||
                  cardData.tiktok && cardData.tiktokVisible !== false ||
                  cardData.threads && cardData.threadsVisible !== false ||
                  cardData.wechat && cardData.wechatVisible !== false ||
                  cardData.whatsapp && cardData.whatsappVisible !== false ||
                  (cardData.socialMedia && cardData.socialMedia.some(item => item.visible))) &&
                <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-center flex-wrap gap-3 mb-4">
                      {cardData.line && cardData.lineVisible !== false && (
                        <a 
                          href={cardData.line} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {cardData.facebook && cardData.facebookVisible !== false && (
                        <a 
                          href={cardData.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Facebook className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {cardData.instagram && cardData.instagramVisible !== false && (
                        <a 
                          href={cardData.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Instagram className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {cardData.youtube && cardData.youtubeVisible !== false && (
                        <a 
                          href={cardData.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Youtube className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {cardData.linkedin && cardData.linkedinVisible !== false && (
                        <a 
                          href={cardData.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Linkedin className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {cardData.twitter && cardData.twitterVisible !== false && (
                        <a 
                          href={cardData.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <Twitter className="w-5 h-5 text-white" />
                        </a>
                      )}
                      {cardData.tiktok && cardData.tiktokVisible !== false && (
                        <a 
                          href={cardData.tiktok} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </a>
                      )}
                      {cardData.threads && cardData.threadsVisible !== false && (
                        <a 
                          href={cardData.threads} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.8 8.7c-.4-.8-1.1-1.4-2-1.7-1.1-.4-2.4-.3-3.5.1-.8.3-1.4.8-1.9 1.4-.3.4-.5.8-.6 1.3H6.2c.1-.8.4-1.5.8-2.2.6-1 1.4-1.8 2.4-2.3 1.4-.7 3.1-.8 4.6-.3 1.2.4 2.2 1.2 2.9 2.2.7 1 1 2.2.9 3.4v.1c0 1.1-.3 2.1-.8 3-.5.9-1.2 1.6-2.1 2.1-1.8.9-4 .9-5.8 0-.9-.5-1.6-1.2-2.1-2.1-.5-.9-.8-1.9-.8-3V8c0-2.2 1.8-4 4-4s4 1.8 4 4v3.2c0 .4-.1.8-.3 1.2-.2.4-.5.7-.9.9-.3.2-.7.3-1.1.3-.4 0-.8-.1-1.1-.3-.4-.2-.7-.5-.9-.9-.2-.4-.3-.8-.3-1.2V8h1.6v3.2c0 .2.1.4.2.5.1.1.3.2.5.2s.4-.1.5-.2c.1-.1.2-.3.2-.5V8c0-1.3-1.1-2.4-2.4-2.4S9.6 6.7 9.6 8v3.2c0 .8.2 1.5.6 2.2.4.7.9 1.2 1.6 1.6 1.3.7 2.9.7 4.2 0 .7-.4 1.2-.9 1.6-1.6.4-.7.6-1.4.6-2.2V8.7z"/>
                          </svg>
                        </a>
                      )}
                      {cardData.wechat && cardData.wechatVisible !== false && (
                        <div 
                          className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          title="WeChat"
                        >
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.5 9.5c0-4.1-3.6-7.5-8-7.5S2.5 5.4 2.5 9.5c0 2.4 1.2 4.5 3.1 5.8L4.5 17l2.4-1.2c.7.2 1.4.3 2.1.3.3 0 .6 0 .9-.1 0-.1 0-.2.1-.3 0-3.6 3-6.5 6.7-6.5.2 0 .5 0 .7.1.1-.2.1-.5.1-.8zM8.5 7.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-3 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm13.5 4c0-3.1-2.5-5.5-5.5-5.5S8 8.4 8 11.5s2.5 5.5 5.5 5.5c.5 0 1-.1 1.5-.2L17 18l-1-1.5c1.5-1 2.5-2.7 2.5-4.5zm-7.5-1c-.4 0-.8-.3-.8-.8s.3-.8.8-.8.8.3.8.8-.4.8-.8.8zm3 0c-.4 0-.8-.3-.8-.8s.3-.8.8-.8.8.3.8.8-.4.8-.8.8z"/>
                          </svg>
                        </div>
                      )}
                      {cardData.whatsapp && cardData.whatsappVisible !== false && (
                        <a 
                          href={`https://wa.me/${cardData.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                          </svg>
                        </a>
                      )}
                      
                      {/* 動態新增的社群媒體 */}
                      {cardData.socialMedia && cardData.socialMedia.filter(item => item.visible).map(item => (
                        <a 
                          key={item.id}
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                            item.platform === 'youtube' ? 'bg-red-600 hover:bg-red-700' :
                            item.platform === 'linkedin' ? 'bg-blue-700 hover:bg-blue-800' :
                            item.platform === 'threads' ? 'bg-gray-800 hover:bg-gray-900' :
                            'bg-gray-600 hover:bg-gray-700'
                          }`}
                        >
                          {item.platform === 'youtube' && <Youtube className="w-5 h-5 text-white" />}
                          {item.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-white" />}
                          {item.platform === 'threads' && (
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.8 8.7c-.4-.8-1.1-1.4-2-1.7-1.1-.4-2.4-.3-3.5.1-.8.3-1.4.8-1.9 1.4-.3.4-.5.8-.6 1.3H6.2c.1-.8.4-1.5.8-2.2.6-1 1.4-1.8 2.4-2.3 1.4-.7 3.1-.8 4.6-.3 1.2.4 2.2 1.2 2.9 2.2.7 1 1 2.2.9 3.4v.1c0 1.1-.3 2.1-.8 3-.5.9-1.2 1.6-2.1 2.1-1.8.9-4 .9-5.8 0-.9-.5-1.6-1.2-2.1-2.1-.5-.9-.8-1.9-.8-3V8c0-2.2 1.8-4 4-4s4 1.8 4 4v3.2c0 .4-.1.8-.3 1.2-.2.4-.5.7-.9.9-.3.2-.7.3-1.1.3-.4 0-.8-.1-1.1-.3-.4-.2-.7-.5-.9-.9-.2-.4-.3-.8-.3-1.2V8h1.6v3.2c0 .2.1.4.2.5.1.1.3.2.5.2s.4-.1.5-.2c.1-.1.2-.3.2-.5V8c0-1.3-1.1-2.4-2.4-2.4S9.6 6.7 9.6 8v3.2c0 .8.2 1.5.6 2.2.4.7.9 1.2 1.6 1.6 1.3.7 2.9.7 4.2 0 .7-.4 1.2-.9 1.6-1.6.4-.7.6-1.4.6-2.2V8.7z"/>
                            </svg>
                          )}
                          {!['youtube', 'linkedin', 'threads'].includes(item.platform) && <span className="text-white text-lg">🔗</span>}
                        </a>
                      ))}
                    </div>
                  </div>}

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


          
          </div>
        </div>}
    </div>;
};
export default MyCard;