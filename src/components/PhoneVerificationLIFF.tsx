import React, { useState } from 'react';
import { ArrowLeft, X, Phone, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PhoneVerificationLIFFProps {
  onClose: () => void;
  onVerificationComplete: (phoneNumber: string) => void;
}

const PhoneVerificationLIFF: React.FC<PhoneVerificationLIFFProps> = ({ 
  onClose, 
  onVerificationComplete 
}) => {
  const [step, setStep] = useState(1); // 1: 註冊頁面, 2: OTP驗證
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartRegistration = () => {
    if (!phoneNumber || !agreedToTerms || !agreedToPrivacy) {
      alert('請填寫手機號碼並同意相關規範');
      return;
    }

    // 驗證手機號碼格式
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('請輸入正確的手機號碼格式（09xxxxxxxx）');
      return;
    }

    setIsLoading(true);
    
    // 模擬發送 OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      alert('請輸入6位數驗證碼');
      return;
    }

    setIsLoading(true);
    
    // 模擬 OTP 驗證
    setTimeout(() => {
      setIsLoading(false);
      
      // 儲存註冊狀態和用戶資料
      localStorage.setItem('aicard-user-registered', 'true');
      const userData = {
        phone: phoneNumber,
        lineNickname: `User${Date.now().toString().slice(-4)}`, // 模擬 LINE 暱稱
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('aile-user-data', JSON.stringify(userData));
      
      // 建立預設電子名片
      const defaultCard = {
        name: userData.lineNickname,
        companyName: '',
        phone: phoneNumber,
        email: '',
        website: '',
        line: '',
        facebook: '',
        instagram: '',
        photo: null,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('aile-card-data', JSON.stringify(defaultCard));
      
      // 完成註冊
      onVerificationComplete(phoneNumber);
      
      // 觸發註冊完成事件
      window.dispatchEvent(new CustomEvent('registrationCompleted'));
      
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-sm mx-auto border-x border-border">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground px-4 py-3 shadow-md flex-shrink-0 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-primary-foreground hover:bg-white/20 p-2 min-w-[44px] min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-base sm:text-lg">
              {step === 1 ? '註冊 AiCard' : '手機驗證'}
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="text-primary-foreground hover:bg-white/20 p-2 min-w-[44px] min-h-[44px]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-6 safe-area-bottom">
        {step === 1 && (
          <div className="w-full space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-3 px-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full mx-auto flex items-center justify-center">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">歡迎加入 AiCard</h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                立即註冊，打造您的專屬智能電子名片
              </p>
            </div>

            {/* Phone Input */}
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                手機號碼
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-11 h-12 sm:h-14 text-base sm:text-lg border-2 focus:border-primary"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground px-1">
                我們將發送驗證碼到此手機號碼
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-4 px-1">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1 min-w-[20px] min-h-[20px]"
                />
                <label htmlFor="terms" className="text-sm text-foreground leading-relaxed cursor-pointer">
                  我已閱讀並同意 <span className="text-primary underline">服務條款</span>
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                  className="mt-1 min-w-[20px] min-h-[20px]"
                />
                <label htmlFor="privacy" className="text-sm text-foreground leading-relaxed cursor-pointer">
                  我已閱讀並同意 <span className="text-primary underline">隱私權政策</span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <div className="pt-2">
              <Button
                onClick={handleStartRegistration}
                disabled={!phoneNumber || !agreedToTerms || !agreedToPrivacy || isLoading}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium text-base sm:text-lg rounded-xl shadow-lg disabled:opacity-50"
              >
                {isLoading ? '發送驗證碼中...' : '開始註冊'}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full space-y-6">
            {/* Verification Section */}
            <div className="text-center space-y-3 px-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-primary rounded-full mx-auto flex items-center justify-center">
                <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">手機驗證</h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                驗證碼已發送至<br />
                <span className="font-medium text-primary">{phoneNumber}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-3">
              <Label htmlFor="otp" className="text-sm font-medium text-foreground">
                驗證碼
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="請輸入6位數驗證碼"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-xl sm:text-2xl font-mono h-14 sm:h-16 tracking-widest border-2 focus:border-primary"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground text-center px-1">
                沒收到驗證碼？<span className="text-primary underline cursor-pointer">重新發送</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Verify Button */}
              <Button
                onClick={handleVerifyOTP}
                disabled={!otp || otp.length !== 6 || isLoading}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-medium text-base sm:text-lg rounded-xl shadow-lg disabled:opacity-50"
              >
                {isLoading ? '驗證中...' : '完成驗證'}
              </Button>

              {/* Back Button */}
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full h-12 sm:h-14 border-2 border-border text-foreground hover:bg-secondary font-medium text-base sm:text-lg rounded-xl"
              >
                返回修改手機號碼
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerificationLIFF;