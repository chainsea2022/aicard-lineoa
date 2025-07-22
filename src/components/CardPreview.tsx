
import React, { useState } from 'react';
import { ArrowLeft, Edit, Share2, Download, QrCode, ChevronUp, ChevronDown, Eye, EyeOff, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CardPreviewProps {
  cardData: {
    companyName: string;
    name: string;
    jobTitle?: string;
    phone: string;
    mobilePhone?: string;
    email: string;
    website: string;
    address?: string;
    addressVisible?: boolean;
    birthday?: string;
    birthdayVisible?: boolean;
    gender?: string;
    genderVisible?: boolean;
    introduction?: string;
    introductionVisible?: boolean;
    otherInfo?: string;
    otherInfoVisible?: boolean;
    line: string;
    facebook: string;
    instagram: string;
    socialMedia?: Array<{id: string, platform: string, url: string, visible: boolean}>;
    photo: string | null;
    cardPublic?: boolean;
    nameVisible?: boolean;
    companyNameVisible?: boolean;
    jobTitleVisible?: boolean;
    phoneVisible?: boolean;
    mobilePhoneVisible?: boolean;
    emailVisible?: boolean;
    websiteVisible?: boolean;
    lineVisible?: boolean;
    facebookVisible?: boolean;
    instagramVisible?: boolean;
  };
  onClose: () => void;
  onEdit: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData, onClose, onEdit }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPublicSettings, setShowPublicSettings] = useState(false);
  const [publicSettings, setPublicSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: true,
    receiveNotifications: true
  });

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setPublicSettings({
        isPublicProfile: settings.isPublicProfile ?? false,
        allowDirectContact: settings.allowDirectContact ?? true,
        receiveNotifications: settings.receiveNotifications ?? true
      });
    }
  }, []);

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = {
      ...publicSettings,
      [key]: value
    };
    setPublicSettings(newSettings);
    localStorage.setItem('aile-profile-settings', JSON.stringify(newSettings));
    toast({
      title: "設定已儲存",
      description: "您的電子名片設定已更新。"
    });
  };

  const formatBirthdayDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male': return '男性';
      case 'female': return '女性';
      case 'other': return '其他';
      default: return gender;
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
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${cardData.name}的電子名片 - ${cardData.companyName}`);
      toast({
        title: "已複製到剪貼板",
        description: "名片資訊已複製，可以分享給朋友。"
      });
    }
  };

  const qrCodeData = `名片資訊
姓名: ${cardData.name || ''}
${cardData.jobTitle && cardData.jobTitleVisible !== false ? `職稱: ${cardData.jobTitle}` : ''}
公司: ${cardData.companyName || ''}
電話: ${cardData.phone || ''}
Email: ${cardData.email || ''}
${cardData.address && cardData.addressVisible ? `地址: ${cardData.address}` : ''}
${cardData.birthday && cardData.birthdayVisible ? `生日: ${formatBirthdayDisplay(cardData.birthday)}` : ''}
${cardData.gender && cardData.genderVisible ? `性別: ${getGenderDisplay(cardData.gender)}` : ''}
LINE: ${cardData.line || ''}
網站: ${cardData.website || ''}`;

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">名片預覽</h1>
        </div>
      </div>

      <div className="p-6">
        {/* 名片預覽 - 使用與 Flex Message 相同的樣式 */}
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
            {(cardData.line || cardData.facebook || cardData.instagram || (cardData.socialMedia && cardData.socialMedia.length > 0)) && (
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
                
                {/* 其他社群媒體 */}
                {cardData.socialMedia && cardData.socialMedia.filter(item => item.visible).map((social) => (
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
                    {social.platform === 'YouTube' && <span className="text-white text-lg">🎥</span>}
                    {social.platform === 'LinkedIn' && <span className="text-white text-lg">💼</span>}
                    {social.platform === 'Threads' && <span className="text-white text-lg">🧵</span>}
                    {!['YouTube', 'LinkedIn', 'Threads'].includes(social.platform) && <span className="text-white text-lg">🔗</span>}
                  </a>
                ))}
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

        {/* 操作按鈕 - 移到公開設定上方 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Edit className="w-4 h-4 mr-1" />
            編輯名片
          </Button>

          <Button
            onClick={downloadCard}
            variant="outline"
            className="border-gray-500 text-gray-600 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-1" />
            下載名片
          </Button>

          <Button
            onClick={shareCard}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Share2 className="w-4 h-4 mr-1" />
            分享名片
          </Button>
        </div>

        {/* 公開設定區塊 - 可折疊且預設縮合 */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={() => setShowPublicSettings(!showPublicSettings)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span className="font-semibold text-gray-800">公開設定</span>
              </div>
              {showPublicSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showPublicSettings && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">公開電子名片</Label>
                    <p className="text-xs text-gray-600">
                      開啟後，其他人可以在智能推薦中找到您的名片
                    </p>
                  </div>
                  <Switch
                    checked={publicSettings.isPublicProfile}
                    onCheckedChange={(checked) => handleSettingChange('isPublicProfile', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">允許直接聯繫</Label>
                    <p className="text-xs text-gray-600">
                      關閉後，需要您同意才能與您聯繫
                    </p>
                  </div>
                  <Switch
                    checked={publicSettings.allowDirectContact}
                    onCheckedChange={(checked) => handleSettingChange('allowDirectContact', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">接收通知</Label>
                    <p className="text-xs text-gray-600">
                      當有人加入您的名片時接收通知
                    </p>
                  </div>
                  <Switch
                    checked={publicSettings.receiveNotifications}
                    onCheckedChange={(checked) => handleSettingChange('receiveNotifications', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardPreview;
