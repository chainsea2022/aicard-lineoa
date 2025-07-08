
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
    email: string;
    website: string;
    address?: string;
    addressVisible?: boolean;
    birthday?: string;
    birthdayVisible?: boolean;
    gender?: string;
    genderVisible?: boolean;
    line: string;
    facebook: string;
    instagram: string;
    photo: string | null;
    cardPublic?: boolean;
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
${cardData.jobTitle ? `職稱: ${cardData.jobTitle}` : ''}
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
        {/* 名片預覽 */}
        <Card className="mb-6 shadow-xl border-2 border-green-200">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-4">
                {cardData.photo && (
                  <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                    <AvatarImage src={cardData.photo} alt="照片" />
                    <AvatarFallback className="bg-white text-green-600 font-bold text-xl">
                      {cardData.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{cardData.name}</h2>
                  {cardData.jobTitle && (
                    <p className="text-green-100 text-sm mb-1">{cardData.jobTitle}</p>
                  )}
                  {cardData.companyName && (
                    <p className="text-green-100 text-lg">{cardData.companyName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {cardData.phone && (
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <span>{cardData.phone}</span>
                  </div>
                )}
                {cardData.email && (
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>{cardData.email}</span>
                  </div>
                )}
                {cardData.website && (
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <span>{cardData.website}</span>
                  </div>
                )}
                {cardData.address && cardData.addressVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{cardData.address}</span>
                  </div>
                )}
                {cardData.birthday && cardData.birthdayVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">🎂</span>
                    <span>{formatBirthdayDisplay(cardData.birthday)}</span>
                  </div>
                )}
                {cardData.gender && cardData.genderVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">👤</span>
                    <span>{getGenderDisplay(cardData.gender)}</span>
                  </div>
                )}
              </div>

              {/* 社群資訊 */}
              {(cardData.line || cardData.facebook || cardData.instagram) && (
                <div className="mt-4 pt-4 border-t border-green-300/50">
                  <div className="flex flex-wrap gap-3">
                    {cardData.line && (
                      <button
                        onClick={() => handleLineClick(cardData.line)}
                        className="flex items-center text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        <span className="mr-1">💬</span>
                        <span>加入 LINE</span>
                      </button>
                    )}
                    {cardData.facebook && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📘</span>
                        <span>FB: {cardData.facebook}</span>
                      </div>
                    )}
                    {cardData.instagram && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📷</span>
                        <span>IG: {cardData.instagram}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* QR Code 區塊 - 移到名片內部 */}
            <div className="p-4 bg-white border-t">
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
            </div>
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
