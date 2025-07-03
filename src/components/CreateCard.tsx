import React, { useState } from 'react';
import { ArrowLeft, Upload, Eye, Save, User, Building, Phone, Mail, Globe, Camera, ChevronRight, Edit, Settings, LogOut, LogIn, QrCode, Share2, BarChart3, Send, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [step, setStep] = useState<'home' | 'register' | 'login' | 'otp' | 'create' | 'preview' | 'settings' | 'edit-profile' | 'edit-card' | 'analytics'>('home');
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
  const [tempCardData, setTempCardData] = useState<CardData>(cardData);
  const [cardExpanded, setCardExpanded] = useState(false);

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
    
    // 檢查是否為已註冊用戶
    const savedUserData = localStorage.getItem('aile-user-data');
    if (savedUserData) {
      const existingUser = JSON.parse(savedUserData);
      if (existingUser.phone === phone) {
        // 載入用戶資料和名片資料
        const savedCardData = localStorage.getItem('aile-card-data');
        
        setUserData(existingUser);
        setTempUserData(existingUser);
        
        if (savedCardData) {
          const existingCard = JSON.parse(savedCardData);
          setCardData(existingCard);
          setTempCardData(existingCard);
        }
        
        setIsRegistered(true);
        localStorage.setItem('aile-user-registered', 'true');
        
        // 登入成功，直接回到首頁（會顯示會員中心內容）
        setStep('home');
        toast({
          title: "登入成功！",
          description: "歡迎回來！",
        });
        return;
      }
    }
    
    // 如果找不到用戶資料，提示用戶先註冊
    toast({
      title: "找不到帳號",
      description: "請先註冊或確認手機號碼是否正確",
      variant: "destructive",
    });
  };

  const handleOtpVerify = () => {
    if (otp.length === 6) {
      // 儲存用戶資料
      localStorage.setItem('aile-user-data', JSON.stringify(userData));
      setTempUserData(userData);
      
      // 使用用戶註冊的資料初始化名片
      const initialCardData = {
        companyName: '',
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        website: '',
        line: '',
        facebook: '',
        instagram: '',
        photo: null,
      };
      
      setCardData(initialCardData);
      setTempCardData(initialCardData);
      setIsRegistered(true);
      localStorage.setItem('aile-user-registered', 'true');
      
      // 註冊成功後進入建立名片頁面
      setStep('create');
      toast({
        title: "註冊成功！",
        description: "歡迎加入 AILE！請建立您的電子名片。",
      });
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
    setTempUserData({ phone: '', email: '', name: '' });
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
    setTempCardData({
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

  const handleSaveProfile = () => {
    setUserData(tempUserData);
    localStorage.setItem('aile-user-data', JSON.stringify(tempUserData));
    setStep('home');
    toast({
      title: "個人資料已更新",
      description: "您的個人資料已成功更新。",
    });
  };

  const handleSaveCard = () => {
    setCardData(tempCardData);
    localStorage.setItem('aile-card-data', JSON.stringify(tempCardData));
    setStep('home');
    toast({
      title: "電子名片已更新",
      description: "您的電子名片已成功更新。",
    });
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    setTempCardData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempCardData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    const shareUrl = `https://aile.app/card/${cardData?.name || 'user'}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${cardData?.name} 的電子名片`,
        text: `查看 ${cardData?.name} 的電子名片`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
    
    toast({
      title: "分享成功！",
      description: "您的電子名片連結已複製到剪貼板。",
    });
  };

  const hasCardData = () => {
    return cardData.name && (cardData.companyName || cardData.phone || cardData.email);
  };

  const isCardComplete = () => {
    return cardData.name && cardData.phone && cardData.email;
  };

  const renderHome = () => (
    <div className="p-6 space-y-6">
      {/* 未註冊會員的初始狀態 */}
      {!isRegistered && (
        <>
          <h2 className="text-xl font-bold text-center text-gray-800">建立電子名片</h2>
          <div className="space-y-3">
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
          </div>
        </>
      )}
      
      {/* 已註冊會員直接顯示會員中心內容 */}
      {isRegistered && (
        <>
          <h2 className="text-xl font-bold text-center text-gray-800">會員中心</h2>
          
          {/* 個人資料區塊 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setStep('edit-profile')}
              className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-blue-800">個人資料</h3>
                  <p className="text-sm text-blue-600">{userData.name}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          {/* 我的電子名片區塊 - 可展開預覽 */}
          {isCardComplete() ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">我的電子名片</h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setStep('edit-card')}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      編輯
                    </Button>
                    <Button
                      onClick={() => setCardExpanded(!cardExpanded)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      {cardExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* 名片預覽 */}
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
                      <h4 className="font-bold">{cardData.name}</h4>
                      <p className="text-blue-100 text-xs">{cardData.companyName || '個人名片'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3" />
                      <span>{cardData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3" />
                      <span>{cardData.email}</span>
                    </div>
                    {cardData.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-3 h-3" />
                        <span>{cardData.website}</span>
                      </div>
                    )}
                  </div>

                  {/* 展開的完整資訊 */}
                  {cardExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                      {/* 社群媒體 */}
                      {(cardData.line || cardData.facebook || cardData.instagram) && (
                        <div>
                          <p className="text-sm text-blue-100 mb-2">社群媒體</p>
                          <div className="space-y-1 text-xs">
                            {cardData.line && (
                              <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span>LINE: {cardData.line}</span>
                              </div>
                            )}
                            {cardData.facebook && (
                              <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                                <span>Facebook: {cardData.facebook}</span>
                              </div>
                            )}
                            {cardData.instagram && (
                              <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
                                <span>Instagram: {cardData.instagram}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* QR Code 區域 */}
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="w-20 h-20 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <QrCode className="w-12 h-12 text-gray-800" />
                        </div>
                        <p className="text-xs text-blue-100">掃描 QR Code 獲取名片</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Code 和分享按鈕 */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={() => {
                      setCardExpanded(!cardExpanded);
                      toast({ 
                        title: "QR Code", 
                        description: cardExpanded ? "QR Code 已隱藏" : "QR Code 已顯示" 
                      });
                    }}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    QR Code
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    分享
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">完成您的電子名片</h3>
              <p className="text-sm text-yellow-700 mb-3">您的電子名片尚未完成，請繼續建立。</p>
              <Button
                onClick={() => setStep('create')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                繼續建立電子名片
              </Button>
            </div>
          )}

          {/* 數據分析區塊 */}
          <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setStep('analytics')}
              className="w-full p-4 flex items-center justify-between hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-green-800">數據中心</h3>
                  <p className="text-sm text-green-600">查看名片互動數據</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-600" />
            </button>
          </div>

          {/* 登出按鈕 */}
          <div className="pt-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderEditProfile = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">編輯個人資料</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="profile-name">姓名</Label>
          <Input
            id="profile-name"
            type="text"
            value={tempUserData.name}
            onChange={(e) => setTempUserData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="profile-phone">手機號碼</Label>
          <Input
            id="profile-phone"
            type="tel"
            value={tempUserData.phone}
            onChange={(e) => setTempUserData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="profile-email">電子信箱</Label>
          <Input
            id="profile-email"
            type="email"
            value={tempUserData.email}
            onChange={(e) => setTempUserData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <Button
        onClick={handleSaveProfile}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        <Save className="w-4 h-4 mr-2" />
        儲存修改
      </Button>
    </div>
  );

  const renderEditCard = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">編輯電子名片</h2>
      
      {/* Photo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {tempCardData.photo ? (
            <img src={tempCardData.photo} alt="照片" className="w-full h-full object-cover" />
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
          <Label>姓名</Label>
          <Input
            value={tempCardData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="輸入姓名"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>公司名稱</Label>
          <Input
            value={tempCardData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="輸入公司名稱"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>手機號碼</Label>
          <Input
            value={tempCardData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="輸入手機號碼"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>電子信箱</Label>
          <Input
            value={tempCardData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="輸入電子信箱"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>公司官網</Label>
          <Input
            value={tempCardData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.example.com"
            className="mt-1"
          />
        </div>
        
        <div className="space-y-3">
          <Label>社群設置</Label>
          <Input
            value={tempCardData.line}
            onChange={(e) => handleInputChange('line', e.target.value)}
            placeholder="LINE ID"
            className="mt-1"
          />
          <Input
            value={tempCardData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            placeholder="Facebook 連結"
            className="mt-1"
          />
          <Input
            value={tempCardData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder="Instagram 連結"
            className="mt-1"
          />
        </div>
      </div>

      <Button
        onClick={handleSaveCard}
        className="w-full bg-green-500 hover:bg-green-600"
      >
        <Save className="w-4 h-4 mr-2" />
        儲存名片
      </Button>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">數據中心</h2>
      
      {/* 數據卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Send className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-blue-800 text-sm">名片發送</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">128</p>
          <p className="text-xs text-blue-500">次</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-green-800 text-sm">接受邀請</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">45</p>
          <p className="text-xs text-green-500">人</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-purple-800 text-sm">名片瀏覽</h3>
          <p className="text-2xl font-bold text-purple-600 mt-1">256</p>
          <p className="text-xs text-purple-500">次</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-orange-800 text-sm">互動率</h3>
          <p className="text-2xl font-bold text-orange-600 mt-1">35%</p>
          <p className="text-xs text-orange-500">轉換</p>
        </div>
      </div>

      {/* 最近活動 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">最近活動</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">張小明 查看了您的名片</span>
            <span className="text-gray-400 text-xs ml-auto">2小時前</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">李大華 接受了邀請</span>
            <span className="text-gray-400 text-xs ml-auto">5小時前</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">王小美 分享了您的名片</span>
            <span className="text-gray-400 text-xs ml-auto">1天前</span>
          </div>
        </div>
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
          登入
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
          onClick={() => {
            localStorage.setItem('aile-card-data', JSON.stringify(cardData));
            toast({
              title: "名片已儲存！",
              description: "您的電子名片已成功建立並儲存。",
            });
            setStep('home');
          }}
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
          onClick={() => {
            localStorage.setItem('aile-card-data', JSON.stringify(cardData));
            toast({
              title: "名片已儲存！",
              description: "您的電子名片已成功建立並儲存。",
            });
            setStep('home');
          }}
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
              if (step === 'home') {
                onClose();
              } else if (step === 'edit-profile' || step === 'edit-card' || step === 'analytics') {
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
            {step === 'home' ? (isRegistered ? '會員中心' : '建立電子名片') : 
             step === 'edit-profile' ? '編輯個人資料' :
             step === 'edit-card' ? '編輯電子名片' :
             step === 'analytics' ? '數據中心' :
             step === 'login' ? '會員登入' : '建立電子名片'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {step === 'home' && renderHome()}
        {step === 'edit-profile' && renderEditProfile()}
        {step === 'edit-card' && renderEditCard()}
        {step === 'analytics' && renderAnalytics()}
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
