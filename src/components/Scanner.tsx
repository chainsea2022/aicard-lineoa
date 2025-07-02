
import React, { useState } from 'react';
import { ArrowLeft, Scan, MessageSquare, Mail, UserPlus, CheckCircle, QrCode, FileText } from 'lucide-react';
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handlePaperScan = () => {
    setScanResult('paper-card');
    setCustomerData({
      name: '李大華',
      phone: '0923-456-789',
      email: 'li@company.com',
      company: '創新企業有限公司',
      jobTitle: '行銷總監'
    });
  };

  const handleQRCodeScan = () => {
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
      photo: '/placeholder.svg'
    });
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
      notes: '',
    };
    
    customers.push(newCustomer);
    localStorage.setItem('aile-customers', JSON.stringify(customers));
    
    setShowSuccessMessage(true);
    
    toast({
      title: "客戶已加入！",
      description: `${customerData.name} 已成功加入您的客戶名單。`,
    });
  };

  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">客戶已成功加入！</h2>
          <p className="text-sm text-gray-600 mb-4">{customerData.name} 已加入您的客戶名單</p>
          
          {/* 新增功能提示 - 調整為手機尺寸 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-left">
            <p className="text-xs text-blue-700 mb-2 font-medium">
              💡 您現在可以在圖文選單中的「我的客戶」查看：
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-blue-600">📄 紙本名片客戶資料</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-green-600">📱 AILE 電子名片用戶</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-orange-600">✏️ 編輯客戶備註與資料</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 text-sm py-2"
            >
              前往我的客戶
            </Button>
            <Button
              onClick={() => {
                setShowSuccessMessage(false);
                setScanResult('none');
                setCustomerData({
                  name: '',
                  phone: '',
                  email: '',
                  company: '',
                  jobTitle: ''
                });
              }}
              variant="outline"
              className="w-full text-sm py-2"
            >
              繼續掃描
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header - 調整為手機尺寸 */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 shadow-lg sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-base">掃描</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-safe">
        {/* Scanner Area - 調整為手機尺寸 */}
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-dashed border-gray-300 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Scan className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4 text-sm">選擇掃描類型</p>
          
          {/* 分成兩個掃描按鈕 - 調整為手機尺寸 */}
          <div className="space-y-2">
            <Button
              onClick={handlePaperScan}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2.5"
            >
              <FileText className="w-4 h-4 mr-2" />
              紙本掃描
            </Button>
            <Button
              onClick={handleQRCodeScan}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-2.5"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code 掃描
            </Button>
          </div>
        </div>

        {/* Paper Business Card Results - 調整為手機尺寸 */}
        {scanResult === 'paper-card' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-800 text-sm">掃描到紙本名片</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  客戶姓名
                </label>
                <Input
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  placeholder="客戶姓名"
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  公司名稱
                </label>
                <Input
                  value={customerData.company}
                  onChange={(e) => setCustomerData({...customerData, company: e.target.value})}
                  placeholder="公司名稱"
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  職稱
                </label>
                <Input
                  value={customerData.jobTitle}
                  onChange={(e) => setCustomerData({...customerData, jobTitle: e.target.value})}
                  placeholder="職稱"
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  手機號碼
                </label>
                <div className="flex gap-2">
                  <Input
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    placeholder="手機號碼"
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSendSMSInvitation}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 text-xs whitespace-nowrap"
                    size="sm"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    簡訊邀請
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  電子信箱
                </label>
                <Input
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  placeholder="電子信箱"
                  className="text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSendEmailInvitation}
                  variant="outline"
                  className="flex-1 text-xs"
                  size="sm"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email 邀請
                </Button>
              </div>
              
              <Button
                onClick={handleAddCustomer}
                className="w-full bg-orange-500 hover:bg-orange-600 text-sm py-2.5"
              >
                加入我的客戶
              </Button>
            </div>
          </div>
        )}

        {/* AILE Electronic Business Card Results - 調整為手機尺寸 */}
        {scanResult === 'aile-card' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-800 text-sm">發現 AILE 電子名片！</h3>
            </div>
            
            {/* Electronic Business Card Preview - 調整為手機尺寸 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg mb-3 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  {customerData.photo && (
                    <img
                      src={customerData.photo}
                      alt="照片"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold mb-0.5 truncate">{customerData.name}</h3>
                    <p className="text-blue-100 text-xs truncate">{customerData.company}</p>
                    {customerData.jobTitle && (
                      <p className="text-blue-200 text-xs truncate">{customerData.jobTitle}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-xs">
                  {customerData.phone && (
                    <div className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{customerData.phone}</span>
                    </div>
                  )}
                  {customerData.email && (
                    <div className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{customerData.email}</span>
                    </div>
                  )}
                  {customerData.website && (
                    <div className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-white rounded-full flex-shrink-0"></span>
                      <span className="truncate">{customerData.website}</span>
                    </div>
                  )}
                </div>

                {/* Social Media Links - 調整為手機尺寸 */}
                {(customerData.line || customerData.facebook || customerData.instagram) && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-blue-100 mb-1">社群媒體</p>
                    <div className="space-y-0.5 text-xs">
                      {customerData.line && <div className="truncate">LINE: {customerData.line}</div>}
                      {customerData.facebook && <div className="truncate">FB: {customerData.facebook}</div>}
                      {customerData.instagram && <div className="truncate">IG: {customerData.instagram}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-xs text-blue-700">
                🎉 太好了！{customerData.name} 也是 AILE 用戶，您可以直接將他們加入客戶名單。
              </p>
            </div>
            
            <Button
              onClick={handleAddCustomer}
              className="w-full bg-green-500 hover:bg-green-600 text-sm py-2.5"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              成為我的客戶
            </Button>
          </div>
        )}

        {/* Instructions - 調整為手機尺寸 */}
        <div className="bg-gray-50 rounded-xl p-3">
          <h4 className="font-bold text-gray-800 mb-2 text-sm">💡 掃描說明</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• <strong>紙本掃描：</strong>適用於傳統紙本名片識別</li>
            <li>• <strong>QR Code 掃描：</strong>適用於 AILE 電子名片 QR Code</li>
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
