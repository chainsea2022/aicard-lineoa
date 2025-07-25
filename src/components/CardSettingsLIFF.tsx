import React, { useState, useEffect } from 'react';
import { X, User, Settings, Eye, EyeOff, Save, Edit3, Smartphone, Mail, MapPin, Calendar, Globe, MessageCircle, Facebook, Instagram, Youtube, Linkedin, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { ProfileSettings } from '@/components/MyCustomers/ProfileSettings';

interface CardSettingsLIFFProps {
  onClose: () => void;
}

const CardSettingsLIFF: React.FC<CardSettingsLIFFProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>({
    name: '',
    jobTitle: '',
    companyName: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    introduction: '',
    line: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    twitter: '',
    tiktok: '',
    threads: '',
    wechat: '',
    whatsapp: '',
    photo: null,
    // 可見性設定
    nameVisible: true,
    jobTitleVisible: true,
    companyNameVisible: true,
    phoneVisible: true,
    emailVisible: true,
    websiteVisible: true,
    addressVisible: false,
    introductionVisible: true,
    lineVisible: true,
    facebookVisible: true,
    instagramVisible: true,
    youtubeVisible: true,
    linkedinVisible: true,
    twitterVisible: true,
    tiktokVisible: true,
    threadsVisible: true,
    wechatVisible: true,
    whatsappVisible: true
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // 載入現有名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    let cardInfo = {};
    
    if (savedCardData) {
      cardInfo = JSON.parse(savedCardData);
    } else {
      // 如果沒有現有資料，從其他來源初始化
      const registeredPhone = localStorage.getItem('registeredPhone');
      const lineProfile = localStorage.getItem('lineProfile');
      
      if (lineProfile) {
        const profile = JSON.parse(lineProfile);
        cardInfo = {
          ...cardInfo,
          name: profile.displayName || '', // 使用LINE顯示名稱作為預設姓名
        };
      }
      
      if (registeredPhone) {
        cardInfo = {
          ...cardInfo,
          phone: registeredPhone, // 使用已驗證的手機號碼
          phoneVerified: true
        };
      }
    }
    
    setCardData(cardInfo);

    // 監聽名片資料更新事件（包括手機驗證狀態更新）
    const handleCardDataUpdate = () => {
      console.log('CardSettingsLIFF: cardDataUpdated event received');
      const updatedCardData = localStorage.getItem('aile-card-data');
      if (updatedCardData) {
        const updatedInfo = JSON.parse(updatedCardData);
        console.log('CardSettingsLIFF: Updated data from localStorage:', updatedInfo);
        setCardData(prev => {
          const newData = {
            ...prev,
            // 只更新驗證相關的欄位，保留用戶正在編輯的內容
            phone: updatedInfo.phone || prev.phone,
            phoneVerified: updatedInfo.phoneVerified || false,
            email: updatedInfo.email || prev.email,
            emailVerified: updatedInfo.emailVerified || false,
            // 同步其他可能在ProfileSettings中更新的欄位
            gender: updatedInfo.gender || prev.gender,
            birthday: updatedInfo.birthday || prev.birthday
          };
          console.log('CardSettingsLIFF: Setting new cardData:', newData);
          return newData;
        });
      }
    };

    window.addEventListener('cardDataUpdated', handleCardDataUpdate);

    return () => {
      window.removeEventListener('cardDataUpdated', handleCardDataUpdate);
    };
  }, []);

  const handleSave = () => {
    console.log('handleSave called, cardData:', cardData);
    
    // 檢查是否有任何欄位有內容（不再要求所有必填欄位都要填寫）
    const hasAnyContent = Object.keys(cardData).some(key => {
      if (key.includes('Visible')) return false; // 排除可見性設定
      const value = cardData[key];
      return value && value.toString().trim() !== '';
    });
    
    if (!hasAnyContent) {
      toast({
        title: "請填寫至少一個欄位",
        description: "請至少填寫一個欄位內容後再進行儲存。",
        variant: "destructive"
      });
      return;
    }
    
    // 清除驗證錯誤
    setValidationErrors([]);
    
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    
    // 觸發自定義事件，通知其他組件資料已更新
    window.dispatchEvent(new CustomEvent('cardDataUpdated'));
    
    toast({
      title: "名片設定已儲存",
      description: "您的電子名片設定已成功更新。"
    });
  };

  const checkEmailVerification = (email: string) => {
    if (!email) return true;
    
    console.log('Checking email verification for:', email);
    
    // 檢查email是否已在ProfileSettings中驗證
    const cardData = localStorage.getItem('aile-card-data');
    console.log('Card data from localStorage:', cardData);
    
    if (cardData) {
      const data = JSON.parse(cardData);
      console.log('Parsed card data:', data);
      console.log('Email match:', data.email === email);
      console.log('Email verified:', data.emailVerified);
      
      if (data.email === email && data.emailVerified) {
        return true;
      }
    }
    console.log('Email verification check failed');
    return false;
  };

  const checkPhoneVerification = (phone: string) => {
    if (!phone) return true;
    
    // 檢查手機號碼是否已在ProfileSettings中驗證
    const cardData = localStorage.getItem('aile-card-data');
    if (cardData) {
      const data = JSON.parse(cardData);
      if (data.phone === phone && data.phoneVerified) {
        return true;
      }
    }
    return false;
  };

  const handleInputChange = (field: string, value: any) => {
    console.log('Input change:', field, value);
    
    setCardData((prev: any) => ({
      ...prev,
      [field]: value
    }));

    // Email輸入不自動觸發彈跳視窗，由用戶主動點擊驗證
    // 移除自動驗證提示邏輯
  };

  const handleVisibilityChange = (field: string, visible: boolean) => {
    setCardData((prev: any) => ({
      ...prev,
      [`${field}Visible`]: visible
    }));
  };

  const handleProfileSettingsClose = () => {
    setShowProfileSettings(false);
    // 重新檢查email驗證狀態
    if (cardData.email) {
      const isVerified = checkEmailVerification(cardData.email);
      if (isVerified) {
        toast({
          title: "驗證完成",
          description: "Email驗證已完成，可以繼續編輯名片",
          duration: 3000,
        });
      }
    }
  };

  // 如果顯示ProfileSettings，渲染ProfileSettings組件並聚焦到email驗證
  if (showProfileSettings) {
    return <ProfileSettings onClose={handleProfileSettingsClose} focusEmail={true} />;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">設置電子名片</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            基本資料
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'privacy'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            隱私設定
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 基本資料 Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* 照片設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2" />
                  個人照片
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    {cardData.photo && <AvatarImage src={cardData.photo} alt="照片" />}
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {cardData.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      更換照片
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">建議使用正方形照片</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 基本資訊 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Edit3 className="w-5 h-5 mr-2" />
                  基本資訊
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="name">姓名 *</Label>
                   <Input
                     id="name"
                     value={cardData.name || ''}
                     onChange={(e) => handleInputChange('name', e.target.value)}
                     placeholder="請輸入您的姓名"
                     className={validationErrors.includes('name') ? 'border-red-500 focus:border-red-500' : ''}
                   />
                 </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">職稱</Label>
                  <Input
                    id="jobTitle"
                    value={cardData.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="請輸入您的職稱"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">公司名稱</Label>
                  <Input
                    id="companyName"
                    value={cardData.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="請輸入公司名稱"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="introduction">個人介紹</Label>
                  <Textarea
                    id="introduction"
                    value={cardData.introduction || ''}
                    onChange={(e) => handleInputChange('introduction', e.target.value)}
                    placeholder="簡單介紹您自己或您的專業領域"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 聯絡資訊 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Smartphone className="w-5 h-5 mr-2" />
                  聯絡資訊
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="phone">電話號碼 *</Label>
                   <div className="relative">
                     <Input
                       id="phone"
                       value={cardData.phone || ''}
                       onChange={(e) => handleInputChange('phone', e.target.value)}
                       placeholder="請輸入電話號碼"
                       className={validationErrors.includes('phone') ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
                     />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      {cardData.phone && (
                        checkPhoneVerification(cardData.phone) ? (
                          <div className="flex items-center text-green-600" title="已驗證">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowProfileSettings(true)}
                            className="flex items-center text-orange-600 hover:text-orange-700"
                            title="點擊驗證"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  {cardData.phone && !checkPhoneVerification(cardData.phone) && (
                    <p className="text-xs text-orange-600">
                      <button
                        type="button"
                        onClick={() => setShowProfileSettings(true)}
                        className="underline hover:no-underline"
                      >
                        請至「資料設定」完成驗證
                      </button>
                    </p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label htmlFor="email">Email *</Label>
                   <div className="relative">
                     <Input
                       id="email"
                       type="email"
                       value={cardData.email || ''}
                       onChange={(e) => handleInputChange('email', e.target.value)}
                       placeholder="請輸入Email地址"
                       className={validationErrors.includes('email') ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
                     />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      {cardData.email && (
                        checkEmailVerification(cardData.email) ? (
                          <div className="flex items-center text-green-600" title="已驗證">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowProfileSettings(true)}
                            className="flex items-center text-orange-600 hover:text-orange-700"
                            title="點擊驗證"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  {cardData.email && !checkEmailVerification(cardData.email) && (
                    <p className="text-xs text-orange-600">
                      <button
                        type="button"
                        onClick={() => setShowProfileSettings(true)}
                        className="underline hover:no-underline"
                      >
                        請至「資料設定」完成驗證
                      </button>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">網站</Label>
                  <Input
                    id="website"
                    value={cardData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="請輸入網站網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">地址</Label>
                  <Input
                    id="address"
                    value={cardData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="請輸入地址"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 社群媒體 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  社群媒體
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="line">LINE ID</Label>
                  <Input
                    id="line"
                    value={cardData.line || ''}
                    onChange={(e) => handleInputChange('line', e.target.value)}
                    placeholder="請輸入LINE ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={cardData.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="請輸入Facebook網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={cardData.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="請輸入Instagram網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={cardData.youtube || ''}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    placeholder="請輸入YouTube頻道網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={cardData.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="請輸入LinkedIn個人檔案網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    value={cardData.twitter || ''}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="請輸入Twitter/X網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={cardData.tiktok || ''}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    placeholder="請輸入TikTok網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threads">Threads</Label>
                  <Input
                    id="threads"
                    value={cardData.threads || ''}
                    onChange={(e) => handleInputChange('threads', e.target.value)}
                    placeholder="請輸入Threads網址"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wechat">WeChat</Label>
                  <Input
                    id="wechat"
                    value={cardData.wechat || ''}
                    onChange={(e) => handleInputChange('wechat', e.target.value)}
                    placeholder="請輸入微信號"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={cardData.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="請輸入WhatsApp號碼"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 隱私設定 Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Eye className="w-5 h-5 mr-2" />
                  欄位可見性設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  選擇在名片上要顯示的資訊欄位
                </p>

                <div className="space-y-3">
                  {[
                    { key: 'name', label: '姓名', value: cardData.name },
                    { key: 'jobTitle', label: '職稱', value: cardData.jobTitle },
                    { key: 'companyName', label: '公司名稱', value: cardData.companyName },
                    { key: 'phone', label: '電話號碼', value: cardData.phone },
                    { key: 'email', label: 'Email', value: cardData.email },
                    { key: 'website', label: '網站', value: cardData.website },
                    { key: 'address', label: '地址', value: cardData.address },
                    { key: 'introduction', label: '個人介紹', value: cardData.introduction },
                    { key: 'line', label: 'LINE', value: cardData.line },
                    { key: 'facebook', label: 'Facebook', value: cardData.facebook },
                    { key: 'instagram', label: 'Instagram', value: cardData.instagram },
                    { key: 'youtube', label: 'YouTube', value: cardData.youtube },
                    { key: 'linkedin', label: 'LinkedIn', value: cardData.linkedin },
                    { key: 'twitter', label: 'Twitter/X', value: cardData.twitter },
                    { key: 'tiktok', label: 'TikTok', value: cardData.tiktok },
                    { key: 'threads', label: 'Threads', value: cardData.threads },
                    { key: 'wechat', label: 'WeChat', value: cardData.wechat },
                    { key: 'whatsapp', label: 'WhatsApp', value: cardData.whatsapp }
                  ].map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{field.label}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {field.value || '未設定'}
                        </p>
                      </div>
                      <Switch
                        checked={cardData[`${field.key}Visible`] !== false}
                        onCheckedChange={(checked) => handleVisibilityChange(field.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 儲存按鈕 */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 -mx-6 -mb-6">
          <Button
            onClick={() => {
              console.log('Button clicked!');
              handleSave();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3"
          >
            <Save className="w-5 h-5 mr-2" />
            儲存設定
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardSettingsLIFF;