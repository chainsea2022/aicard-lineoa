
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Eye, EyeOff, Info, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete: () => void;
  userData: any;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose, onRegistrationComplete, userData }) => {
  // Personal Info States
  const [gender, setGender] = useState('');
  const [genderVisible, setGenderVisible] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [registeredPhone, setRegisteredPhone] = useState(userData?.phone || '');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Business Card Settings States
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [addressVisible, setAddressVisible] = useState(true);
  const [line, setLine] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardPublic, setCardPublic] = useState(false);

  // UI States
  const [showPreview, setShowPreview] = useState(false);
  const [showLineTutorial, setShowLineTutorial] = useState(false);

  useEffect(() => {
    // 從 localStorage 載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setName(cardInfo.name || '');
      setCompanyName(cardInfo.companyName || '');
      setJobTitle(cardInfo.jobTitle || '');
      setPhone(cardInfo.phone || userData?.phone || '');
      setEmail(cardInfo.email || '');
      setWebsite(cardInfo.website || '');
      setAddress(cardInfo.address || '');
      setAddressVisible(cardInfo.addressVisible !== false);
      setBirthday(cardInfo.birthday || '');
      setBirthdayVisible(cardInfo.birthdayVisible || false);
      setGender(cardInfo.gender || '');
      setGenderVisible(cardInfo.genderVisible || false);
      setLine(cardInfo.line || '');
      setFacebook(cardInfo.facebook || '');
      setInstagram(cardInfo.instagram || '');
      setPhoto(cardInfo.photo || null);
      setCardPublic(cardInfo.cardPublic || false);
    }
  }, [userData]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handlePhoneChange = () => {
    setShowOTPInput(true);
    toast({
      title: "手機號碼驗證",
      description: "請輸入發送到您手機的驗證碼"
    });
  };

  const handleOTPVerification = () => {
    if (otpCode.length === 6) {
      setRegisteredPhone(phone);
      setShowOTPInput(false);
      setOtpCode('');
      toast({
        title: "驗證成功",
        description: "手機號碼已更新"
      });
    } else {
      toast({
        title: "驗證失敗",
        description: "請輸入正確的驗證碼"
      });
    }
  };

  const handleSave = () => {
    // 儲存名片資料到 localStorage
    const cardData = {
      name,
      companyName,
      jobTitle,
      phone: registeredPhone,
      email,
      website,
      address,
      addressVisible,
      birthday,
      birthdayVisible,
      gender,
      genderVisible,
      line,
      facebook,
      instagram,
      photo,
      cardPublic
    };
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    toast({
      title: "名片已儲存",
      description: "您的電子名片已成功儲存。"
    });
    onRegistrationComplete();
  };

  const formatBirthdayDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">編輯電子名片</h1>
        </div>
      </div>

      <div className="p-6">
        {/* 個人資料區塊 */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">個人資料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 性別 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  性別
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={genderVisible}
                    onCheckedChange={setGenderVisible}
                  />
                </div>
              </div>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇性別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 生日 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
                  生日
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={birthdayVisible}
                    onCheckedChange={setBirthdayVisible}
                  />
                </div>
              </div>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                公開時僅顯示月日，不顯示年份
              </p>
            </div>

            {/* 註冊手機號碼 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                註冊手機號碼
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="tel"
                  value={registeredPhone}
                  readOnly
                  className="bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePhoneChange}
                  className="shrink-0"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  修改
                </Button>
              </div>
              
              {showOTPInput && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    請輸入驗證碼
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="6位數驗證碼"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                    />
                    <Button
                      onClick={handleOTPVerification}
                      size="sm"
                      className="shrink-0"
                    >
                      驗證
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 電子名片設定區塊 */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-800">電子名片設定</CardTitle>
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600">公開名片</Label>
                <Switch
                  checked={cardPublic}
                  onCheckedChange={setCardPublic}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 照片上傳 */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                {photo ? (
                  <AvatarImage src={photo} alt="照片" />
                ) : (
                  <AvatarFallback className="bg-gray-300 text-gray-600 font-bold text-xl">
                    {name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <Label htmlFor="photo-upload" className="text-sm font-medium text-gray-700">
                  上傳頭像
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  選擇照片
                </label>
                {photo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="text-red-500 hover:bg-red-50 ml-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    移除
                  </Button>
                )}
              </div>
            </div>

            {/* 姓名 */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                姓名
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 公司名稱 */}
            <div>
              <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                公司名稱
              </Label>
              <Input
                id="company-name"
                type="text"
                placeholder="您的公司名稱"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* 職稱 */}
            <div>
              <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">
                職稱
              </Label>
              <Input
                id="job-title"
                type="text"
                placeholder="您的職稱"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* 電話 */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                電話
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="您的聯絡電話"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                顯示用聯絡電話，可與註冊手機號碼不同
              </p>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="您的Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 網站 */}
            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                網站
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="您的網站"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {/* 地址 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  地址
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={addressVisible}
                    onCheckedChange={setAddressVisible}
                  />
                </div>
              </div>
              <Input
                id="address"
                type="text"
                placeholder="您的地址"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* LINE */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="line" className="text-sm font-medium text-gray-700">
                  LINE
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLineTutorial(!showLineTutorial)}
                  className="p-1 h-6 w-6 rounded-full hover:bg-gray-100"
                >
                  <Info className="w-4 h-4 text-blue-500" />
                </Button>
              </div>
              <Input
                id="line"
                type="url"
                placeholder="您的LINE個人網址"
                value={line}
                onChange={(e) => setLine(e.target.value)}
              />
              
              <Collapsible open={showLineTutorial} onOpenChange={setShowLineTutorial}>
                <CollapsibleContent className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-blue-800 mb-1">📱 iOS用戶：</p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        進入LINE主頁 → 加入好友 → 透過社群/郵件等方式宣傳帳號 → 選擇「網址」→ 複製網址URL
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 mb-1">🤖 Android用戶：</p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        進入LINE主頁 → 點右上角「人像＋」圖示 → 點行動條碼 → 顯示行動條碼 → 選擇一位朋友分享 → 進入對話視窗即可看到專屬連結和QR Code
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Facebook */}
            <div>
              <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">
                Facebook
              </Label>
              <Input
                id="facebook"
                type="text"
                placeholder="您的Facebook用戶名稱或連結"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>

            {/* Instagram */}
            <div>
              <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                Instagram
              </Label>
              <Input
                id="instagram"
                type="text"
                placeholder="您的Instagram用戶名稱或連結"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 名片預覽 */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">名片預覽</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-4">
                {photo && (
                  <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                    <AvatarImage src={photo} alt="照片" />
                    <AvatarFallback className="bg-white text-green-600 font-bold text-xl">
                      {name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{name || '您的姓名'}</h2>
                  {jobTitle && (
                    <p className="text-green-100 text-sm mb-1">{jobTitle}</p>
                  )}
                  {companyName && (
                    <p className="text-green-100 text-lg">{companyName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {phone && (
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <span>{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>{email}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <span>{website}</span>
                  </div>
                )}
                {address && addressVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{address}</span>
                  </div>
                )}
                {birthday && birthdayVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">🎂</span>
                    <span>{formatBirthdayDisplay(birthday)}</span>
                  </div>
                )}
                {gender && genderVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">👤</span>
                    <span>{gender === 'male' ? '男性' : gender === 'female' ? '女性' : '其他'}</span>
                  </div>
                )}
              </div>

              {/* 社群資訊 */}
              {(line || facebook || instagram) && (
                <div className="mt-4 pt-4 border-t border-green-300/50">
                  <div className="flex flex-wrap gap-3">
                    {line && (
                      <button
                        onClick={() => window.open(line, '_blank')}
                        className="flex items-center text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        <span className="mr-1">💬</span>
                        <span>加入 LINE</span>
                      </button>
                    )}
                    {facebook && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📘</span>
                        <span>FB: {facebook}</span>
                      </div>
                    )}
                    {instagram && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📷</span>
                        <span>IG: {instagram}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 儲存按鈕 */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 text-lg font-semibold shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          儲存電子名片
        </Button>
      </div>
    </div>
  );
};

export default CreateCard;
