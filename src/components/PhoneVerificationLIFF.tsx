import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Phone, Shield, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PhoneVerificationLIFFProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: () => void;
}

export const PhoneVerificationLIFF: React.FC<PhoneVerificationLIFFProps> = ({
  isOpen,
  onClose,
  onRegistrationComplete
}) => {
  const [step, setStep] = useState(1); // 1: 註冊, 2: OTP驗證, 3: 完成
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRegister = () => {
    if (!phoneNumber || !agreed) {
      toast({
        title: "請完成所有必填項目",
        description: "請輸入手機號碼並同意相關規範",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "手機號碼格式錯誤",
        description: "請輸入正確的手機號碼格式 (09xxxxxxxx)",
        variant: "destructive"
      });
      return;
    }

    // 進入 OTP 驗證步驟
    setStep(2);
    toast({
      title: "驗證碼已發送",
      description: `驗證碼已發送至 ${phoneNumber}`,
    });
  };

  const handleOTPVerification = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "請輸入正確的驗證碼",
        description: "驗證碼為6位數字",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // 模擬驗證過程
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      
      // 儲存註冊狀態
      localStorage.setItem('userRegistered', 'true');
      localStorage.setItem('userPhone', phoneNumber);
      
      // 創建預設電子名片資料
      const defaultCardData = {
        companyName: '請編輯公司名稱',
        name: '請編輯姓名',
        jobTitle: '請編輯職稱',
        phone: phoneNumber,
        email: 'example@email.com',
        website: '',
        line: '',
        facebook: '',
        instagram: '',
        address: '',
        photo: null,
        introduction: '請編輯自我介紹',
        otherInfo: '',
        // 可見性設定
        phoneVisible: true,
        emailVisible: true,
        websiteVisible: true,
        lineVisible: true,
        facebookVisible: true,
        instagramVisible: true,
        addressVisible: true,
        introductionVisible: true,
        otherInfoVisible: true,
        socialMedia: []
      };
      
      localStorage.setItem('aile-card-data', JSON.stringify(defaultCardData));
      
      // 3秒後自動完成註冊
      setTimeout(() => {
        onRegistrationComplete();
        onClose();
        
        // 發送事件通知Rich Menu更新
        window.dispatchEvent(new CustomEvent('userRegistered'));
      }, 3000);
    }, 2000);
  };

  const handleResendOTP = () => {
    toast({
      title: "驗證碼已重新發送",
      description: `新的驗證碼已發送至 ${phoneNumber}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 bg-white rounded-2xl overflow-hidden border shadow-lg" style={{ maxWidth: '350px' }}>
        <div className="relative">
          {/* Step 1: 註冊表單 */}
          {step === 1 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">會員註冊</h3>
                <p className="text-sm text-gray-600">請填寫以下資訊完成註冊</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手機號碼 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="09xxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      我已閱讀並同意
                      <a href="#" className="text-blue-500 hover:underline mx-1">服務條款</a>
                      及
                      <a href="#" className="text-blue-500 hover:underline mx-1">隱私政策</a>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={handleRegister}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-medium"
                  disabled={!phoneNumber || !agreed}
                >
                  註冊並發送驗證碼
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: OTP 驗證 */}
          {step === 2 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">手機驗證</h3>
                <p className="text-sm text-gray-600">
                  驗證碼已發送至 <span className="font-medium">{phoneNumber}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    驗證碼 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="請輸入6位數驗證碼"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button 
                  onClick={handleOTPVerification}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium"
                  disabled={!otp || otp.length !== 6 || isVerifying}
                >
                  {isVerifying ? '驗證中...' : '驗證'}
                </Button>

                <Button 
                  onClick={handleResendOTP}
                  variant="ghost"
                  className="w-full text-blue-500 hover:text-blue-600 text-sm"
                >
                  重新發送驗證碼
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: 完成 */}
          {step === 3 && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-3">註冊成功！</h3>
              <p className="text-sm text-gray-600 mb-4">
                歡迎加入 AiCard 電子名片服務
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-blue-700">
                  系統已為您創建預設電子名片，請至「會員」→「名片管理」進行編輯
                </p>
              </div>
            </div>
          )}

          {/* 關閉按鈕 */}
          <div className="absolute top-3 right-3">
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm" 
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};