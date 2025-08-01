import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, CheckCircle, UserPlus, QrCode, FileText, X, Plus, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ContactForm } from '@/components/MyCustomers/ContactForm';
import { Customer } from '@/components/MyCustomers/types';

// LIFF type declaration
declare global {
  interface Window {
    liff: any;
  }
}
interface ScannerProps {
  onClose: () => void;
}
interface CustomerData {
  id?: number;
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
const Scanner: React.FC<ScannerProps> = ({
  onClose
}) => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [scanResult, setScanResult] = useState<'none' | 'paper-card' | 'aipower-card' | 'duplicate-detected'>('none');
  const [scanCount, setScanCount] = useState(() => {
    // Get scan count from localStorage to persist across visits
    return parseInt(localStorage.getItem('scanner-scan-count') || '0');
  });
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    jobTitle: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState('');
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [duplicateData, setDuplicateData] = useState<{
    existing: CustomerData;
    updated: CustomerData;
    changes: Array<{ field: string; oldValue: string; newValue: string; label: string }>;
  } | null>(null);
  useEffect(() => {
    // Initialize LIFF
    const initializeLiff = async () => {
      try {
        if (typeof window !== 'undefined' && window.liff) {
          await window.liff.init({
            liffId: 'your-liff-id' // Replace with actual LIFF ID
          });
          setIsLiffReady(true);
          console.log('LIFF initialized successfully');
        }
      } catch (error) {
        console.error('LIFF initialization failed:', error);
        // Continue without LIFF for development
        setIsLiffReady(true);
      }
    };
    initializeLiff();
  }, []);
  const simulateScan = () => {
    const customers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const newScanCount = scanCount + 1;
    setScanCount(newScanCount);
    localStorage.setItem('scanner-scan-count', newScanCount.toString());
    
    // 依照點擊次數輪流顯示3種情境
    if (newScanCount % 3 === 1) {
      // 第1種情境：辨識到電子名片
      const scannedData = {
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
      };
      
      setScanResult('aipower-card');
      setCustomerData(scannedData);
    } else if (newScanCount % 3 === 2) {
      // 第2種情境：辨識到紙本名片
      setScanResult('paper-card');
      setCustomerData({
        name: '李大華',
        phone: '0923-456-789',
        email: 'li@company.com',
        company: '創新企業有限公司',
        jobTitle: '行銷總監'
      });
      setInvitationUrl(generateInvitationUrl());
    } else {
      // 第3種情境：辨識到資料異動
      const existingData = {
        id: 1,
        name: '王美玲',
        phone: '0934-567-890',
        email: 'wang@tech.com',
        company: '未來科技',
        jobTitle: '專案經理'
      };
      
      const updatedData = {
        ...existingData,
        jobTitle: '專案總監'
      };
      
      const changes = [{
        field: 'jobTitle',
        oldValue: '專案經理',
        newValue: '專案總監',
        label: '職稱'
      }];
      
      setDuplicateData({
        existing: existingData,
        updated: updatedData,
        changes
      });
      setScanResult('duplicate-detected');
      setCustomerData(updatedData);
    }
  };
  const generateInvitationUrl = () => {
    const inviteId = Math.random().toString(36).substring(2, 15);
    return `https://aipower.app/register?invite=${inviteId}`;
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
      hasCard: scanResult === 'aipower-card',
      addedDate: new Date().toISOString(),
      notes: scanResult === 'paper-card' ? '紙本名片掃描' : 'QR Code掃描加入',
      isInvited: scanResult === 'paper-card',
      invitationSent: scanResult === 'paper-card',
      isDigitalCard: scanResult === 'aipower-card'
    };
    customers.push(newCustomer);
    localStorage.setItem('aile-customers', JSON.stringify(customers));
    setShowSuccessMessage(true);

    // Trigger notification events
    if (scanResult === 'paper-card') {
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: {
          customerName: customerData.name,
          action: 'paper_scanned',
          isDigitalCard: false,
          customer: newCustomer
        }
      }));
    } else if (scanResult === 'aipower-card') {
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: {
          customerName: customerData.name,
          action: 'qr_scanned',
          isDigitalCard: true,
          customer: newCustomer
        }
      }));
    }
    toast({
      title: scanResult === 'paper-card' ? "聯絡人已加入！" : "名片已交換！",
      description: `${customerData.name} 已成功加入${scanResult === 'paper-card' ? '聯絡人清單' : '我的名片夾'}。`
    });
  };
  const handleCreateContact = () => {
    setIsContactFormOpen(true);
  };
  const handleSaveContact = (customer: Customer) => {
    const customers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const newCustomer = {
      id: Date.now(),
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      company: customer.company,
      jobTitle: customer.jobTitle,
      website: customer.website,
      line: customer.line,
      facebook: customer.facebook,
      instagram: customer.instagram,
      notes: customer.notes,
      hasCard: false,
      addedDate: new Date().toISOString(),
      isInvited: false,
      invitationSent: false,
      isDigitalCard: false,
      relationshipStatus: 'following_me' as const
    };
    customers.push(newCustomer);
    localStorage.setItem('aile-customers', JSON.stringify(customers));
    setIsContactFormOpen(false);
    toast({
      title: "聯絡人已加入！",
      description: `${customer.name} 已成功加入聯絡人清單。`
    });

    // Trigger notification event
    window.dispatchEvent(new CustomEvent('customerAddedNotification', {
      detail: {
        customerName: customer.name,
        action: 'manual_created',
        isDigitalCard: false,
        customer: newCustomer
      }
    }));
  };

  const handleDuplicateAction = (action: 'update' | 'create-new' | 'ignore') => {
    if (!duplicateData) return;
    
    const customers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const existingIndex = customers.findIndex(c => c.id === duplicateData.existing.id);
    const currentDate = new Date().toLocaleDateString('zh-TW');
    const changeDesc = duplicateData.changes.map(c => `${c.label}原「${c.oldValue}」變為「${c.newValue}」`).join('，');
    
    let noteText = '';
    
    if (action === 'update') {
      // 更新現有名片
      if (existingIndex !== -1) {
        customers[existingIndex] = {
          ...customers[existingIndex],
          ...duplicateData.updated,
          notes: `${customers[existingIndex].notes || ''}\n${currentDate}掃描${duplicateData.updated.name}名片，${changeDesc}，選擇：更新名片夾`.trim()
        };
        noteText = '已更新現有名片資料';
      }
    } else if (action === 'create-new') {
      // 建立新版本
      const newCustomer = {
        id: Date.now(),
        name: duplicateData.updated.name,
        phone: duplicateData.updated.phone,
        email: duplicateData.updated.email,
        company: duplicateData.updated.company,
        jobTitle: duplicateData.updated.jobTitle,
        website: duplicateData.updated.website,
        line: duplicateData.updated.line,
        facebook: duplicateData.updated.facebook,
        instagram: duplicateData.updated.instagram,
        photo: duplicateData.updated.photo,
        hasCard: true,
        addedDate: new Date().toISOString(),
        notes: `${currentDate}掃描${duplicateData.updated.name}名片，${changeDesc}，選擇：建立新版本`,
        isInvited: false,
        invitationSent: false,
        isDigitalCard: true
      };
      customers.push(newCustomer);
      noteText = '已建立新版本名片';
    } else if (action === 'ignore') {
      // 更新備註但不改變資料
      if (existingIndex !== -1) {
        customers[existingIndex].notes = `${customers[existingIndex].notes || ''}\n${currentDate}掃描${duplicateData.updated.name}名片，${changeDesc}，選擇：忽略此次變更`.trim();
      }
      noteText = '已忽略此次變更';
    }
    
    localStorage.setItem('aile-customers', JSON.stringify(customers));
    
    // 顯示成功訊息
    toast({
      title: "處理完成！",
      description: noteText
    });
    
    // 重置狀態
    setScanResult('none');
    setDuplicateData(null);
    setCustomerData({
      name: '',
      phone: '',
      email: '',
      company: '',
      jobTitle: ''
    });
  };

  // Show loading if LIFF is not ready
  if (!isLiffReady) {
    return <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">載入中...</p>
        </div>
      </div>;
  }
  if (showSuccessMessage) {
    return <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-3 overflow-hidden">
        <div className="w-full max-w-xs mx-auto text-center h-full flex flex-col justify-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-gray-800 mb-2">
            {scanResult === 'paper-card' ? '聯絡人已成功加入！' : '名片已成功交換！'}
          </h2>
          <p className="text-xs text-gray-600 mb-4">
            {customerData.name} 已加入您的{scanResult === 'paper-card' ? '聯絡人清單' : '名片夾'}
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-4 text-left">
            <p className="text-xs text-blue-700 mb-2 font-medium">
              💡 您現在可以在圖文選單中的「名片夾」查看：
            </p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-blue-600">📄 紙本名片聯絡人資料</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-green-600">📱 Aipower 電子名片用戶</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-orange-600">✏️ 編輯聯絡人備註與資料</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-auto pb-4">
            <Button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600 text-xs py-2 h-8">
              前往我的聯絡人
            </Button>
            <Button onClick={() => {
            setShowSuccessMessage(false);
            setScanResult('none');
            setCustomerData({
              name: '',
              phone: '',
              email: '',
              company: '',
              jobTitle: ''
            });
          }} variant="outline" className="w-full text-xs py-2 h-8">
              繼續掃描
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 p-1.5 h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-base">名片辨識</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-4 min-h-0">
        {/* Scanner Interface - Always visible */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4 text-sm">對準名片或 QR Code 進行掃描</p>
          
          <Button onClick={simulateScan} className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-3 h-12 touch-manipulation">
            <Camera className="w-5 h-5 mr-2" />
            開始辨別
          </Button>
        </div>

        {/* Manual Create Contact Button */}
        <div className="bg-gray-50 rounded-lg p-3">
          <Button onClick={handleCreateContact} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-3 h-10 touch-manipulation">
            <Plus className="w-4 h-4 mr-2" />
            手動建立名片
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">手動輸入聯絡人資訊</p>
        </div>

        {/* Instructions - Always visible */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-bold text-gray-800 mb-2 text-sm">💡 名片識別說明</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 點擊「開始識別」可辨別紙本名片或電子名片</li>
            <li>• 提示說明：</li>
            <li className="ml-3">– 電子名片：可儲存至「名片夾 {">"}我的電子名片夾」</li>
            <li className="ml-3">– 紙本名片：可儲存至「名片夾 {">"} 我的聯絡人」</li>
          </ul>
        </div>

        {/* Paper Business Card Results */}
        {scanResult === 'paper-card' && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-blue-800 text-xs">掃描紙本名片</h3>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  客戶姓名
                </label>
                <Input value={customerData.name} onChange={e => setCustomerData({
              ...customerData,
              name: e.target.value
            })} placeholder="客戶姓名" className="text-xs h-8 touch-manipulation" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  公司名稱
                </label>
                <Input value={customerData.company} onChange={e => setCustomerData({
              ...customerData,
              company: e.target.value
            })} placeholder="公司名稱" className="text-xs h-8 touch-manipulation" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  職稱
                </label>
                <Input value={customerData.jobTitle} onChange={e => setCustomerData({
              ...customerData,
              jobTitle: e.target.value
            })} placeholder="職稱" className="text-xs h-8 touch-manipulation" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  手機號碼
                </label>
                <Input value={customerData.phone} onChange={e => setCustomerData({
              ...customerData,
              phone: e.target.value
            })} placeholder="手機號碼" className="text-xs h-8 touch-manipulation" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  電子信箱
                </label>
                <Input value={customerData.email} onChange={e => setCustomerData({
              ...customerData,
              email: e.target.value
            })} placeholder="電子信箱" className="text-xs h-8 touch-manipulation" />
              </div>
              
              <Button onClick={handleAddCustomer} className="w-full bg-orange-500 hover:bg-orange-600 text-xs py-2 h-9 touch-manipulation">
                儲存到我的聯絡人列表
              </Button>
            </div>
          </div>}

        {/* Aipower Electronic Business Card Results */}
        {scanResult === 'aipower-card' && <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <QrCode className="w-4 h-4 text-green-600" />
              <h3 className="font-bold text-green-800 text-xs">發現 Aipower 電子名片！</h3>
            </div>
            
            {/* Electronic Business Card Preview */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-2">
              {/* 頭部資訊 */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-3">
                  {customerData.photo && <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <img src={customerData.photo} alt="頭像" className="w-14 h-14 rounded-full object-cover" />
                    </div>}
                  <div className="flex-1">
                    {customerData.company && <p className="text-blue-100 text-sm">{customerData.company}</p>}
                    <h3 className="text-white text-lg font-semibold mb-1">
                      {customerData.name}
                    </h3>
                    {customerData.jobTitle && <p className="text-blue-100 text-sm">{customerData.jobTitle}</p>}
                  </div>
                </div>
              </div>

              {/* 聯絡資訊 */}
              <div className="p-4 space-y-3">
                {/* 電話 */}
                {customerData.phone && <div className="flex items-center space-x-2">
                    <span className="text-gray-600">📱</span>
                    <p className="text-sm text-gray-800">{customerData.phone}</p>
                  </div>}

                {/* Email */}
                {customerData.email && <div className="flex items-center space-x-2">
                    <span className="text-gray-600">✉️</span>
                    <p className="text-sm text-gray-800">{customerData.email}</p>
                  </div>}

                {/* 網站 */}
                {customerData.website && <div className="flex items-center space-x-2">
                    <span className="text-gray-600">🌐</span>
                    <p className="text-sm text-gray-800">{customerData.website}</p>
                  </div>}
              </div>

              {/* 社群媒體與操作區域 */}
              {(customerData.line || customerData.facebook || customerData.instagram) && <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-center flex-wrap gap-3">
                    {customerData.line && <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>}
                    {customerData.facebook && <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>}
                    {customerData.instagram && <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-sm">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>}
                  </div>
                </div>}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
              <p className="text-xs text-blue-700">
                🎉 太好了！{customerData.name} 也是 Aipower 用戶，您可以直接將他們加入我的電子名片夾。
              </p>
            </div>
            
            <Button onClick={handleAddCustomer} className="w-full bg-green-500 hover:bg-green-600 text-xs py-2 h-9 touch-manipulation">
              <UserPlus className="w-3 h-3 mr-1" />
              儲存到我的電子名片夾
            </Button>
          </div>}

        {/* Duplicate Detection Results */}
        {scanResult === 'duplicate-detected' && duplicateData && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-orange-600 text-lg">⚠️</span>
              <h3 className="font-bold text-orange-800 text-sm">系統偵測資料變動</h3>
            </div>
            
            <div className="bg-white border border-orange-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 mb-2">
                {new Date().toLocaleDateString('zh-TW')}發現{duplicateData.updated.name}
              </p>
              
              {duplicateData.changes.map((change, index) => (
                <div key={index} className="text-sm text-gray-600 mb-1">
                  {change.label}原「<span className="text-red-600 font-medium">{change.oldValue}</span>」變為「<span className="text-green-600 font-medium">{change.newValue}</span>」
                </div>
              ))}
              
              <p className="text-xs text-gray-500 mt-2">您可選擇：</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => handleDuplicateAction('update')} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 h-9 touch-manipulation"
              >
                1️⃣ 更新名片夾（直接同步修改）
              </Button>
              
              
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-3">
              <p className="text-xs text-blue-700">
                💡 選擇處理方式後，系統會自動在備註欄位記錄此次變更歷程
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Dialog */}
      <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} onSave={handleSaveContact} editingCustomer={null} />
    </div>;
};
export default Scanner;