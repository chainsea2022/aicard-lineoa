import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Settings, Mail, Phone, Calendar, MapPin, Eye, EyeOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProfileSettingsProps {
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  // Personal data states
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [showBirthdayCalendar, setShowBirthdayCalendar] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>();
  
  // Visibility states
  const [genderVisible, setGenderVisible] = useState(false);
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState(true);
  const [introductionVisible, setIntroductionVisible] = useState(false);
  const [mobilePhoneVisible, setMobilePhoneVisible] = useState(false);
  
  // Public settings states
  const [publicSettings, setPublicSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: false,
    receiveNotifications: true
  });
  
  // UI states
  const [showPublicSettings, setShowPublicSettings] = useState(true);

  useEffect(() => {
    // Load card data from localStorage
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setGender(cardInfo.gender || '');
      setBirthday(cardInfo.birthday || '');
      setAddress(cardInfo.address || '');
      setIntroduction(cardInfo.introduction || '');
      setMobilePhone(cardInfo.mobilePhone || '');
      setGenderVisible(cardInfo.genderVisible || false);
      setBirthdayVisible(cardInfo.birthdayVisible || false);
      setAddressVisible(cardInfo.addressVisible !== false);
      setIntroductionVisible(cardInfo.introductionVisible || false);
      setMobilePhoneVisible(cardInfo.mobilePhoneVisible || false);
      
      // Convert birthday to Date object for calendar
      if (cardInfo.birthday) {
        const date = new Date(cardInfo.birthday);
        if (!isNaN(date.getTime())) {
          setBirthdayDate(date);
        }
      }
    }
    
    // Load public settings
    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      setPublicSettings(JSON.parse(savedSettings));
    }
  }, []);

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

  const handleBirthdayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthdayInput(e.target.value);
    setBirthday(formatted);
    
    if (formatted.length === 10) {
      const date = new Date(formatted);
      if (!isNaN(date.getTime())) {
        setBirthdayDate(date);
      }
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

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = {
      ...publicSettings,
      [key]: value
    };
    setPublicSettings(newSettings);
    localStorage.setItem('aile-profile-settings', JSON.stringify(newSettings));

    if (key === 'receiveNotifications') {
      toast({
        title: value ? "已開啟通知" : "已關閉通知",
        description: value ? "當有用戶加入您的名片時，將在Aipower聊天室中彈跳通知提醒。" : "將不再接收用戶加入名片的通知提醒。"
      });
    } else {
      toast({
        title: "設定已儲存",
        description: "您的設定已更新。"
      });
    }
  };

  const handleSave = () => {
    // Get existing card data
    const savedCardData = localStorage.getItem('aile-card-data');
    let cardData = {};
    if (savedCardData) {
      cardData = JSON.parse(savedCardData);
    }

    // Update with personal data
    const updatedCardData = {
      ...cardData,
      gender,
      birthday,
      address,
      introduction,
      mobilePhone,
      genderVisible,
      birthdayVisible,
      addressVisible,
      introductionVisible,
      mobilePhoneVisible
    };

    localStorage.setItem('aile-card-data', JSON.stringify(updatedCardData));
    
    toast({
      title: "資料已儲存",
      description: "您的個人資料設定已成功更新。"
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            個人資料
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gender */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">性別</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={genderVisible}
                  onCheckedChange={setGenderVisible}
                />
                {genderVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
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

          {/* Birthday */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">生日</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={birthdayVisible}
                  onCheckedChange={setBirthdayVisible}
                />
                {birthdayVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Input
                value={birthday}
                onChange={handleBirthdayInputChange}
                placeholder="YYYY/MM/DD 或 YYYYMMDD"
                className="flex-1"
              />
              <Popover open={showBirthdayCalendar} onOpenChange={setShowBirthdayCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={birthdayDate}
                    onSelect={handleBirthdayDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">地址</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={addressVisible}
                  onCheckedChange={setAddressVisible}
                />
                {addressVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="請輸入地址"
            />
          </div>

          {/* Mobile Phone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">手機號碼</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={mobilePhoneVisible}
                  onCheckedChange={setMobilePhoneVisible}
                />
                {mobilePhoneVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Input
              value={mobilePhone}
              onChange={(e) => setMobilePhone(e.target.value)}
              placeholder="請輸入手機號碼"
            />
          </div>

          {/* Introduction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">自我介紹</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={introductionVisible}
                  onCheckedChange={setIntroductionVisible}
                />
                {introductionVisible ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="請輸入自我介紹"
              rows={3}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            儲存個人資料
          </Button>
        </CardContent>
      </Card>

      {/* Public Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Settings className="w-5 h-5 mr-2 text-green-600" />
            公開設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Collapsible open={showPublicSettings} onOpenChange={setShowPublicSettings}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <span className="text-base font-medium">隱私與通知設定</span>
                {showPublicSettings ? (
                  <div className="w-5 h-5 text-gray-400" />
                ) : (
                  <div className="w-5 h-5 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">公開個人檔案</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      允許其他用戶搜尋並查看您的電子名片
                    </p>
                  </div>
                  <Switch
                    checked={publicSettings.isPublicProfile}
                    onCheckedChange={(value) => handleSettingChange('isPublicProfile', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">允許直接聯繫</h4>
                    <p className="text-sm text-green-700 mt-1">
                      允許其他用戶直接透過您的名片聯繫您
                    </p>
                  </div>
                  <Switch
                    checked={publicSettings.allowDirectContact}
                    onCheckedChange={(value) => handleSettingChange('allowDirectContact', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900">接收通知</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      當有用戶加入您的名片時，在Aipower聊天室中彈跳通知提醒
                    </p>
                  </div>
                  <Switch
                    checked={publicSettings.receiveNotifications}
                    onCheckedChange={(value) => handleSettingChange('receiveNotifications', value)}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium mb-1">隱私說明</p>
                    <p className="text-xs text-gray-600">
                      您的隱私設定將影響其他用戶如何發現和聯繫您。您可以隨時在此處調整這些設定。
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;