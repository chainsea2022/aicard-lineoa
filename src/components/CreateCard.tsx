import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Info, ChevronDown, ChevronUp, EyeOff, Edit, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import CardPreview from './CardPreview';
import Points from './Points';
import PointsWidget from './PointsWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete?: () => void;
  userData?: any;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose, onRegistrationComplete, userData }) => {
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [line, setLine] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLineInstructions, setShowLineInstructions] = useState(false);

  // 公開設置狀態
  const [fieldVisibility, setFieldVisibility] = useState({
    companyName: true,
    name: true,
    jobTitle: true,
    phone: true,
    email: true,
    website: true,
    address: true,
    birthday: true,
    line: true,
    facebook: true,
    instagram: true,
    photo: true
  });

  // 在組件載入時檢查是否有現有的名片資料
  useEffect(() => {
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardData = JSON.parse(savedCardData);
      setCompanyName(cardData.companyName || '');
      setName(cardData.name || '');
      setJobTitle(cardData.jobTitle || '');
      setPhone(cardData.phone || '');
      setEmail(cardData.email || '');
      setWebsite(cardData.website || '');
      setLine(cardData.line || '');
      setFacebook(cardData.facebook || '');
      setInstagram(cardData.instagram || '');
      setPhoto(cardData.photo || null);
      setIsEditing(true);
    }
  }, []);

  // 根據登入方式自動填入資料
  useEffect(() => {
    if (userData && !isEditing) {
      if (userData.phone) {
        setPhone(userData.phone);
      }
      if (userData.lineId) {
        setLine(userData.lineId);
      }
      if (userData.displayName) {
        setName(userData.displayName);
      }
      if (userData.pictureUrl) {
        setPhoto(userData.pictureUrl);
      }
    }
  }, [userData, isEditing]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFieldVisibility = (field: keyof typeof fieldVisibility) => {
    setFieldVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 根據公開設置過濾名片資料
  const getFilteredCardData = () => {
    return {
      companyName: fieldVisibility.companyName ? companyName : '',
      name: fieldVisibility.name ? name : '',
      jobTitle: fieldVisibility.jobTitle ? jobTitle : '',
      phone: fieldVisibility.phone ? phone : '',
      email: fieldVisibility.email ? email : '',
      website: fieldVisibility.website ? website : '',
      address: fieldVisibility.address ? address : '',
      birthday: fieldVisibility.birthday ? birthday : '',
      line: fieldVisibility.line ? line : '',
      facebook: fieldVisibility.facebook ? facebook : '',
      instagram: fieldVisibility.instagram ? instagram : '',
      photo: fieldVisibility.photo ? photo : null
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 必填欄位驗證
    if (!name.trim()) {
      toast({
        title: "請輸入姓名",
        description: "姓名為必填欄位",
        variant: "destructive"
      });
      return;
    }

    if (!phone.trim()) {
      toast({
        title: "請輸入手機號碼",
        description: "手機號碼為必填欄位",
        variant: "destructive"
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "請輸入電子信箱",
        description: "電子信箱為必填欄位",
        variant: "destructive"
      });
      return;
    }

    const cardData = {
      companyName,
      name,
      jobTitle,
      phone,
      email,
      website,
      address,
      birthday,
      line,
      facebook,
      instagram,
      photo
    };

    // Save to localStorage
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    localStorage.setItem('aile-field-visibility', JSON.stringify(fieldVisibility));
    
    // Award registration points if this is first time registration
    if (!isEditing) {
      const existingPoints = localStorage.getItem('aile-user-points');
      if (!existingPoints) {
        const registrationTransaction = {
          id: Date.now(),
          type: 'earn',
          points: 100,
          description: '註冊電子名片',
          date: new Date()
        };
        
        localStorage.setItem('aile-user-points', '100');
        localStorage.setItem('aile-points-history', JSON.stringify([registrationTransaction]));
      }
    }
    
    toast({
      title: isEditing ? "電子名片更新成功！" : "電子名片建立成功！",
      description: isEditing ? "您的名片已經更新完成" : "您的名片已經建立完成，獲得 100 點數獎勵！",
    });

    // 不自動顯示預覽，直接完成操作
    if (onRegistrationComplete) {
      onRegistrationComplete();
    } else {
      onClose();
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    if (onRegistrationComplete) {
      onRegistrationComplete();
    } else {
      onClose();
    }
  };

  if (showPoints) {
    return <Points onClose={() => setShowPoints(false)} />;
  }

  if (showPreview) {
    return (
      <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-lg">名片預覽</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviewClose}
              className="text-white hover:bg-white/20"
            >
              完成
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* 名片預覽 - 使用與 MyCard 相同的格式 */}
          <Card className="mb-6 shadow-xl border-2 border-green-200">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  {getFilteredCardData().photo && (
                    <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                      <AvatarImage src={getFilteredCardData().photo} alt="照片" />
                      <AvatarFallback className="bg-white text-green-600 font-bold text-xl">
                        {getFilteredCardData().name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{getFilteredCardData().name}</h2>
                    {getFilteredCardData().jobTitle && (
                      <p className="text-green-100 text-sm mb-1">{getFilteredCardData().jobTitle}</p>
                    )}
                    {getFilteredCardData().companyName && (
                      <p className="text-green-100 text-lg">{getFilteredCardData().companyName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {getFilteredCardData().phone && (
                    <div className="flex items-center">
                      <span className="mr-2">📱</span>
                      <span>{getFilteredCardData().phone}</span>
                    </div>
                  )}
                  {getFilteredCardData().email && (
                    <div className="flex items-center">
                      <span className="mr-2">✉️</span>
                      <span>{getFilteredCardData().email}</span>
                    </div>
                  )}
                  {getFilteredCardData().website && (
                    <div className="flex items-center">
                      <span className="mr-2">🌐</span>
                      <span>{getFilteredCardData().website}</span>
                    </div>
                  )}
                  {getFilteredCardData().address && (
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{getFilteredCardData().address}</span>
                    </div>
                  )}
                  {getFilteredCardData().birthday && (
                    <div className="flex items-center">
                      <span className="mr-2">🎂</span>
                      <span>{new Date(getFilteredCardData().birthday).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* 社群資訊 */}
                {(getFilteredCardData().line || getFilteredCardData().facebook || getFilteredCardData().instagram) && (
                  <div className="mt-4 pt-4 border-t border-green-300/50">
                    <div className="flex flex-wrap gap-3">
                      {getFilteredCardData().line && (
                        <button
                          onClick={() => window.open(getFilteredCardData().line, '_blank')}
                          className="flex items-center text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors cursor-pointer"
                        >
                          <span className="mr-1">💬</span>
                          <span>加入 LINE</span>
                        </button>
                      )}
                      {getFilteredCardData().facebook && (
                        <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                          <span className="mr-1">📘</span>
                          <span>FB: {getFilteredCardData().facebook}</span>
                        </div>
                      )}
                      {getFilteredCardData().instagram && (
                        <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                          <span className="mr-1">📷</span>
                          <span>IG: {getFilteredCardData().instagram}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 操作按鈕 */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowPreview(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Edit className="w-4 h-4 mr-1" />
              返回編輯
            </Button>

            <Button
              onClick={handlePreviewClose}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              完成
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">
              {isEditing ? '編輯電子名片' : '建立電子名片'}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="text-white hover:bg-white/20"
          >
            <Eye className="w-4 h-4 mr-1" />
            預覽
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        {/* Points Widget */}
        <PointsWidget onPointsClick={() => setShowPoints(true)} />

        {/* 登入資訊提示 */}
        {userData && !isEditing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {userData.loginMethod === 'line' 
                ? `✅ 已使用 LINE 登入，LINE ID 已自動填入`
                : `✅ 已使用手機號碼登入，手機號碼已自動填入`
              }
            </p>
          </div>
        )}

        {/* 編輯模式提示 */}
        {isEditing && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              📝 正在編輯您的電子名片，修改後請點擊儲存
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 上傳照片 - 移到最上方 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="photo">上傳照片</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.photo}
                  onCheckedChange={() => toggleFieldVisibility('photo')}
                />
                {fieldVisibility.photo ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photo && (
              <img
                src={photo}
                alt="預覽"
                className="mt-2 rounded-md w-32 h-32 object-cover border"
              />
            )}
            {userData?.pictureUrl && photo === userData.pictureUrl && !isEditing && (
              <p className="text-xs text-gray-500 mt-1">已從 LINE 登入資訊自動填入頭像</p>
            )}
          </div>

          {/* 公司名稱 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="companyName">公司名稱</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.companyName}
                  onCheckedChange={() => toggleFieldVisibility('companyName')}
                />
                {fieldVisibility.companyName ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="請輸入公司名稱"
            />
          </div>
          
          {/* 姓名 - 必填 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">姓名 *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.name}
                  onCheckedChange={() => toggleFieldVisibility('name')}
                />
                {fieldVisibility.name ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              required
            />
          </div>

          {/* 職稱 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="jobTitle">職稱</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.jobTitle}
                  onCheckedChange={() => toggleFieldVisibility('jobTitle')}
                />
                {fieldVisibility.jobTitle ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="請輸入職稱"
            />
          </div>
          
          {/* 手機號碼 - 必填 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone">手機號碼 *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.phone}
                  onCheckedChange={() => toggleFieldVisibility('phone')}
                />
                {fieldVisibility.phone ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="請輸入手機號碼"
              required
              readOnly={!!(userData?.phone && !isEditing)}
              className={userData?.phone && !isEditing ? 'bg-gray-100' : ''}
            />
            {userData?.phone && !isEditing && (
              <p className="text-xs text-gray-500 mt-1">已從登入資訊自動填入</p>
            )}
          </div>
          
          {/* 電子信箱 - 必填 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">電子信箱 *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.email}
                  onCheckedChange={() => toggleFieldVisibility('email')}
                />
                {fieldVisibility.email ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入電子信箱"
              required
            />
          </div>
          
          {/* 公司官網 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="website">公司官網</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.website}
                  onCheckedChange={() => toggleFieldVisibility('website')}
                />
                {fieldVisibility.website ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="請輸入公司官網"
            />
          </div>

          {/* 地址欄位 - 新增 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address">地址</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.address}
                  onCheckedChange={() => toggleFieldVisibility('address')}
                />
                {fieldVisibility.address ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="請輸入地址"
            />
          </div>

          {/* 生日欄位 - 新增 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="birthday">生日 (只顯示月日)</Label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">公開</span>
                <Switch
                  checked={fieldVisibility.birthday}
                  onCheckedChange={() => toggleFieldVisibility('birthday')}
                />
                {fieldVisibility.birthday ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              placeholder="請選擇生日"
            />
            <p className="text-xs text-gray-500">預覽時只會顯示月份和日期，不會顯示年份</p>
          </div>

          {/* 社群設置區塊 */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-800 mb-3">社群設置</h3>
            <div className="space-y-3">
              {/* LINE ID with instructions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="line">LINE 個人帳號網址</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLineInstructions(!showLineInstructions)}
                      className="p-1 h-6 w-6"
                    >
                      <Info className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">公開</span>
                    <Switch
                      checked={fieldVisibility.line}
                      onCheckedChange={() => toggleFieldVisibility('line')}
                    />
                    {fieldVisibility.line ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <Input
                  type="text"
                  id="line"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  placeholder="請輸入LINE個人帳號網址"
                  readOnly={!!(userData?.lineId && !isEditing)}
                  className={userData?.lineId && !isEditing ? 'bg-gray-100' : ''}
                />
                {userData?.lineId && !isEditing && (
                  <p className="text-xs text-gray-500 mt-1">已從 LINE 登入資訊自動填入</p>
                )}
                
                {/* LINE Instructions Collapsible */}
                <Collapsible open={showLineInstructions} onOpenChange={setShowLineInstructions}>
                  <CollapsibleContent className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="text-sm text-blue-800">
                      <h4 className="font-medium mb-2">📱 如何取得LINE個人帳號網址：</h4>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-blue-900 mb-1">🍎 iOS用戶：</h5>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700 ml-2">
                          <li>進入LINE主頁</li>
                          <li>點選「加入好友」</li>
                          <li>選擇「透過社群/郵件等方式宣傳帳號」</li>
                          <li>選擇「網址」</li>
                          <li>複製網址URL</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-blue-900 mb-1">🤖 Android用戶：</h5>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700 ml-2">
                          <li>進入LINE主頁</li>
                          <li>點右上角「人像＋」圖示</li>
                          <li>點「行動條碼」</li>
                          <li>選擇「顯示行動條碼」</li>
                          <li>選擇一位朋友分享</li>
                          <li>進入對話視窗即可看到專屬連結和QR Code</li>
                        </ol>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Facebook */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">公開</span>
                    <Switch
                      checked={fieldVisibility.facebook}
                      onCheckedChange={() => toggleFieldVisibility('facebook')}
                    />
                    {fieldVisibility.facebook ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <Input
                  type="text"
                  id="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="請輸入Facebook帳號或網址"
                />
              </div>
              
              {/* Instagram */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">公開</span>
                    <Switch
                      checked={fieldVisibility.instagram}
                      onCheckedChange={() => toggleFieldVisibility('instagram')}
                    />
                    {fieldVisibility.instagram ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <Input
                  type="text"
                  id="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="請輸入Instagram帳號"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              預覽名片
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isEditing ? '儲存修改' : '建立名片'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;
