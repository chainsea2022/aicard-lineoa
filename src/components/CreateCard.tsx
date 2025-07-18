import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Eye, EyeOff, Info, ChevronDown, ChevronUp, Edit, QrCode, Download, Share2, Calendar as CalendarIcon, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete: () => void;
  userData: any;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose, onRegistrationComplete, userData }) => {
  // Personal Info States
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [registeredPhone, setRegisteredPhone] = useState(userData?.phone || '');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Business Card Settings States with visibility
  const [name, setName] = useState('');
  const [nameVisible, setNameVisible] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyNameVisible, setCompanyNameVisible] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [jobTitleVisible, setJobTitleVisible] = useState(true);
  const [phone, setPhone] = useState('');
  const [phoneVisible, setPhoneVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [emailVisible, setEmailVisible] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [website, setWebsite] = useState('');
  const [websiteVisible, setWebsiteVisible] = useState(true);
  const [address, setAddress] = useState('');
  const [addressVisible, setAddressVisible] = useState(true);
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);
  const [line, setLine] = useState('');
  const [lineVisible, setLineVisible] = useState(true);
  const [facebook, setFacebook] = useState('');
  const [facebookVisible, setFacebookVisible] = useState(true);
  const [instagram, setInstagram] = useState('');
  const [instagramVisible, setInstagramVisible] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardPublic, setCardPublic] = useState(false);

  // UI States
  const [showLineTutorial, setShowLineTutorial] = useState(false);
  const [showFacebookTutorial, setShowFacebookTutorial] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showBirthdayCalendar, setShowBirthdayCalendar] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>();

  // Birthday formatting and validation functions
  const formatBirthdayInput = (value: string) => {
    // Remove all non-numeric characters except forward slashes
    const cleaned = value.replace(/[^\d/]/g, '');
    
    // If user is typing with slashes, preserve them
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        // Validate and format year (4 digits), month (2 digits), day (2 digits)
        const validYear = year.slice(0, 4);
        const validMonth = month.slice(0, 2);
        const validDay = day.slice(0, 2);
        return `${validYear}${month ? '/' + validMonth : ''}${day ? '/' + validDay : ''}`;
      }
      return cleaned;
    } else {
      // Handle pure numeric input (e.g., 19900325)
      const numbers = cleaned.replace(/\D/g, '');
      const limitedNumbers = numbers.slice(0, 8);
      
      // Only auto-format when user has entered complete segments
      if (limitedNumbers.length === 8) {
        const year = limitedNumbers.slice(0, 4);
        const month = limitedNumbers.slice(4, 6);
        const day = limitedNumbers.slice(6, 8);
        return `${year}/${month}/${day}`;
      }
      // Return raw numbers for partial input (allow continued typing)
      return limitedNumbers;
    }
  };

  const validateBirthday = (dateStr: string) => {
    if (!dateStr || dateStr.length < 10) return false;
    
    const date = new Date(dateStr);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false;
    
    // Check if date is not in the future
    if (date > today) return false;
    
    // Check if date is reasonable (not before 1900)
    if (date.getFullYear() < 1900) return false;
    
    return true;
  };

  const handleBirthdayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthdayInput(e.target.value);
    setBirthday(formatted);
    
    // Convert to Date object for calendar state
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

  useEffect(() => {
    // 設置註冊手機號碼
    if (userData?.phone) {
      setRegisteredPhone(userData.phone);
      setPhone(userData.phone); // 同時設置為顯示用電話
    }

    // 從 localStorage 載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setName(cardInfo.name || '');
      setNameVisible(cardInfo.nameVisible !== false);
      setCompanyName(cardInfo.companyName || '');
      setCompanyNameVisible(cardInfo.companyNameVisible !== false);
      setJobTitle(cardInfo.jobTitle || '');
      setJobTitleVisible(cardInfo.jobTitleVisible !== false);
      setPhone(cardInfo.phone || userData?.phone || '');
      setPhoneVisible(cardInfo.phoneVisible !== false);
      setEmail(cardInfo.email || '');
      setEmailVisible(cardInfo.emailVisible !== false);
      setEmailVerified(cardInfo.emailVerified || false);
      setEmailVerificationSent(cardInfo.emailVerificationSent || false);
      setWebsite(cardInfo.website || '');
      setWebsiteVisible(cardInfo.websiteVisible !== false);
      setAddress(cardInfo.address || '');
      setAddressVisible(cardInfo.addressVisible !== false);
      setBirthday(cardInfo.birthday || '');
      setBirthdayVisible(cardInfo.birthdayVisible || false);
      setGender(cardInfo.gender || '');
      setGenderVisible(cardInfo.genderVisible || false);
      setLine(cardInfo.line || '');
      setLineVisible(cardInfo.lineVisible !== false);
      setFacebook(cardInfo.facebook || '');
      setFacebookVisible(cardInfo.facebookVisible !== false);
      setInstagram(cardInfo.instagram || '');
      setInstagramVisible(cardInfo.instagramVisible !== false);
      setPhoto(cardInfo.photo || null);
      setCardPublic(cardInfo.cardPublic || false);
      
      // Convert birthday to Date object for calendar
      if (cardInfo.birthday) {
        const date = new Date(cardInfo.birthday);
        if (!isNaN(date.getTime())) {
          setBirthdayDate(date);
        }
      }
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
    // 檢查必填欄位
    if (!email) {
      toast({
        title: "請填寫必填項目",
        description: "Email 為必填項目，請填寫後再儲存。",
      });
      return;
    }
    
    if (!emailVerified) {
      toast({
        title: "請完成 Email 驗證",
        description: "請先完成 Email 驗證後再儲存名片。",
      });
      return;
    }
    
    // 儲存名片資料到 localStorage
    const cardData = {
      name,
      nameVisible,
      companyName,
      companyNameVisible,
      jobTitle,
      jobTitleVisible,
      phone,
      phoneVisible,
      email,
      emailVisible,
      emailVerified,
      emailVerificationSent,
      website,
      websiteVisible,
      address,
      addressVisible,
      birthday,
      birthdayVisible,
      gender,
      genderVisible,
      line,
      lineVisible,
      facebook,
      facebookVisible,
      instagram,
      instagramVisible,
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
        title: `${name}的電子名片`,
        text: `${companyName} - ${name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${name}的電子名片 - ${companyName}`);
      toast({
        title: "已複製到剪貼板",
        description: "名片資訊已複製，可以分享給朋友。"
      });
    }
  };

  const showFacebookHelp = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Facebook URL 設置說明</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            line-height: 1.6;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 0 auto;
        }
        h1 {
            color: #1877f2;
            margin-bottom: 20px;
            text-align: center;
            font-size: 24px;
        }
        .step-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #1877f2;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            font-size: 16px;
        }
        .step:last-child {
            margin-bottom: 0;
        }
        .step-number {
            background: #1877f2;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-weight: bold;
            font-size: 12px;
        }
        .arrow {
            margin: 0 8px;
            color: #1877f2;
            font-weight: bold;
        }
        .platform-tag {
            background: #e3f2fd;
            color: #1565c0;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 16px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Facebook URL 設置說明</h1>
        <div class="platform-tag">iOS / Android 用戶</div>
        <div class="step-container">
            <div class="step">
                <div class="step-number">1</div>
                <span>打開 Facebook App</span>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <span>前往「個人/粉專」頁面</span>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <span>點右上角「⋯」圖示</span>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <span>選擇「複製連結」</span>
            </div>
            <div class="step">
                <div class="step-number">5</div>
                <span>即可獲得您的 Facebook 專屬網址</span>
            </div>
        </div>
    </div>
</body>
</html>`;

    if (window.liff) {
      window.liff.openWindow({
        url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
        external: false
      });
    } else {
      // Fallback for non-LIFF environment
      const instructions = "Facebook URL 設置說明\n\niOS / Android 用戶：\n打開 Facebook App → 前往「個人/粉專」頁面 → 點右上角「⋯」圖示 → 選擇「複製連結」→ 即可獲得您的 Facebook 專屬網址";
      alert(instructions);
    }
  };

  const showInstagramHelp = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Instagram URL 設置說明</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            line-height: 1.6;
            margin: 0;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 0 auto;
        }
        h1 {
            color: #e4405f;
            margin-bottom: 20px;
            text-align: center;
            font-size: 24px;
        }
        .platform-section {
            margin-bottom: 24px;
        }
        .step-container {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #e4405f;
            margin-bottom: 16px;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            font-size: 16px;
        }
        .step:last-child {
            margin-bottom: 0;
        }
        .step-number {
            background: #e4405f;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-weight: bold;
            font-size: 12px;
        }
        .platform-tag {
            background: #fce4ec;
            color: #c2185b;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 16px;
            display: inline-block;
        }
        .ios {
            background: #e3f2fd;
            color: #1565c0;
        }
        .android {
            background: #e8f5e8;
            color: #2e7d32;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 Instagram URL 設置說明</h1>
        
        <div class="platform-section">
            <div class="platform-tag ios">iOS 用戶</div>
            <div class="step-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <span>開啟 Instagram App</span>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <span>進入您的 個人頁 / 粉專</span>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <span>點右上角「⋯」圖示</span>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <span>選擇「分享」→「複製連結」</span>
                </div>
                <div class="step">
                    <div class="step-number">5</div>
                    <span>即可取得您的 Instagram 專屬網址</span>
                </div>
            </div>
        </div>

        <div class="platform-section">
            <div class="platform-tag android">Android 用戶</div>
            <div class="step-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <span>打開 Instagram App</span>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <span>進入您的 個人頁 / 粉專</span>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <span>點右上角「⋯」或下方「紙飛機圖示 ✈️」</span>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <span>選擇「複製連結」或「以其他方式分享」</span>
                </div>
                <div class="step">
                    <div class="step-number">5</div>
                    <span>即可取得您的 Instagram 專屬網址</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    if (window.liff) {
      window.liff.openWindow({
        url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
        external: false
      });
    } else {
      // Fallback for non-LIFF environment
      const instructions = "Instagram URL 設置說明\n\niOS用戶：\n開啟 Instagram App → 進入您的 個人頁 / 粉專 → 點右上角「⋯」圖示 → 選擇「分享」→「複製連結」即可取得您的 Instagram 專屬網址\n\nAndroid用戶：\n打開 Instagram App → 進入您的 個人頁 / 粉專 → 點右上角「⋯」或下方「紙飛機圖示 ✈️」→ 選擇「複製連結」或「以其他方式分享」→ 即可取得您的 Instagram 專屬網址";
      alert(instructions);
    }
  };

  const qrCodeData = `名片資訊
姓名: ${name || ''}
${jobTitle && jobTitleVisible ? `職稱: ${jobTitle}` : ''}
公司: ${companyName || ''}
電話: ${phone || ''}
Email: ${email || ''}
${address && addressVisible ? `地址: ${address}` : ''}
${birthday && birthdayVisible ? `生日: ${formatBirthdayDisplay(birthday)}` : ''}
${gender && genderVisible ? `性別: ${getGenderDisplay(gender)}` : ''}
LINE: ${line || ''}
網站: ${website || ''}`;

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
                
                {email && !emailVerified && (
                  <div className="space-y-2">
                    {!emailVerificationSent ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          // 模擬發送驗證郵件
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
                            {/* 模擬驗證按鈕 - 實際應用中這個會通過郵件連結觸發 */}
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
                  placeholder="輸入：19900325 或 1990/03/25"
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
                    "text-base",
                    birthday && !validateBirthday(birthday) && birthday.length >= 8 
                      ? "border-red-500 focus:border-red-500" 
                      : ""
                  )}
                />
                
                <Popover open={showBirthdayCalendar} onOpenChange={setShowBirthdayCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 px-3 h-10"
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-[95vw] max-w-sm p-0 mx-2" 
                    align="center"
                    side="bottom"
                    sideOffset={5}
                  >
                    <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
                      {/* 標題 */}
                      <div className="text-center border-b pb-2">
                        <h3 className="text-base font-medium text-gray-800">選擇生日日期</h3>
                      </div>

                      {/* 年份選擇 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">年份</Label>
                        <Select
                          value={birthdayDate?.getFullYear().toString() || new Date().getFullYear().toString()}
                          onValueChange={(year) => {
                            const currentDate = birthdayDate || new Date();
                            const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
                            setBirthdayDate(newDate);
                          }}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-48">
                            {Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}年
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 月份選擇 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">月份</Label>
                        <div className="grid grid-cols-6 gap-1">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <Button
                              key={month}
                              variant={birthdayDate?.getMonth() + 1 === month ? "default" : "outline"}
                              size="sm"
                              className="h-8 text-xs px-1"
                              onClick={() => {
                                const currentDate = birthdayDate || new Date();
                                const newDate = new Date(currentDate.getFullYear(), month - 1, currentDate.getDate());
                                setBirthdayDate(newDate);
                              }}
                            >
                              {month}月
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* 日期選擇 */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">日期</Label>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                            const currentDate = birthdayDate || new Date();
                            const testDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const isValidDay = testDate.getMonth() === currentDate.getMonth();
                            
                            return (
                              <Button
                                key={day}
                                variant={birthdayDate?.getDate() === day ? "default" : "outline"}
                                size="sm"
                                className="h-8 text-xs p-0 min-w-0"
                                disabled={!isValidDay}
                                onClick={() => {
                                  if (isValidDay) {
                                    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                    setBirthdayDate(newDate);
                                  }
                                }}
                              >
                                {day}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 預覽和確認 */}
                      {birthdayDate && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="text-center text-sm text-gray-600">
                            選擇的日期：<span className="font-medium text-gray-800">{format(birthdayDate, 'yyyy年MM月dd日')}</span>
                          </div>
                        </div>
                      )}

                      {/* 確認按鈕 */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowBirthdayCalendar(false)}
                          className="flex-1"
                        >
                          取消
                        </Button>
                        <Button
                          onClick={() => {
                            if (birthdayDate) {
                              setBirthday(format(birthdayDate, 'yyyy/MM/dd'));
                              setShowBirthdayCalendar(false);
                              toast({
                                title: "生日已設定",
                                description: `${format(birthdayDate, 'yyyy年MM月dd日')}`,
                                duration: 2000,
                              });
                            }
                          }}
                          className="flex-1"
                          disabled={!birthdayDate}
                        >
                          確認
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <p className="text-xs text-gray-500">
                支援手動輸入8位數字或用斜線分隔，也可點擊日曆圖示快速選擇
              </p>
              
              {/* 當前設定顯示 */}
              {birthday && validateBirthday(birthday) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <span className="text-green-800 text-sm">
                    ✓ 已設定生日：{format(new Date(birthday), 'yyyy年MM月dd日')}
                  </span>
                </div>
              )}
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
            <CardTitle className="text-xl text-gray-800">電子名片設定</CardTitle>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  姓名
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={nameVisible}
                    onCheckedChange={setNameVisible}
                  />
                </div>
              </div>
              <Input
                id="name"
                type="text"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 公司名稱 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                  公司名稱
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={companyNameVisible}
                    onCheckedChange={setCompanyNameVisible}
                  />
                </div>
              </div>
              <Input
                id="company-name"
                type="text"
                placeholder="您的公司名稱"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* 職稱 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">
                  職稱
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={jobTitleVisible}
                    onCheckedChange={setJobTitleVisible}
                  />
                </div>
              </div>
              <Input
                id="job-title"
                type="text"
                placeholder="您的職稱"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* 電話 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  電話
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={phoneVisible}
                    onCheckedChange={setPhoneVisible}
                  />
                </div>
              </div>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={emailVisible}
                    onCheckedChange={setEmailVisible}
                  />
                </div>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="您的Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 網站 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  網站
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={websiteVisible}
                    onCheckedChange={setWebsiteVisible}
                  />
                </div>
              </div>
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
              <div className="flex items-center justify-between">
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
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={lineVisible}
                    onCheckedChange={setLineVisible}
                  />
                </div>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">
                    Facebook
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFacebookTutorial(!showFacebookTutorial)}
                    className="p-1 h-6 w-6 rounded-full hover:bg-gray-100"
                  >
                    <Info className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={facebookVisible}
                    onCheckedChange={setFacebookVisible}
                  />
                </div>
              </div>
              <Input
                id="facebook"
                type="text"
                placeholder="您的Facebook用戶名稱或連結"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />

              {/* Facebook Tutorial */}
              {showFacebookTutorial && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    📱 Facebook URL 設置說明
                  </h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <p className="font-medium text-blue-800 mb-2">iOS / Android 用戶：</p>
                      <div className="space-y-1 text-blue-700">
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">1</span>
                          <span>打開 Facebook App</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">2</span>
                          <span>前往「個人/粉專」頁面</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">3</span>
                          <span>點右上角「⋯」圖示</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">4</span>
                          <span>選擇「複製連結」</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">5</span>
                          <span>即可獲得您的 Facebook 專屬網址</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                    Instagram
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={showInstagramHelp}
                    className="p-1 h-6 w-6 rounded-full hover:bg-gray-100"
                  >
                    <Info className="w-4 h-4 text-blue-500" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={instagramVisible}
                    onCheckedChange={setInstagramVisible}
                  />
                </div>
              </div>
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

        {/* 儲存按鈕 */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 text-lg font-semibold shadow-lg mb-6"
        >
          <Save className="w-5 h-5 mr-2" />
          儲存電子名片
        </Button>

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
                  <h2 className="text-2xl font-bold mb-1">{(name && nameVisible) ? name : '您的姓名'}</h2>
                  {jobTitle && jobTitleVisible && (
                    <p className="text-green-100 text-sm mb-1">{jobTitle}</p>
                  )}
                  {companyName && companyNameVisible && (
                    <p className="text-green-100 text-lg">{companyName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {phone && phoneVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <span>{phone}</span>
                  </div>
                )}
                {email && emailVisible && (
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>{email}</span>
                  </div>
                )}
                {website && websiteVisible && (
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
                    <span>{getGenderDisplay(gender)}</span>
                  </div>
                )}
              </div>

              {/* 社群資訊 */}
              {((line && lineVisible) || (facebook && facebookVisible) || (instagram && instagramVisible)) && (
                <div className="mt-4 pt-4 border-t border-green-300/50">
                  <div className="flex flex-wrap gap-3">
                    {line && lineVisible && (
                      <button
                        onClick={() => window.open(line, '_blank')}
                        className="flex items-center text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors cursor-pointer"
                      >
                        <span className="mr-1">💬</span>
                        <span>加入 LINE</span>
                      </button>
                    )}
                    {facebook && facebookVisible && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📘</span>
                        <span>FB: {facebook}</span>
                      </div>
                    )}
                    {instagram && instagramVisible && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📷</span>
                        <span>IG: {instagram}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* QR Code 區塊 */}
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

            {/* 名片操作按鈕 */}
            <div className="p-4 bg-gray-50 border-t">
              <Button
                onClick={shareCard}
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                分享電子名片
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCard;
