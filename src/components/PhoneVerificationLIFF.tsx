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
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">
              {step === 1 ? '註冊 AiCard' : '手機驗證'}
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {step === 1 && (
          <div className="max-w-md mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">歡迎加入 AiCard</h2>
              <p className="text-gray-600">
                立即註冊，打造您的專屬智能電子名片
              </p>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                手機號碼
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-11 h-12 text-lg"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-500">
                我們將發送驗證碼到此手機號碼
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  我已閱讀並同意 <span className="text-blue-600 underline cursor-pointer">服務條款</span>
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">
                  我已閱讀並同意 <span className="text-blue-600 underline cursor-pointer">隱私權政策</span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <Button
              onClick={handleStartRegistration}
              disabled={!phoneNumber || !agreedToTerms || !agreedToPrivacy || isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium text-lg rounded-xl"
            >
              {isLoading ? '發送驗證碼中...' : '開始註冊'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-md mx-auto space-y-6">
            {/* Verification Section */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">手機驗證</h2>
              <p className="text-gray-600">
                驗證碼已發送至<br />
                <span className="font-medium text-blue-600">{phoneNumber}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                驗證碼
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="請輸入6位數驗證碼"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl font-mono h-14 tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">
                沒收到驗證碼？<span className="text-blue-600 underline cursor-pointer">重新發送</span>
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
              disabled={!otp || otp.length !== 6 || isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium text-lg rounded-xl"
            >
              {isLoading ? '驗證中...' : '完成驗證'}
            </Button>

            {/* Back Button */}
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-700 font-medium text-lg rounded-xl"
            >
              返回修改手機號碼
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerificationLIFF;