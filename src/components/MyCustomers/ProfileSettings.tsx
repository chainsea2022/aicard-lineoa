import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, Shield, Bell, User, Mail, CheckCircle, Calendar as CalendarIcon, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ProfileSettingsProps {
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  // Public settings
  const [publicSettings, setPublicSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: false,
    receiveNotifications: true
  });

  // Personal data
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState('');
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>();
  const [showBirthdayCalendar, setShowBirthdayCalendar] = useState(false);

  // Birthday formatting and validation functions
  const formatBirthdayInput = (value: string) => {
    const cleaned = value.replace(/[^\d/]/g, '');
    
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const validYear = year.slice(0, 4);
        const validMonth = month.slice(0, 2);
        const validDay = day.slice(0, 2);
        return `${validYear}${month ? '/' + validMonth : ''}${day ? '/' + validDay : ''}`;
      }
      return cleaned;
    } else {
      const numbers = cleaned.replace(/\D/g, '');
      const limitedNumbers = numbers.slice(0, 8);
      
      if (limitedNumbers.length === 8) {
        const year = limitedNumbers.slice(0, 4);
        const month = limitedNumbers.slice(4, 6);
        const day = limitedNumbers.slice(6, 8);
        return `${year}/${month}/${day}`;
      }
      return limitedNumbers;
    }
  };

  const validateBirthday = (dateStr: string) => {
    if (!dateStr || dateStr.length < 10) return false;
    
    const date = new Date(dateStr);
    const today = new Date();
    
    if (isNaN(date.getTime())) return false;
    if (date > today) return false;
    if (date.getFullYear() < 1900) return false;
    
    return true;
  };

  const handleBirthdayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthdayInput(e.target.value);
    setBirthday(formatted);
    
    if (formatted.length === 10 && validateBirthday(formatted)) {
      setBirthdayDate(new Date(formatted));
    }
  };

  const handleBirthdayDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, 'yyyy/MM/dd');
      setBirthday(formatted);
      setBirthdayDate(date);
    }
    setShowBirthdayCalendar(false);
  };

  // Phone number OTP verification functions
  const handleSendPhoneOTP = () => {
    if (phone.length === 10) {
      setPhoneOTPSent(true);
      toast({
        title: "驗證碼已發送",
        description: `驗證碼已發送至 ${phone}，請輸入6位數驗證碼。`,
      });
    }
  };

  const handleVerifyPhoneOTP = () => {
    if (phoneOTP.length === 6) {
      setPhoneVerified(true);
      setShowPhoneOTP(false);
      setPhoneOTP('');
      setPhoneOTPSent(false);
      toast({
        title: "手機號碼驗證成功",
        description: "您的手機號碼已成功驗證並綁定。",
      });
    }
  };

  useEffect(() => {
    // 載入公開設定
    const savedPublicSettings = localStorage.getItem('aile-profile-settings');
    if (savedPublicSettings) {
      setPublicSettings(JSON.parse(savedPublicSettings));
    }

    // 載入個人資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setGender(cardInfo.gender || '');
      setPhone(cardInfo.phone || '');
      setPhoneVerified(cardInfo.phoneVerified || false);
      setEmail(cardInfo.email || '');
      setEmailVerified(cardInfo.emailVerified || false);
      setEmailVerificationSent(cardInfo.emailVerificationSent || false);
      setBirthday(cardInfo.birthday || '');
      
      if (cardInfo.birthday) {
        const date = new Date(cardInfo.birthday);
        if (!isNaN(date.getTime())) {
          setBirthdayDate(date);
        }
      }
    }

    // 從註冊資料載入手機號碼
    const savedUserData = localStorage.getItem('aile-user-data');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      if (userData.phone && !phone) {
        setPhone(userData.phone);
        setPhoneVerified(true);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    // 儲存公開設定
    localStorage.setItem('aile-profile-settings', JSON.stringify(publicSettings));
    
    // 儲存個人資料到名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    const cardData = savedCardData ? JSON.parse(savedCardData) : {};
    
    const updatedCardData = {
      ...cardData,
      gender,
      phone,
      phoneVerified,
      email,
      emailVerified,
      emailVerificationSent,
      birthday
    };
    
    localStorage.setItem('aile-card-data', JSON.stringify(updatedCardData));
    
    toast({
      title: "設定已儲存",
      description: "您的資料設定已更新。"
    });
    onClose();
  };

  const handlePublicSettingChange = (key: string, value: boolean) => {
    setPublicSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
            <h1 className="font-bold text-lg">資料設定</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 個人資料區塊 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2" />
              個人資料
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 性別 */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                性別
              </Label>
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

            {/* 手機號碼 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  手機號碼
                </Label>
                {phoneVerified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">已驗證</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="請輸入10位手機號碼"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                      if (phoneVerified && value !== phone) {
                        setPhoneVerified(false);
                        setShowPhoneOTP(false);
                        setPhoneOTPSent(false);
                      }
                    }}
                    className={cn(
                      "text-base",
                      phoneVerified && "border-green-500 bg-green-50"
                    )}
                    maxLength={10}
                  />
                  
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowPhoneOTP(true)}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700"
                  >
                    修改
                  </Button>
                </div>
                
                {showPhoneOTP && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <div className="flex items-start space-x-2">
                      <Smartphone className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">手機號碼驗證</p>
                        <p className="text-xs mt-1">
                          將發送驗證碼至 {phone}
                        </p>
                      </div>
                    </div>
                    
                    {!phoneOTPSent ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSendPhoneOTP}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={phone.length !== 10}
                      >
                        發送驗證碼
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-sm text-blue-700 font-medium">請輸入6位數驗證碼</p>
                          <p className="text-xs text-blue-600 mt-1">已發送至 {phone}</p>
                        </div>
                        
                        <div className="w-full overflow-hidden">
                          <InputOTP 
                            maxLength={6} 
                            value={phoneOTP} 
                            onChange={setPhoneOTP}
                            containerClassName="flex justify-center w-full"
                          >
                            <InputOTPGroup className="flex gap-2">
                              <InputOTPSlot index={0} className="w-10 h-10 text-base border-2" />
                              <InputOTPSlot index={1} className="w-10 h-10 text-base border-2" />
                              <InputOTPSlot index={2} className="w-10 h-10 text-base border-2" />
                              <InputOTPSlot index={3} className="w-10 h-10 text-base border-2" />
                              <InputOTPSlot index={4} className="w-10 h-10 text-base border-2" />
                              <InputOTPSlot index={5} className="w-10 h-10 text-base border-2" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleVerifyPhoneOTP}
                            disabled={phoneOTP.length !== 6}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                          >
                            驗證 ({phoneOTP.length}/6)
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowPhoneOTP(false);
                              setPhoneOTPSent(false);
                              setPhoneOTP('');
                            }}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                {emailVerified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">已驗證</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="請輸入您的 Email 地址"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailVerified) {
                        setEmailVerified(false);
                        setEmailVerificationSent(false);
                      }
                    }}
                    className={cn(
                      "text-base",
                      !email && "border-red-300",
                      emailVerified && "border-green-500 bg-green-50"
                    )}
                    required
                  />
                  
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (emailVerified) {
                        setEmailVerified(false);
                        setEmailVerificationSent(false);
                      }
                    }}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700"
                  >
                    修改
                  </Button>
                </div>
                
                {email && !emailVerified && (
                  <div className="space-y-2">
                    {!emailVerificationSent ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setEmailVerificationSent(true);
                          toast({
                            title: "驗證郵件已發送",
                            description: `驗證郵件已發送至 ${email}，請檢查您的信箱並點擊驗證連結。`,
                          });
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        發送驗證郵件
                      </Button>
                    ) : (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">驗證郵件已發送</p>
                            <p className="text-xs mt-1">
                              請檢查您的信箱 {email} 並點擊驗證連結。未收到？
                              <button
                                onClick={() => {
                                  toast({
                                    title: "驗證郵件已重新發送",
                                    description: `驗證郵件已重新發送至 ${email}`,
                                  });
                                }}
                                className="text-blue-600 underline ml-1"
                              >
                                重新發送
                              </button>
                            </p>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEmailVerified(true);
                                toast({
                                  title: "Email 驗證成功",
                                  description: "您的 Email 已成功驗證並綁定。",
                                });
                              }}
                              className="mt-2 text-xs bg-green-600 hover:bg-green-700"
                            >
                              點擊完成驗證（模擬）
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!email && (
                  <p className="text-xs text-red-600">Email 為必填項目</p>
                )}
              </div>
            </div>

            {/* 生日 */}
            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
                生日日期
              </Label>
              
              <div className="flex items-center space-x-2">
                <Input
                  id="birthday"
                  type="text"
                  placeholder="手動輸入：1990/03/25 或點選日期選擇器"
                  value={birthday}
                  onChange={handleBirthdayInputChange}
                  onBlur={() => {
                    if (birthday && !validateBirthday(birthday)) {
                      toast({
                        title: "日期格式錯誤",
                        description: "請輸入正確的日期格式，例如：1990/03/25",
                        duration: 3000,
                      });
                    }
                  }}
                  className={cn(
                    "text-base flex-1",
                    birthday && !validateBirthday(birthday) && birthday.length >= 8 
                      ? "border-red-500 focus:border-red-500" 
                      : birthday && validateBirthday(birthday) 
                      ? "border-green-500 bg-green-50"
                      : ""
                  )}
                />
                
                <Popover open={showBirthdayCalendar} onOpenChange={setShowBirthdayCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 px-3 h-10"
                      type="button"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={birthdayDate}
                      onSelect={handleBirthdayDateSelect}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      className="pointer-events-auto"
                      formatters={{
                        formatCaption: (date: Date) => date.getFullYear().toString(),
                        formatMonthCaption: (date: Date) => `${date.getMonth() + 1}月`,
                        formatYearCaption: (date: Date) => date.getFullYear().toString()
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {birthdayDate && (
                <p className="text-xs text-gray-600">
                  已選擇：{format(birthdayDate, "yyyy年MM月dd日")}
                </p>
              )}
            </div>
            
            {/* 儲存按鈕 */}
            <div className="pt-6 border-t border-gray-100">
              <Button
                onClick={handleSaveSettings}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                儲存
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 公開設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Eye className="w-5 h-5 mr-2" />
              公開設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">公開電子名片</Label>
                <p className="text-xs text-gray-600">
                  您的名片將可被其他用戶在智能推薦中搜尋與發現
                </p>
              </div>
              <Switch
                checked={publicSettings.isPublicProfile}
                onCheckedChange={(checked) => handlePublicSettingChange('isPublicProfile', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">允許直接加入</Label>
                <p className="text-xs text-gray-600">
                  啟用後，其他用戶可以直接把您的電子名片存到他們的名片夾。未啟用時，對方必須等您同意後，才能收到您的電子名片
                </p>
              </div>
              <Switch
                checked={publicSettings.allowDirectContact}
                onCheckedChange={(checked) => handlePublicSettingChange('allowDirectContact', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">接收通知</Label>
                <p className="text-xs text-gray-600">
                  您會收到所有關於電子名片、人脈互動、活動邀請和點數變動的系統通知
                </p>
              </div>
              <Switch
                checked={publicSettings.receiveNotifications}
                onCheckedChange={(checked) => handlePublicSettingChange('receiveNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 說明區塊 */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">設定說明</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 個人資料：包含性別、Email 驗證和生日等基本資訊</li>
              <li>• 公開電子名片：開啟後其他用戶可以在智能推薦中找到您</li>
              <li>• 通知設定：管理您希望接收的通知類型，包含聊天室彈跳通知</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};