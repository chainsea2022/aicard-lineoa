import React, { useState } from 'react';
import { ArrowLeft, Smartphone, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface PhoneVerificationLIFFProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (phone: string) => void;
}

const PhoneVerificationLIFF: React.FC<PhoneVerificationLIFFProps> = ({ 
  isOpen, 
  onClose, 
  onVerificationComplete 
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "請輸入有效手機號碼",
        description: "手機號碼格式不正確",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // 模擬發送OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setCountdown(60);
      
      // 倒數計時
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast({
        title: "驗證碼已發送",
        description: `驗證碼已發送至 ${phone}`,
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "請輸入完整驗證碼",
        description: "驗證碼為6位數字",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // 模擬驗證OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      
      setTimeout(() => {
        onVerificationComplete(phone);
      }, 1500);
    }, 1000);
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    toast({
      title: "驗證碼已重新發送",
      description: `新的驗證碼已發送至 ${phone}`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* LIFF Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">AiCard 會員註冊</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
        <div className="max-w-md mx-auto">
          {step === 'phone' && (
            <>
              {/* Logo Area */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">手機號碼驗證</h2>
                <p className="text-gray-600">我們將發送驗證碼至您的手機</p>
              </div>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手機號碼 *
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="請輸入您的手機號碼"
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500"
                      maxLength={10}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !phone}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium text-lg shadow-lg"
                  >
                    {isLoading ? '發送中...' : '發送驗證碼'}
                  </Button>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>您的手機號碼將受到嚴格保護</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">輸入驗證碼</h2>
                <p className="text-gray-600">
                  驗證碼已發送至 <span className="font-semibold text-blue-600">{phone}</span>
                </p>
              </div>

              <Card className="border-0 shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium text-lg shadow-lg"
                  >
                    {isLoading ? '驗證中...' : '驗證並註冊'}
                  </Button>

                  <div className="text-center space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => setStep('phone')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      修改手機號碼
                    </Button>
                    
                    <div className="text-sm text-gray-500">
                      {countdown > 0 ? (
                        <span>重新發送驗證碼 ({countdown}秒)</span>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={handleResendOTP}
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
                        >
                          重新發送驗證碼
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">驗證成功！</h2>
              <p className="text-gray-600 mb-6">
                正在為您建立專屬電子名片...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationLIFF;