import React, { useState } from 'react';
import { ArrowLeft, X, Download, Share2, UserPlus, QrCode, Phone, Mail, Globe, MapPin, MessageCircle, Facebook, Instagram, Youtube, Linkedin, Calendar, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface FullCardLIFFProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: any;
}

export const FullCardLIFF: React.FC<FullCardLIFFProps> = ({
  isOpen,
  onClose,
  cardData
}) => {
  const [showQRCode, setShowQRCode] = useState(false);

  if (!isOpen || !cardData) return null;

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

  const handleAddToContacts = () => {
    toast({
      title: "已加入名片好友",
      description: "此名片已加入您的名片夾"
    });
  };

  const handleSaveCard = () => {
    toast({
      title: "名片已儲存",
      description: "聯絡資訊已儲存到電話簿，電子名片PNG檔已下載"
    });
  };

  const handleShare = () => {
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
        description: "名片資訊已複製，可以分享到聊天室或社群"
      });
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

  const qrCodeData = `名片資訊
姓名: ${cardData.name || ''}
${cardData.jobTitle ? `職稱: ${cardData.jobTitle}` : ''}
公司: ${cardData.companyName || ''}
電話: ${cardData.phone || ''}
Email: ${cardData.email || ''}
${cardData.address ? `地址: ${cardData.address}` : ''}
LINE: ${cardData.line || ''}
網站: ${cardData.website || ''}`;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LIFF style */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-bold text-lg">電子名片</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* 完整名片預覽 - 使用與 CardPreview 相同的樣式 */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* 頭部資訊 */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center space-x-4">
              {cardData.photo && (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <img src={cardData.photo} alt="頭像" className="w-18 h-18 rounded-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                {cardData.companyName && cardData.companyNameVisible !== false && (
                  <p className="text-blue-100 text-sm">{cardData.companyName}</p>
                )}
                <h3 className="text-white text-xl font-semibold mb-1">
                  {(cardData.name && cardData.nameVisible !== false) ? cardData.name : '您的姓名'}
                </h3>
                {cardData.jobTitle && cardData.jobTitleVisible !== false && (
                  <p className="text-blue-100 text-sm">{cardData.jobTitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* 聯絡資訊 */}
          <div className="p-6 space-y-4">
            {/* 電話 */}
            {((cardData.phone && cardData.phoneVisible !== false) || (cardData.mobilePhone && cardData.mobilePhoneVisible !== false)) && (
              <div>
                {cardData.mobilePhone && cardData.mobilePhoneVisible !== false && (
                  <div className="flex items-center space-x-3 mb-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">手機</p>
                      <p className="text-base text-gray-800">{cardData.mobilePhone}</p>
                    </div>
                  </div>
                )}
                {cardData.phone && cardData.phoneVisible !== false && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">公司電話</p>
                      <p className="text-base text-gray-800">{cardData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            {cardData.email && cardData.emailVisible !== false && (
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-base text-gray-800">{cardData.email}</p>
                </div>
              </div>
            )}

            {/* 網站 */}
            {cardData.website && cardData.websiteVisible !== false && (
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">網站</p>
                  <p className="text-base text-gray-800">{cardData.website}</p>
                </div>
              </div>
            )}

            {/* 地址 */}
            {cardData.address && cardData.addressVisible && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">地址</p>
                  <p className="text-base text-gray-800">{cardData.address}</p>
                </div>
              </div>
            )}

            {/* 生日 */}
            {cardData.birthday && cardData.birthdayVisible && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">生日</p>
                  <p className="text-base text-gray-800">{formatBirthdayDisplay(cardData.birthday)}</p>
                </div>
              </div>
            )}

            {/* 性別 */}
            {cardData.gender && cardData.genderVisible && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-gray-600">👤</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">性別</p>
                  <p className="text-base text-gray-800">{getGenderDisplay(cardData.gender)}</p>
                </div>
              </div>
            )}

            {/* 自我介紹 */}
            {cardData.introduction && cardData.introductionVisible !== false && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">自我介紹</p>
                    <p className="text-base text-gray-800">{cardData.introduction}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 其他資訊 */}
            {cardData.otherInfo && cardData.otherInfoVisible !== false && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 text-gray-600 mt-0.5">📋</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">其他資訊</p>
                    <p className="text-base text-gray-800">{cardData.otherInfo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 社群媒體與操作區域 */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            {/* 社群媒體符號 */}
            {(cardData.line || cardData.facebook || cardData.instagram || (cardData.socialMedia && cardData.socialMedia.length > 0)) && (
              <div className="flex justify-center flex-wrap gap-4 mb-6">
                {cardData.line && cardData.lineVisible !== false && (
                  <a 
                    href={cardData.line} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-md"
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </a>
                )}
                {cardData.facebook && cardData.facebookVisible !== false && (
                  <a 
                    href={cardData.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-md"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                )}
                {cardData.instagram && cardData.instagramVisible !== false && (
                  <a 
                    href={cardData.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors shadow-md"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                
                {/* 其他社群媒體 */}
                {cardData.socialMedia && cardData.socialMedia.filter((item: any) => item.visible).map((social: any) => (
                  <a 
                    key={social.id}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md ${
                      social.platform === 'YouTube' ? 'bg-red-600 hover:bg-red-700' :
                      social.platform === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800' :
                      social.platform === 'Threads' ? 'bg-gray-800 hover:bg-gray-900' :
                      'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {social.platform === 'YouTube' && <Youtube className="w-5 h-5 text-white" />}
                    {social.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-white" />}
                    {social.platform === 'Threads' && <span className="text-white text-lg">🧵</span>}
                    {!['YouTube', 'LinkedIn', 'Threads'].includes(social.platform) && <span className="text-white text-lg">🔗</span>}
                  </a>
                ))}
              </div>
            )}

            {/* QR Code 區塊 */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setShowQRCode(!showQRCode)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <QrCode className="w-5 h-5 mr-3" />
                  <span className="font-semibold text-gray-800">我的名片 QR Code</span>
                </div>
                {showQRCode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              
              {showQRCode && (
                <div className="mt-4 text-center">
                  <div className="flex justify-center mb-4">
                    {generateQRCode(qrCodeData)}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    掃描此QR Code即可獲得我的聯絡資訊
                  </p>
                </div>
              )}
            </div>

            {/* 操作按鈕 */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={handleAddToContacts}
                className="bg-green-500 hover:bg-green-600 text-white py-3 flex items-center justify-center space-x-1"
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-xs">加入好友</span>
              </Button>

              <Button
                onClick={handleSaveCard}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 flex items-center justify-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span className="text-xs">儲存名片</span>
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                className="py-3 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-1"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs">分享名片</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};