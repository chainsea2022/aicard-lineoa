
import React, { useState } from 'react';
import { ArrowLeft, Search, Mail, Users, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface Recipient {
  id: string;
  name: string;
  email: string;
  company?: string;
  relationship?: string;
  source: 'customer' | 'contact' | 'manual';
}

interface RecipientSelectorProps {
  onClose: () => void;
  onRecipientsSelected: (recipients: Recipient[]) => void;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({ onClose, onRecipientsSelected }) => {
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'customers' | 'contacts'>('customers');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualRecipient, setManualRecipient] = useState({
    name: '',
    email: '',
    company: ''
  });

  // Mock 客戶名單數據
  const mockCustomers = [
    { id: '1', name: '張小明', email: 'zhang@example.com', company: 'ABC公司', relationship: '潛在客戶' },
    { id: '2', name: '李小華', email: 'li@example.com', company: 'XYZ企業', relationship: '現有客戶' },
    { id: '3', name: '王大成', email: 'wang@example.com', company: '123科技', relationship: '決策者' },
    { id: '4', name: '陳小美', email: 'chen@example.com', company: '456公司', relationship: '聯絡人' },
    { id: '5', name: '林志明', email: 'lin@example.com', company: '789企業', relationship: '主管' }
  ];

  // Mock 聯絡人數據 - 沒有 relationship 屬性
  const mockContacts = [
    { id: '6', name: '劉大明', email: 'liu@gmail.com', company: '個人' },
    { id: '7', name: '蔡小芳', email: 'tsai@yahoo.com', company: '自由業' },
    { id: '8', name: '楊志偉', email: 'yang@hotmail.com', company: '顧問' },
    { id: '9', name: '黃美玲', email: 'huang@gmail.com', company: '設計師' },
    { id: '10', name: '吳建華', email: 'wu@outlook.com', company: '工程師' }
  ];

  const getCurrentList = () => {
    const list = activeTab === 'customers' ? mockCustomers : mockContacts;
    return list.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const toggleRecipient = (item: any) => {
    const recipient: Recipient = {
      id: item.id,
      name: item.name,
      email: item.email,
      company: item.company,
      relationship: item.relationship, // This will be undefined for contacts, which is fine
      source: activeTab === 'customers' ? 'customer' : 'contact'
    };

    const isSelected = selectedRecipients.find(r => r.id === recipient.id);
    
    if (isSelected) {
      setSelectedRecipients(prev => prev.filter(r => r.id !== recipient.id));
    } else {
      setSelectedRecipients(prev => [...prev, recipient]);
    }
  };

  const addManualRecipient = () => {
    if (manualRecipient.name && manualRecipient.email) {
      const recipient: Recipient = {
        id: `manual_${Date.now()}`,
        name: manualRecipient.name,
        email: manualRecipient.email,
        company: manualRecipient.company,
        source: 'manual'
      };
      
      setSelectedRecipients(prev => [...prev, recipient]);
      setManualRecipient({ name: '', email: '', company: '' });
      setShowManualAdd(false);
      
      toast({
        title: "收件人已新增",
        description: `${recipient.name} 已加入收件人列表`,
      });
    }
  };

  const removeRecipient = (id: string) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== id));
  };

  const handleConfirm = () => {
    if (selectedRecipients.length > 0) {
      onRecipientsSelected(selectedRecipients);
    } else {
      toast({
        title: "請選擇收件人",
        description: "至少需要選擇一位收件人才能發送信件",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-bold text-base">選擇收件人</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs">{selectedRecipients.length} 位已選</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowManualAdd(true)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3 pb-20">
        {/* 已選收件人 */}
        {selectedRecipients.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h3 className="font-medium text-purple-800 mb-2 text-sm">已選收件人 ({selectedRecipients.length})：</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRecipients.map((recipient) => (
                <div key={recipient.id} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>{recipient.name}</span>
                  <button
                    onClick={() => removeRecipient(recipient.id)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 搜尋框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="搜尋姓名、信箱或公司..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* 分頁標籤 */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'customers'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-3 h-3 inline mr-1" />
            我的客戶 ({mockCustomers.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Mail className="w-3 h-3 inline mr-1" />
            聯絡人 ({mockContacts.length})
          </button>
        </div>

        {/* 收件人列表 */}
        <div className="space-y-2">
          {getCurrentList().map((item) => {
            const isSelected = selectedRecipients.find(r => r.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleRecipient(item)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600">{item.email}</div>
                    {item.company && (
                      <div className="text-xs text-gray-500">{item.company}</div>
                    )}
                    {/* 只有客戶才有 relationship 屬性 */}
                    {activeTab === 'customers' && (item as any).relationship && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {(item as any).relationship}
                      </span>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {getCurrentList().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Mail className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">沒有找到符合條件的聯絡人</p>
          </div>
        )}
      </div>

      {/* 手動新增收件人表單 */}
      {showManualAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-3">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm mx-3">
            <h3 className="text-base font-bold text-gray-800 mb-3">手動新增收件人</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <Input
                  value={manualRecipient.name}
                  onChange={(e) => setManualRecipient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="輸入姓名"
                  className="h-9 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  電子郵件 *
                </label>
                <Input
                  type="email"
                  value={manualRecipient.email}
                  onChange={(e) => setManualRecipient(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="輸入電子郵件"
                  className="h-9 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  公司 (選填)
                </label>
                <Input
                  value={manualRecipient.company}
                  onChange={(e) => setManualRecipient(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="輸入公司名稱"
                  className="h-9 text-sm"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowManualAdd(false)}
                className="flex-1 h-9 text-sm"
              >
                取消
              </Button>
              <Button
                onClick={addManualRecipient}
                disabled={!manualRecipient.name || !manualRecipient.email}
                className="flex-1 bg-purple-500 hover:bg-purple-600 h-9 text-sm"
              >
                新增
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 底部確認按鈕 - 優化手機版 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 safe-area-pb">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 text-sm font-medium"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedRecipients.length === 0}
            className="flex-1 bg-purple-500 hover:bg-purple-600 h-11 text-sm font-medium"
          >
            確認選擇 ({selectedRecipients.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipientSelector;
