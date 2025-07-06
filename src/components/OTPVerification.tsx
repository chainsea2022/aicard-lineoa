
import React, { useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  onClose: () => void;
  onVerificationComplete: (phone: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onClose, onVerificationComplete }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "請輸入有效手機號碼",
        description: "手機號碼格式不正確",
      });
      return;
    }

    setIsLoading(true);
    // 模擬發送OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
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
      });
      return;
    }

    setIsLoading(true);
    // 模擬驗證OTP
    setTimeout(() => {
      setIsLoading(false);
      
      // 儲存用戶註冊資訊
      const userData = {
        phone,
        registeredAt: new Date(),
        isVerified: true
      };
      localStorage.setItem('aile-user-data', JSON.stringify(userData));
      
      toast({
        title: "驗證成功！",
        description: "手機號碼驗證完成，即將進入名片建立",
      });
      
      onVerificationComplete(phone);
    }, 1000);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">手機驗證註冊</h1>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>
              {step === 'phone' ? '輸入手機號碼' : '輸入驗證碼'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'phone' ? (
              <>
                <div>
                  <Label htmlFor="phone">手機號碼</Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="請輸入手機號碼"
                    maxLength={10}
                  />
                </div>
                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? '發送中...' : '發送驗證碼'}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    驗證碼已發送至 <span className="font-medium">{phone}</span>
                  </p>
                </div>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
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
                <div className="space-y-2">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? '驗證中...' : '驗證並註冊'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep('phone')}
                    className="w-full"
                  >
                    重新輸入手機號碼
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;
