import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Eye, EyeOff, Info, ChevronDown, ChevronUp, Edit, QrCode, Download, Share2, Calendar as CalendarIcon, Mail, CheckCircle, Camera, Mic, MicOff, Play, Square, Plus, Youtube, Linkedin, MessageCircle, Facebook, Instagram } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
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
  const [phone, setPhone] = useState(''); // 公司電話
  const [phoneVisible, setPhoneVisible] = useState(true);
  const [mobilePhone, setMobilePhone] = useState(''); // 手機號碼
  const [mobilePhoneVisible, setMobilePhoneVisible] = useState(false); // 手機號碼預設不公開
  const [email, setEmail] = useState('');
  const [emailVisible, setEmailVisible] = useState(false); // Email預設不公開
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [website, setWebsite] = useState('');
  const [websiteVisible, setWebsiteVisible] = useState(true);
  const [address, setAddress] = useState('');
  const [addressVisible, setAddressVisible] = useState(true);
  const [introduction, setIntroduction] = useState(''); // 自我介紹
  const [introductionVisible, setIntroductionVisible] = useState(false); // 自我介紹預設不公開
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [genderVisible, setGenderVisible] = useState(false);
  const [line, setLine] = useState('');
  const [lineVisible, setLineVisible] = useState(false); // LINE預設不公開
  const [facebook, setFacebook] = useState('');
  const [facebookVisible, setFacebookVisible] = useState(false); // Facebook預設不公開
  const [instagram, setInstagram] = useState('');
  const [instagramVisible, setInstagramVisible] = useState(false); // Instagram預設不公開
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardPublic, setCardPublic] = useState(false);
  
  // 新增社群媒體狀態
  const [socialMedia, setSocialMedia] = useState<Array<{id: string, platform: string, url: string, visible: boolean}>>([]);
  const [otherInfo, setOtherInfo] = useState(''); // 其他資訊
  const [otherInfoVisible, setOtherInfoVisible] = useState(true);

  // UI States
  const [showLineTutorial, setShowLineTutorial] = useState(false);
  const [showFacebookTutorial, setShowFacebookTutorial] = useState(false);
  const [showInstagramTutorial, setShowInstagramTutorial] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showBirthdayCalendar, setShowBirthdayCalendar] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>();
  const [showOCRCapture, setShowOCRCapture] = useState(false);
  const [showSocialMediaForm, setShowSocialMediaForm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [newSocialMedia, setNewSocialMedia] = useState({platform: '', url: ''});
  const [editingSocialMedia, setEditingSocialMedia] = useState<{id: string, platform: string, url: string} | null>(null);
  
  // 語音錄製相關
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      setMobilePhone(userData.phone); // 預設為手機號碼
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
      setPhone(cardInfo.phone || '');
      setPhoneVisible(cardInfo.phoneVisible !== false);
      setMobilePhone(cardInfo.mobilePhone || userData?.phone || '');
      setMobilePhoneVisible(cardInfo.mobilePhoneVisible !== false);
      setEmail(cardInfo.email || '');
      setEmailVisible(cardInfo.emailVisible !== false);
      setEmailVerified(cardInfo.emailVerified || false);
      setEmailVerificationSent(cardInfo.emailVerificationSent || false);
      setWebsite(cardInfo.website || '');
      setWebsiteVisible(cardInfo.websiteVisible !== false);
      setAddress(cardInfo.address || '');
      setAddressVisible(cardInfo.addressVisible !== false);
      setIntroduction(cardInfo.introduction || '');
      setIntroductionVisible(cardInfo.introductionVisible !== false);
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
      setSocialMedia(cardInfo.socialMedia || []);
      setOtherInfo(cardInfo.otherInfo || '');
      setOtherInfoVisible(cardInfo.otherInfoVisible !== false);
      
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

  // OCR 名片辨識處理
  const handleOCRCapture = () => {
    setShowOCRCapture(true);
  };

  const handleOCRResult = (ocrData: any) => {
    // 模擬 OCR 辨識結果，實際應用時需要整合真實的 OCR API
    if (ocrData.name) setName(ocrData.name);
    if (ocrData.company) setCompanyName(ocrData.company);
    if (ocrData.jobTitle) setJobTitle(ocrData.jobTitle);
    if (ocrData.phone) setPhone(ocrData.phone);
    if (ocrData.email) setEmail(ocrData.email);
    if (ocrData.address) setAddress(ocrData.address);
    
    setShowOCRCapture(false);
    toast({
      title: "名片辨識完成",
      description: "已自動填入辨識到的資訊，請檢查並修正。"
    });
  };

  // 語音錄製處理
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // 這裡可以整合語音轉文字 API
        setIntroduction(prev => prev + " [語音錄製內容]");
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "錄音失敗",
        description: "無法啟動麥克風，請檢查權限設定。"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // 社群媒體處理
  const handleAddSocialMedia = () => {
    setShowSocialMediaForm(true);
    setNewSocialMedia({platform: '', url: ''});
  };

  const handleSaveSocialMedia = () => {
    if (newSocialMedia.platform && newSocialMedia.url) {
      const newItem = {
        id: Date.now().toString(),
        platform: newSocialMedia.platform,
        url: newSocialMedia.url,
        visible: true
      };
      setSocialMedia(prev => [...prev, newItem]);
      setShowSocialMediaForm(false);
      setNewSocialMedia({platform: '', url: ''});
    }
  };

  const handleRemoveSocialMedia = (id: string) => {
    setSocialMedia(prev => prev.filter(item => item.id !== id));
  };

  const handleSocialMediaVisibilityChange = (id: string, visible: boolean) => {
    setSocialMedia(prev => prev.map(item => 
      item.id === id ? {...item, visible} : item
    ));
  };

  const handleEditSocialMedia = (item: {id: string, platform: string, url: string}) => {
    setEditingSocialMedia(item);
    setNewSocialMedia({platform: item.platform, url: item.url});
    setShowSocialMediaForm(true);
  };

  const handleUpdateSocialMedia = () => {
    if (editingSocialMedia && newSocialMedia.platform && newSocialMedia.url) {
      setSocialMedia(prev => prev.map(item => 
        item.id === editingSocialMedia.id 
          ? {...item, platform: newSocialMedia.platform, url: newSocialMedia.url}
          : item
      ));
      setEditingSocialMedia(null);
      setShowSocialMediaForm(false);
      setNewSocialMedia({platform: '', url: ''});
    }
  };

  const handleCancelSocialMediaEdit = () => {
    setEditingSocialMedia(null);
    setShowSocialMediaForm(false);
    setNewSocialMedia({platform: '', url: ''});
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
      mobilePhone,
      mobilePhoneVisible,
      email,
      emailVisible,
      emailVerified,
      emailVerificationSent,
      website,
      websiteVisible,
      address,
      addressVisible,
      introduction,
      introductionVisible,
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
      cardPublic,
      socialMedia,
      otherInfo,
      otherInfoVisible
    };
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    
    // 觸發自定義事件，通知其他組件資料已更新
    window.dispatchEvent(new CustomEvent('cardDataUpdated'));
    
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
    setShowInstagramTutorial(!showInstagramTutorial);
  };

  const showInstagramHelpOld = () => {
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

        {/* 電子名片設定區塊 */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">電子名片設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 max-w-full overflow-hidden">
            {/* 照片上傳 */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                {photo ? (
                  <AvatarImage src={photo} alt="照片" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700 font-semibold text-lg">
                    {name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <Label htmlFor="photo-upload" className="text-sm font-semibold text-gray-700 mb-2 block">
                    上傳頭像
                  </Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      選擇照片
                    </label>
                    {photo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 mr-1" />
                        移除
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* OCR 名片辨識 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
              <Button
                onClick={handleOCRCapture}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                OCR 名片辨識
              </Button>
              <p className="text-xs text-gray-600 mt-3 text-center leading-relaxed">
                拍攝您的紙本名片，自動識別並填入資訊
              </p>
            </div>

            {/* 自我介紹欄位 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="introduction" className="text-sm font-medium text-gray-700">
                  自我介紹
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={introductionVisible}
                    onCheckedChange={setIntroductionVisible}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  id="introduction"
                  placeholder="請輸入自我介紹..."
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center space-x-2">
                  {!isRecording ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={startRecording}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      語音輸入
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      停止錄音 ({recordingTime}s)
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 姓名 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  姓名 <span className="text-red-500">*</span>
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
                  公司名稱 <span className="text-red-500">*</span>
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

            {/* 公司電話 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  公司電話 <span className="text-red-500">*</span>
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
                placeholder="公司聯絡電話"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                填入公司主要聯絡電話或名片上的電話號碼
              </p>
            </div>

            {/* 手機號碼 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-phone" className="text-sm font-medium text-gray-700">
                  手機號碼 <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={mobilePhoneVisible}
                    onCheckedChange={setMobilePhoneVisible}
                  />
                </div>
              </div>
              <Input
                id="mobile-phone"
                type="tel"
                placeholder="您的手機號碼"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                預設為註冊時的手機號碼
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
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
              
              {/* LINE Tutorial */}
              {showLineTutorial && (
                <Card className="mt-2 bg-blue-50 border-blue-200 animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-3">
                        <h4 className="font-medium text-blue-900">LINE URL 設置說明</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-blue-800 mb-1">📱 iOS用戶：</p>
                            <p className="text-blue-700 text-sm leading-relaxed">
                              進入LINE主頁 → 加入好友 → 透過社群/郵件等方式宣傳帳號 → 選擇「網址」→ 複製網址URL
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-800 mb-1">🤖 Android用戶：</p>
                            <p className="text-blue-700 text-sm leading-relaxed">
                              進入LINE主頁 → 點右上角「人像＋」圖示 → 點行動條碼 → 顯示行動條碼 → 選擇一位朋友分享 → 進入對話視窗即可看到專屬連結和QR Code
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
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

              {/* Instagram Tutorial */}
              {showInstagramTutorial && (
                <Card className="mt-2 bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900">Instagram URL 設置說明</h4>
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-2">iOS / Android 用戶：</p>
                          <p>開啟 Instagram App → 進入您的 個人頁 / 粉專 →點分享個人檔案 →「複製連結」，即可取得您的 Instagram 專屬網址</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 新增社群媒體 */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">社群媒體</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddSocialMedia}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增社群
                </Button>
              </div>

              {/* 顯示已新增的社群媒體 */}
              {socialMedia.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {item.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                    {item.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
                    {item.platform === 'threads' && <span className="text-lg">🧵</span>}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm capitalize">{item.platform}</p>
                      <p className="text-xs text-gray-500 truncate w-full" style={{
                        wordBreak: 'break-all',
                        overflowWrap: 'break-word',
                        maxWidth: '100%'
                      }}>{item.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <Switch
                      checked={item.visible}
                      onCheckedChange={(visible) => handleSocialMediaVisibilityChange(item.id, visible)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditSocialMedia(item)}
                      className="text-blue-500 hover:bg-blue-50 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveSocialMedia(item.id)}
                      className="text-red-500 hover:bg-red-50 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* 社群媒體新增/編輯表單 */}
              {showSocialMediaForm && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <h4 className="font-medium text-sm text-gray-800">
                    {editingSocialMedia ? '編輯社群媒體' : '新增社群媒體'}
                  </h4>
                  <Select value={newSocialMedia.platform} onValueChange={(value) => setNewSocialMedia(prev => ({...prev, platform: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇社群平台" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="threads">Threads</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="請輸入完整網址（如：https://...）"
                    value={newSocialMedia.url}
                    onChange={(e) => setNewSocialMedia(prev => ({...prev, url: e.target.value}))}
                    className="w-full"
                    style={{ 
                      wordBreak: 'break-all',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  />
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={editingSocialMedia ? handleUpdateSocialMedia : handleSaveSocialMedia}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {editingSocialMedia ? '更新' : '確認新增'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={editingSocialMedia ? handleCancelSocialMediaEdit : () => setShowSocialMediaForm(false)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 其他資訊 */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="other-info" className="text-sm font-medium text-gray-700">
                  其他資訊
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setOtherInfo('')}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增其他
                  </Button>
                  <Label className="text-xs text-gray-500">公開</Label>
                  <Switch
                    checked={otherInfoVisible}
                    onCheckedChange={setOtherInfoVisible}
                  />
                </div>
              </div>
              <Textarea
                id="other-info"
                placeholder="可補充其他相關資訊、備註等..."
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
                rows={3}
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
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
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
                {introduction && introductionVisible && (
                  <div className="bg-white/10 p-2 rounded text-xs mb-3">
                    <span className="mr-2">💬</span>
                    <span>{introduction}</span>
                  </div>
                )}
                {phone && phoneVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{phone}</span>
                  </div>
                )}
                {mobilePhone && mobilePhoneVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{mobilePhone}</span>
                  </div>
                )}
                {email && emailVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{email}</span>
                  </div>
                )}
                {website && websiteVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{website}</span>
                  </div>
                )}
                {address && addressVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{address}</span>
                  </div>
                )}
                {birthday && birthdayVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{formatBirthdayDisplay(birthday)}</span>
                  </div>
                )}
                {gender && genderVisible && (
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
                    <span className="truncate">{getGenderDisplay(gender)}</span>
                  </div>
                )}
              </div>

              {/* 社群資訊 */}
              {((line && lineVisible) || (facebook && facebookVisible) || (instagram && instagramVisible)) && (
                <div className="mt-4 pt-4 border-t border-green-300/50">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {line && lineVisible && (
                      <button
                        onClick={() => window.open(line, '_blank')}
                        className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5 text-white" />
                      </button>
                    )}
                    {facebook && facebookVisible && (
                      <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {instagram && instagramVisible && (
                      <div className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {/* 新增的社群媒體 */}
                    {socialMedia.filter(item => item.visible).map((item) => (
                      <div key={item.id} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer ${
                        item.platform === 'youtube' ? 'bg-red-600 hover:bg-red-700' :
                        item.platform === 'linkedin' ? 'bg-blue-700 hover:bg-blue-800' :
                        item.platform === 'threads' ? 'bg-gray-800 hover:bg-gray-900' :
                        'bg-gray-600 hover:bg-gray-700'
                      }`}>
                        {item.platform === 'youtube' && <Youtube className="w-5 h-5 text-white" />}
                        {item.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-white" />}
                        {item.platform === 'threads' && <MessageCircle className="w-5 h-5 text-white" />}
                      </div>
                    ))}
                  </div>
                  {otherInfo && otherInfoVisible && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-xs bg-white/10 p-2 rounded">
                        <span className="mr-2">📝</span>
                        <span>{otherInfo}</span>
                      </div>
                    </div>
                  )}
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

        {/* OCR 名片辨識模態框 */}
        {showOCRCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">名片辨識</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOCRCapture(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">將名片置於框內拍攝</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      // 模擬 OCR 辨識結果
                      handleOCRResult({
                        name: '王小明',
                        company: 'AI科技股份有限公司',
                        jobTitle: '產品經理',
                        phone: '02-1234-5678',
                        email: 'wang@aitech.com',
                        address: '台北市信義區信義路五段7號'
                      });
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    拍攝辨識
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowOCRCapture(false)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  請確保名片清晰可見，避免反光和陰影
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCard;
