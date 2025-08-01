import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Camera, Mic, Square, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete: () => void;
  userData: any;
}

const CreateCardSimplified: React.FC<CreateCardProps> = ({
  onClose,
  onRegistrationComplete,
  userData
}) => {
  // 基本資訊狀態
  const [name, setName] = useState('');
  const [nameVisible, setNameVisible] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [companyNameVisible, setCompanyNameVisible] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [jobTitleVisible, setJobTitleVisible] = useState(true);
  const [phone, setPhone] = useState('');
  const [phoneVisible, setPhoneVisible] = useState(true);
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobilePhoneVisible, setMobilePhoneVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVisible, setEmailVisible] = useState(false);
  const [website, setWebsite] = useState('');
  const [websiteVisible, setWebsiteVisible] = useState(true);
  const [address, setAddress] = useState('');
  const [addressVisible, setAddressVisible] = useState(true);
  const [introduction, setIntroduction] = useState('');
  const [introductionVisible, setIntroductionVisible] = useState(true);

  // 社群媒體
  const [line, setLine] = useState('');
  const [lineVisible, setLineVisible] = useState(true);
  const [facebook, setFacebook] = useState('');
  const [facebookVisible, setFacebookVisible] = useState(true);
  const [instagram, setInstagram] = useState('');
  const [instagramVisible, setInstagramVisible] = useState(true);

  // UI 狀態
  const [photo, setPhoto] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showLineTutorial, setShowLineTutorial] = useState(false);
  const [showFacebookTutorial, setShowFacebookTutorial] = useState(false);
  const [showInstagramTutorial, setShowInstagramTutorial] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 照片上傳處理
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto('');
  };

  // OCR 處理
  const handleOCRCapture = () => {
    toast({
      title: "OCR 功能",
      description: "OCR 名片辨識功能開發中...",
    });
  };

  // 語音輸入處理
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        // 處理錄音數據
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      };
    } catch (error) {
      toast({
        title: "錄音失敗",
        description: "無法啟動麥克風，請檢查權限設定",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // 儲存處理
  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "請填入姓名",
        description: "姓名為必填欄位",
        variant: "destructive"
      });
      return;
    }

    const cardData = {
      name, nameVisible,
      companyName, companyNameVisible,
      jobTitle, jobTitleVisible,
      phone, phoneVisible,
      mobilePhone, mobilePhoneVisible,
      email, emailVisible,
      website, websiteVisible,
      address, addressVisible,
      introduction, introductionVisible,
      line, lineVisible,
      facebook, facebookVisible,
      instagram, instagramVisible,
      photo
    };

    localStorage.setItem('businessCardData', JSON.stringify(cardData));
    
    toast({
      title: "儲存成功",
      description: "名片資料已儲存完成"
    });

    onRegistrationComplete();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-background z-10">
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 px-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回
        </Button>
        <h1 className="text-lg font-semibold">名片列表</h1>
        <Button onClick={handleSave} size="sm" className="h-8 px-3">
          <Save className="w-4 h-4 mr-1" />
          儲存
        </Button>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">電子名片設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {/* 照片與基本資訊 */}
            <div className="flex items-center gap-4 p-3 bg-accent/30 rounded-lg">
              <Avatar className="w-14 h-14 flex-shrink-0">
                {photo ? <AvatarImage src={photo} alt="照片" /> : <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {name?.charAt(0) || 'U'}
                  </AvatarFallback>}
              </Avatar>
              <div className="flex-1 min-w-0">
                <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <div className="flex items-center gap-2">
                  <label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-background border rounded-md text-sm hover:bg-accent/50 transition-colors">
                    <Upload className="w-3 h-3 mr-1.5" />
                    選擇照片
                  </label>
                  {photo && <Button variant="ghost" size="sm" onClick={handleRemovePhoto} className="text-destructive h-7 px-2">
                      <X className="w-3 h-3" />
                    </Button>}
                  <Button onClick={handleOCRCapture} size="sm" className="h-7 px-3 text-xs">
                    <Camera className="w-3 h-3 mr-1" />
                    名片掃描
                  </Button>
                </div>
              </div>
            </div>

            {/* 基本資訊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name" className="text-sm font-medium">
                    姓名 <span className="text-destructive">*</span>
                  </Label>
                  <Switch checked={nameVisible} onCheckedChange={setNameVisible} className="scale-75" />
                </div>
                <Input id="name" placeholder="您的姓名" value={name} onChange={e => setName(e.target.value)} className="h-9" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="job-title" className="text-sm font-medium">職稱</Label>
                  <Switch checked={jobTitleVisible} onCheckedChange={setJobTitleVisible} className="scale-75" />
                </div>
                <Input id="job-title" placeholder="您的職稱" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="company-name" className="text-sm font-medium">公司名稱</Label>
                <Switch checked={companyNameVisible} onCheckedChange={setCompanyNameVisible} className="scale-75" />
              </div>
              <Input id="company-name" placeholder="您的公司名稱" value={companyName} onChange={e => setCompanyName(e.target.value)} className="h-9" />
            </div>

            {/* 聯絡資訊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phone" className="text-sm font-medium">公司電話</Label>
                  <Switch checked={phoneVisible} onCheckedChange={setPhoneVisible} className="scale-75" />
                </div>
                <Input id="phone" type="tel" placeholder="公司電話" value={phone} onChange={e => setPhone(e.target.value)} className="h-9" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mobile-phone" className="text-sm font-medium">手機</Label>
                  <Switch checked={mobilePhoneVisible} onCheckedChange={setMobilePhoneVisible} className="scale-75" />
                </div>
                <Input id="mobile-phone" type="tel" placeholder="手機號碼" value={mobilePhone} onChange={e => setMobilePhone(e.target.value)} className="h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Switch checked={emailVisible} onCheckedChange={setEmailVisible} className="scale-75" />
              </div>
              <Input id="email" type="email" placeholder="您的Email" value={email} onChange={e => setEmail(e.target.value)} className="h-9" />
            </div>

            {/* 其他資訊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="website" className="text-sm font-medium">網站</Label>
                  <Switch checked={websiteVisible} onCheckedChange={setWebsiteVisible} className="scale-75" />
                </div>
                <Input id="website" type="url" placeholder="您的網站" value={website} onChange={e => setWebsite(e.target.value)} className="h-9" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="address" className="text-sm font-medium">地址</Label>
                  <Switch checked={addressVisible} onCheckedChange={setAddressVisible} className="scale-75" />
                </div>
                <Input id="address" placeholder="您的地址" value={address} onChange={e => setAddress(e.target.value)} className="h-9" />
              </div>
            </div>

            {/* 自我介紹 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="introduction" className="text-sm font-medium">自我介紹</Label>
                <div className="flex items-center gap-2">
                  {!isRecording ? <Button type="button" size="sm" variant="outline" onClick={startRecording} className="h-7 px-2 text-xs">
                      <Mic className="w-3 h-3 mr-1" />
                      語音
                    </Button> : <Button type="button" size="sm" variant="destructive" onClick={stopRecording} className="h-7 px-2 text-xs">
                      <Square className="w-3 h-3 mr-1" />
                      {recordingTime}s
                    </Button>}
                  <Switch checked={introductionVisible} onCheckedChange={setIntroductionVisible} className="scale-75" />
                </div>
              </div>
              <Textarea id="introduction" placeholder="請輸入自我介紹..." value={introduction} onChange={e => setIntroduction(e.target.value)} rows={2} className="text-sm" />
            </div>

            {/* 社群媒體 */}
            <div className="space-y-3 pt-2 border-t">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="line" className="text-sm font-medium">LINE</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowLineTutorial(!showLineTutorial)} className="h-5 w-5 p-0">
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                  <Switch checked={lineVisible} onCheckedChange={setLineVisible} className="scale-75" />
                </div>
                <Input id="line" type="url" placeholder="LINE個人網址" value={line} onChange={e => setLine(e.target.value)} className="h-9" />
                {showLineTutorial && <div className="text-xs text-muted-foreground bg-accent/50 p-2 rounded border">
                    <p><strong>iOS:</strong> LINE主頁 → 加入好友 → 透過網址分享</p>
                    <p><strong>Android:</strong> LINE主頁 → 人像+ → 行動條碼 → 分享連結</p>
                  </div>}
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowFacebookTutorial(!showFacebookTutorial)} className="h-5 w-5 p-0">
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                  <Switch checked={facebookVisible} onCheckedChange={setFacebookVisible} className="scale-75" />
                </div>
                <Input id="facebook" placeholder="Facebook用戶名稱或連結" value={facebook} onChange={e => setFacebook(e.target.value)} className="h-9" />
                {showFacebookTutorial && <div className="text-xs text-muted-foreground bg-accent/50 p-2 rounded border">
                    個人/粉專頁面 → ⋯ → 複製連結
                  </div>}
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowInstagramTutorial(!showInstagramTutorial)} className="h-5 w-5 p-0">
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                  <Switch checked={instagramVisible} onCheckedChange={setInstagramVisible} className="scale-75" />
                </div>
                <Input id="instagram" placeholder="Instagram用戶名稱或連結" value={instagram} onChange={e => setInstagram(e.target.value)} className="h-9" />
                {showInstagramTutorial && <div className="text-xs text-muted-foreground bg-accent/50 p-2 rounded border">
                    個人頁面 → ⋯ → 複製個人檔案網址
                  </div>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCardSimplified;