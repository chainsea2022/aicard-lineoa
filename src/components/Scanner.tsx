import React, { useState } from 'react';
import { ArrowLeft, Scan, MessageSquare, Mail, UserPlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ScannerProps {
  onClose: () => void;
}

interface CustomerData {
  name: string;
  phone: string;
  email: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  photo?: string;
}

const Scanner: React.FC<ScannerProps> = ({ onClose }) => {
  const [scanResult, setScanResult] = useState<'none' | 'paper-card' | 'aile-card'>('none');
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    jobTitle: ''
  });

  const handleScan = () => {
    // 模擬掃描結果 - 隨機決定是紙本名片還是 AILE 電子名片
    const isAileCard = Math.random() > 0.6; // 40% 機率是 AILE 卡片
    
    if (isAileCard) {
      setScanResult('aile-card');
      setCustomerData({
        name: '張小明',
        phone: '0912-345-678',
        email: 'zhang@example.com',
        company: 'ABC科技公司',
        jobTitle: '業務經理',
        website: 'www.abc-tech.com',
        line: '@abc-tech',
        facebook: 'ABC.Tech.Official',
        instagram: 'abc_tech_official',
        photo: '/placeholder.svg' // 模擬大頭照
      });
    } else {
      setScanResult('paper-card');
      setCustomerData({
        name: '李大華',
        phone: '0923-456-789',
        email: 'li@company.com',
        company: '創新企業有限公司',
        jobTitle: '行銷總監'
      });
    }
  };

  const handleSendSMSInvitation = () => {
    const registrationUrl = 'https://aile.app/register';
    const message = `您好！邀請您加入 AILE 電子名片，享受智能商務服務。請點擊註冊：${registrationUrl}`;
    
    toast({
      title: "簡訊邀請已發送！",
      description: `邀請註冊連結已發送給 ${customerData.name}`,
    });
    
    console.log('SMS內容:', message);
  };

  const handleSendEmailInvitation = () => {
    toast({
      title: "Email 已發送！",
      description: `邀請連結已透過Email發送給 ${customerData.name}。`,
    });
  };

  const handleAddCustomer = () => {
    const customers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const newCustomer = {
      id: Date.now(),
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      company: customerData.company,
      jobTitle: customerData.jobTitle,
      website: customerData.website,
      line: customerData.line,
      facebook: customerData.facebook,
      instagram: customerData.instagram,
      photo: customerData.photo,
      hasCard: scanResult === 'aile-card',
      addedDate: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    localStorage.setItem('aile-customers', JSON.stringify(customers));
    
    toast({
      title: "客戶已加入！",
      description: `${customerData.name} 已成功加入您的客戶名單。`,
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
          <p className="text-gray-600 mb-4">將相機對準 QR Code 或紙本名片進行掃描</p>
          <Button
            onClick={handleScan}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Scan className="w-5 h-5 mr-2" />
            開始掃描
          </Button>
        </div>

        {/* Paper Business Card Results */}
        {scanResult === 'paper-card' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <UserPlus className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-blue-800">掃描到紙本名片</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  客戶姓名
                </label>
                <Input
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  placeholder="客戶姓名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公司名稱
                </label>
                <Input
                  value={customerData.company}
                  onChange={(e) => setCustomerData({...customerData, company: e.target.value})}
                  placeholder="公司名稱"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  職稱
                </label>
                <Input
                  value={customerData.jobTitle}
                  onChange={(e) => setCustomerData({...customerData, jobTitle: e.target.value})}
                  placeholder="職稱"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手機號碼
                  </label>
                  <Input
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    placeholder="手機號碼"
                  />
                </div>
                <Button
                  onClick={handleSendSMSInvitation}
                  className="bg-green-500 hover:bg-green-600 text-white mt-6"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  發送簡訊邀請
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電子信箱
                </label>
                <Input
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  placeholder="電子信箱"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleSendEmailInvitation}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  發送 Email 邀請
                </Button>
              </div>
              
              <Button
                onClick={handleAddCustomer}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                加入我的客戶
              </Button>
            </div>
          </div>
        )}

        {/* AILE Electronic Business Card Results */}
        {scanResult === 'aile-card' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-800">發現 AILE 電子名片！</h3>
            </div>
            
            {/* Electronic Business Card Preview - matching MyCard format */}
            <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl p-4 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  {customerData.photo && (
                    <img
                      src={customerData.photo}
                      alt="照片"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{customerData.name}</h3>
                    <p className="text-blue-100 text-sm">{customerData.company}</p>
                    {customerData.jobTitle && (
                      <p className="text-blue-200 text-xs">{customerData.jobTitle}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  {customerData.phone && (
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      <span>{customerData.phone}</span>
                    </div>
                  )}
                  {customerData.email && (
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      <span>{customerData.email}</span>
                    </div>
                  )}
                  {customerData.website && (
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      <span>{customerData.website}</span>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {(customerData.line || customerData.facebook || customerData.instagram) && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-blue-100 mb-1">社群媒體</p>
                    <div className="space-y-1 text-xs">
                      {customerData.line && <div>LINE: {customerData.line}</div>}
                      {customerData.facebook && <div>Facebook: {customerData.facebook}</div>}
                      {customerData.instagram && <div>Instagram: {customerData.instagram}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700">
                🎉 太好了！{customerData.name} 也是 AILE 用戶，您可以直接將他們加入客戶名單。
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
            <li>• 對準客戶的 QR Code 或紙本名片</li>
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
