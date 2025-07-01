
import React, { useState } from 'react';
import { ArrowLeft, Scan, MessageSquare, Mail, UserPlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ScannerProps {
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onClose }) => {
  const [scanResult, setScanResult] = useState<'none' | 'no-card' | 'has-card'>('none');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const handleScan = () => {
    // 模擬掃描結果
    const hasCard = Math.random() > 0.5;
    setScanResult(hasCard ? 'has-card' : 'no-card');
    
    if (hasCard) {
      setCustomerName('張小明');
      setCustomerPhone('0912-345-678');
      setCustomerEmail('zhang@example.com');
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
    }
  };

  const handleSendInvitation = (method: 'sms' | 'email') => {
    toast({
      title: method === 'sms' ? "簡訊已發送！" : "Email 已發送！",
      description: `邀請連結已透過${method === 'sms' ? '簡訊' : 'Email'}發送給客戶。`,
    });
  };

  const handleAddCustomer = () => {
    const customers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const newCustomer = {
      id: Date.now(),
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      hasCard: scanResult === 'has-card',
      addedDate: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    localStorage.setItem('aile-customers', JSON.stringify(customers));
    
    toast({
      title: "客戶已加入！",
      description: `${customerName} 已成功加入您的客戶名單。`,
    });
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">掃描</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scanner Area */}
        <div className="bg-gray-100 rounded-xl p-8 text-center">
          <div className="w-48 h-48 border-4 border-dashed border-gray-300 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <Scan className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">將相機對準 QR Code 或電子名片進行掃描</p>
          <Button
            onClick={handleScan}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Scan className="w-5 h-5 mr-2" />
            開始掃描
          </Button>
        </div>

        {/* Scan Results */}
        {scanResult === 'no-card' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <UserPlus className="w-6 h-6 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">客戶尚未建立 AILE 名片</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  客戶姓名
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="輸入客戶姓名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手機號碼
                </label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="輸入客戶手機號碼"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電子信箱
                </label>
                <Input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="輸入客戶電子信箱"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleSendInvitation('sms')}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  發送簡訊邀請
                </Button>
                <Button
                  onClick={() => handleSendInvitation('email')}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  發送 Email 邀請
                </Button>
              </div>
              
              <Button
                onClick={handleAddCustomer}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                加入我的客戶
              </Button>
            </div>
          </div>
        )}

        {scanResult === 'has-card' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-800">發現 AILE 電子名片！</h3>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4 border">
              <h4 className="font-bold text-gray-800 mb-2">{customerName}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📞 {customerPhone}</p>
                <p>📧 {customerEmail}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700">
                🎉 太好了！{customerName} 也是 AILE 用戶，您可以直接將他們加入客戶名單。
              </p>
            </div>
            
            <Button
              onClick={handleAddCustomer}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              成為我的客戶
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 mb-2">💡 掃描說明</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 對準客戶的 QR Code 或電子名片</li>
            <li>• 確保光線充足，保持相機穩定</li>
            <li>• 掃描成功後會自動識別客戶資訊</li>
            <li>• 邀請沒有 AILE 名片的客戶加入</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
