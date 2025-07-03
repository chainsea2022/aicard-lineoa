import React, { useState } from 'react';
import { ArrowLeft, Upload, Eye, Save, User, Building, Phone, Mail, Globe, Camera, ChevronRight, Edit, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';

interface CreateCardProps {
  onClose: () => void;
}

interface CardData {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  line: string;
  facebook: string;
  instagram: string;
  photo: string | null;
}

interface UserData {
  phone: string;
  email: string;
  name: string;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose }) => {
  const [step, setStep] = useState<'home' | 'register' | 'login' | 'otp' | 'create' | 'preview' | 'settings'>('home');
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('aile-user-registered') === 'true';
  });
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('aile-user-data');
    return saved ? JSON.parse(saved) : { phone: '', email: '', name: '' };
  });
  const [cardData, setCardData] = useState<CardData>(() => {
    const saved = localStorage.getItem('aile-card-data');
    return saved ? JSON.parse(saved) : {
      companyName: '',
      name: '',
      phone: '',
      email: '',
      website: '',
      line: '',
      facebook: '',
      instagram: '',
      photo: null,
    };
  });
  const [otp, setOtp] = useState('');
  const [phoneForOtp, setPhoneForOtp] = useState('');
  const [tempUserData, setTempUserData] = useState<UserData>(userData);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    setUserData({ phone, email, name });
    setPhoneForOtp(phone);
    setStep('otp');
    toast({
      title: "OTP 驗證碼已發送",
      description: `驗證碼已發送至 ${phone}`,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const phone = formData.get('phone') as string;
    
    // 模擬檢查是否為已註冊用戶
    const savedUserData = localStorage.getItem('aile-user-data');
    if (savedUserData) {
      const existingUser = JSON.parse(savedUserData);
      if (existingUser.phone === phone) {
        setPhoneForOtp(phone);
        setStep('otp');
        toast({
          title: "OTP 驗證碼已發送",
          description: `驗證碼已發送至 ${phone}`,
        });
        return;
      }
    }
    
    // 如果找不到用戶資料
    toast({
      title: "找不到帳號",
      description: "此手機號碼尚未註冊，請先註冊帳號。",
    });
  };

  const handleOtpVerify = () => {
    if (otp.length === 6) {
      const savedUserData = localStorage.getItem('aile-user-data');
      const savedCardData = localStorage.getItem('aile-card-data');
      
      if (savedUserData) {
        const existingUser = JSON.parse(savedUserData);
        setUserData(existingUser);
        
        if (savedCardData) {
          const existingCard = JSON.parse(savedCardData);
          setCardData(existingCard);
        }
      }
      
      setIsRegistered(true);
      localStorage.setItem('aile-user-registered', 'true');
      
      // 檢查是否有已建立的電子名片
      if (savedCardData && JSON.parse(savedCardData).name) {
        setStep('home'); // 回到首頁顯示已建立的名片
        toast({
          title: "登入成功！",
          description: "歡迎回來，您的電子名片已載入。",
        });
      } else {
        setStep('create'); // 如果沒有名片則進入建立頁面
        toast({
          title: "登入成功！",
          description: "現在您可以建立您的電子名片了。",
        });
      }
    } else {
      toast({
        title: "驗證失敗",
        description: "請輸入完整的 6 位數驗證碼",
      });
    }
  };

  const handleLogout = () => {
    // 清除所有本地存儲的資料
    localStorage.removeItem('aile-user-registered');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aile-card-data');
    
    // 重設狀態
    setIsRegistered(false);
    setUserData({ phone: '', email: '', name: '' });
    setCardData({
      companyName: '',
      name: '',
      phone: '',
      email: '',
      website: '',
      line: '',
      facebook: '',
      instagram: '',
      photo: null,
    });
    setStep('home');
    
    toast({
      title: "已登出",
      description: "您已成功登出，所有資料已清除。",
    });
  };

  const handleSaveSettings = () => {
    setUserData(tempUserData);
    localStorage.setItem('aile-user-data', JSON.stringify(tempUserData));
    setStep('home');
    toast({
      title: "設定已儲存",
      description: "您的個人資訊已更新。",
    });
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    toast({
      title: "名片已儲存！",
      description: "您的電子名片已成功建立並儲存。",
    });
    setStep('home');
  };

  const hasCardData = () => {
    return cardData.name || cardData.companyName || cardData.phone || cardData.email;
  };

  const renderHome = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">建立電子名片</h2>
      
      {/* 設定區塊 (已註冊會員) */}
      {isRegistered && (
        <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setStep('settings')}
            className="w-full p-4 flex items-center justify-between hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-green-800">設定</h3>
                <p className="text-sm text-green-600">{userData.name}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>
        </div>
      )}

      {/* 電子名片預覽區塊 */}
      {hasCardData() && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-800">已建立的電子名片</h3>
            <Button
              onClick={() => setStep('create')}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-600 hover:bg-blue-100"
            >
              <Edit className="w-4 h-4 mr-1" />
              編輯
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white text-sm">
            <div className="flex items-center space-x-3 mb-3">
              {cardData.photo && (
                <img
                  src={cardData.photo}
                  alt="照片"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
              )}
              <div>
                <h4 className="font-bold">{cardData.name || '未填寫'}</h4>
                <p className="text-blue-100 text-xs">{cardData.companyName || '未填寫'}</p>
              </div>
            </div>
            
            <div className="space-y-1 text-xs">
              {cardData.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3" />
                  <span>{cardData.phone}</span>
                </div>
              )}
              {cardData.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>{cardData.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="space-y-3">
        {!isRegistered && (
          <>
            <Button
              onClick={() => setStep('register')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              開始註冊並建立名片
            </Button>
            
            <Button
              onClick={() => setStep('login')}
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50"
            >
              <LogIn className="w-4 h-4 mr-2" />
              已有帳號？立即登入
            </Button>
          </>
        )}
        
        {isRegistered && (
          <Button
            onClick={() => setStep('create')}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {hasCardData() ? '編輯電子名片' : '建立電子名片'}
          </Button>
        )}
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">會員登入</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="login-phone">手機號碼</Label>
          <Input
            id="login-phone"
            name="phone"
            type="tel"
            placeholder="請輸入註冊時的手機號碼"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
          <LogIn className="w-4 h-4 mr-2" />
          發送登入驗證碼
        </Button>
      </form>
      
      <div className="text-center">
        <Button
          onClick={() => setStep('register')}
          variant="link"
          className="text-blue-500 hover:text-blue-600"
        >
          還沒有帳號？立即註冊
        </Button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">帳戶設定</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="settings-phone">手機號碼</Label>
          <Input
            id="settings-phone"
            type="tel"
            value={tempUserData.phone}
            onChange={(e) => setTempUserData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="settings-email">電子信箱</Label>
          <Input
            id="settings-email"
            type="email"
            value={tempUserData.email}
            onChange={(e) => setTempUserData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="settings-name">姓名</Label>
          <Input
            id="settings-name"
            type="text"
            value={tempUserData.name}
            onChange={(e) => setTempUserData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleSaveSettings}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          <Save className="w-4 h-4 mr-2" />
          儲存設定
        </Button>
        
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          登出
        </Button>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">會員註冊</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="register-phone">手機號碼</Label>
          <Input
            id="register-phone"
            name="phone"
            type="tel"
            placeholder="請輸入手機號碼"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="register-email">電子信箱</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="請輸入電子信箱"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="register-name">姓名</Label>
          <Input
            id="register-name"
            name="name"
            type="text"
            placeholder="請輸入姓名"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          發送 OTP 驗證碼
        </Button>
      </form>
      
      <div className="text-center">
        <Button
          onClick={() => setStep('login')}
          variant="link"
          className="text-green-500 hover:text-green-600"
        >
          已有帳號？立即登入
        </Button>
      </div>
    </div>
  );

  const renderOtpForm = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">手機驗證</h2>
      <p className="text-center text-gray-600">
        驗證碼已發送至<br />
        <span className="font-semibold text-blue-600">{phoneForOtp}</span>
      </p>
      
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleOtpVerify}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={otp.length !== 6}
        >
          驗證並完成
        </Button>
        
        <Button
          onClick={() => setStep(isRegistered ? 'login' : 'register')}
          variant="outline"
          className="w-full"
        >
          重新輸入手機號碼
        </Button>
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">建立電子名片</h2>
      
      {/* Photo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {cardData.photo ? (
            <img src={cardData.photo} alt="照片" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
            <Upload className="w-4 h-4" />
            <span className="text-sm">上傳照片</span>
          </div>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <Label>公司名稱</Label>
          <Input
            value={cardData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="輸入公司名稱"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>姓名</Label>
          <Input
            value={cardData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="輸入姓名"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>手機號碼</Label>
          <Input
            value={cardData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="輸入手機號碼"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>電子信箱</Label>
          <Input
            value={cardData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="輸入電子信箱"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>公司官網</Label>
          <Input
            value={cardData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.example.com"
            className="mt-1"
          />
        </div>
        
        <div className="space-y-3">
          <Label>社群設置</Label>
          <Input
            value={cardData.line}
            onChange={(e) => handleInputChange('line', e.target.value)}
            placeholder="LINE ID"
            className="mt-1"
          />
          <Input
            value={cardData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            placeholder="Facebook 連結"
            className="mt-1"
          />
          <Input
            value={cardData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder="Instagram 連結"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => setStep('preview')}
          variant="outline"
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          預覽
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          <Save className="w-4 h-4 mr-2" />
          儲存
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">名片預覽</h2>
      
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          {cardData.photo && (
            <img
              src={cardData.photo}
              alt="照片"
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          )}
          <div>
            <h3 className="text-xl font-bold">{cardData.name || '姓名'}</h3>
            <p className="text-blue-100">{cardData.companyName || '公司名稱'}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {cardData.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{cardData.phone}</span>
            </div>
          )}
          {cardData.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{cardData.email}</span>
            </div>
          )}
          {cardData.website && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{cardData.website}</span>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {(cardData.line || cardData.facebook || cardData.instagram) && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-100 mb-2">社群媒體</p>
            <div className="space-y-1 text-sm">
              {cardData.line && <div>LINE: {cardData.line}</div>}
              {cardData.facebook && <div>Facebook: {cardData.facebook}</div>}
              {cardData.instagram && <div>Instagram: {cardData.instagram}</div>}
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => setStep('create')}
          variant="outline"
          className="flex-1"
        >
          編輯
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          <Save className="w-4 h-4 mr-2" />
          儲存名片
        </Button>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (step === 'settings') {
                setTempUserData(userData); // 重設暫存資料
                setStep('home');
              } else {
                onClose();
              }
            }}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">
            {step === 'settings' ? '帳戶設定' : step === 'login' ? '會員登入' : '建立電子名片'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {step === 'home' && renderHome()}
        {step === 'settings' && renderSettings()}
        {step === 'register' && renderRegisterForm()}
        {step === 'login' && renderLoginForm()}
        {step === 'otp' && renderOtpForm()}
        {step === 'create' && renderCreateForm()}
        {step === 'preview' && renderPreview()}
      </div>
    </div>
  );
};

export default CreateCard;
