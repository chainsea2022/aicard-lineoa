import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserCheck, Edit3, Trash2, Search, MessageCircle, ChevronDown, ChevronUp, Globe, Phone, Mail, Save, Calendar, StickyNote, QrCode, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import ChatInterface from './ChatInterface';
import Schedule from './Schedule';

interface MyCustomersProps {
  onClose: () => void;
}
interface Customer {
  id: number;
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
  hasCard: boolean;
  addedDate: string;
  notes?: string;
}

const MyCustomers: React.FC<MyCustomersProps> = ({
  onClose
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invited, setInvited] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<'customers' | 'invited'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(null);
  const [activeChatCustomer, setActiveChatCustomer] = useState<Customer | null>(null);
  const [editingNotes, setEditingNotes] = useState<{
    [key: number]: boolean;
  }>({});
  const [tempNotes, setTempNotes] = useState<{
    [key: number]: string;
  }>({});
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleCustomer, setScheduleCustomer] = useState<Customer | null>(null);
  const [showQRForCustomer, setShowQRForCustomer] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const customersList = savedCustomers.filter((c: Customer) => c.hasCard);
    const invitedList = savedCustomers.filter((c: Customer) => !c.hasCard);
    setCustomers(customersList);
    setInvited(invitedList);
  }, []);

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditName(customer.name);
  };

  const handleSaveEdit = () => {
    const allCustomers = [...customers, ...invited];
    const updatedCustomers = allCustomers.map(customer => customer.id === editingId ? {
      ...customer,
      name: editName
    } : customer);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    const customersList = updatedCustomers.filter(c => c.hasCard);
    const invitedList = updatedCustomers.filter(c => !c.hasCard);
    setCustomers(customersList);
    setInvited(invitedList);
    setEditingId(null);
    setEditName('');
    toast({
      title: "客戶名稱已更新！",
      description: "客戶資訊已成功更新。"
    });
  };

  const handleEditNotes = (customerId: number, currentNotes: string = '') => {
    setEditingNotes(prev => ({
      ...prev,
      [customerId]: true
    }));
    setTempNotes(prev => ({
      ...prev,
      [customerId]: currentNotes
    }));
  };

  const handleSaveNotes = (customerId: number) => {
    const allCustomers = [...customers, ...invited];
    const updatedCustomers = allCustomers.map(customer => customer.id === customerId ? {
      ...customer,
      notes: tempNotes[customerId] || ''
    } : customer);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    const customersList = updatedCustomers.filter(c => c.hasCard);
    const invitedList = updatedCustomers.filter(c => !c.hasCard);
    setCustomers(customersList);
    setInvited(invitedList);
    setEditingNotes(prev => ({
      ...prev,
      [customerId]: false
    }));
    toast({
      title: "備註已儲存！",
      description: "客戶備註已成功更新。"
    });
  };

  const handleScheduleAppointment = (customer: Customer) => {
    setScheduleCustomer(customer);
    setShowSchedule(true);
  };

  const handleCloseSchedule = () => {
    setShowSchedule(false);
    setScheduleCustomer(null);
  };

  const handleDelete = (customerId: number) => {
    const allCustomers = [...customers, ...invited];
    const updatedCustomers = allCustomers.filter(c => c.id !== customerId);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    const customersList = updatedCustomers.filter(c => c.hasCard);
    const invitedList = updatedCustomers.filter(c => !c.hasCard);
    setCustomers(customersList);
    setInvited(invitedList);
    toast({
      title: "客戶已移除！",
      description: "客戶已從名單中移除。"
    });
  };

  const handleChatWithCustomer = (customer: Customer) => {
    setActiveChatCustomer(customer);
  };

  const handleCloseChatInterface = () => {
    setActiveChatCustomer(null);
  };

  const toggleCustomerExpansion = (customerId: number) => {
    setExpandedCustomerId(expandedCustomerId === customerId ? null : customerId);
  };

  const toggleQRForCustomer = (customerId: number) => {
    setShowQRForCustomer(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
    
    if (!showQRForCustomer[customerId]) {
      toast({
        title: "QR Code 已生成！",
        description: "其他人可以掃描此 QR Code 來獲取客戶名片。",
      });
    }
  };

  const handleShareCustomer = (customer: Customer) => {
    toast({
      title: "分享成功！",
      description: `${customer.name} 的電子名片已準備好分享。`,
    });
  };

  const filterCustomers = (list: Customer[]) => {
    return list.filter(customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm) || customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const renderCustomerList = (list: Customer[], showCardIcon: boolean) => {
    const filteredList = filterCustomers(list);
    if (filteredList.length === 0) {
      return <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>目前沒有客戶</p>
        </div>;
    }
    return <div className="space-y-3">
        {filteredList.map(customer => <div key={customer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Customer Header */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {customer.photo ? <img src={customer.photo} alt={customer.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {customer.name.charAt(0)}
                    </div>}
                  
                  <div className="flex-1">
                    {editingId === customer.id ? <div className="flex items-center space-x-2">
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="text-sm" />
                        <Button size="sm" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                          確認
                        </Button>
                      </div> : <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-800">{customer.name}</h3>
                          {showCardIcon && customer.hasCard && <UserCheck className="w-4 h-4 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{customer.company}</p>
                        {customer.jobTitle && <p className="text-xs text-gray-500">{customer.jobTitle}</p>}
                      </div>}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {editingId !== customer.id && <>
                      <Button variant="ghost" size="sm" onClick={() => handleChatWithCustomer(customer)} className="text-green-600 hover:text-green-700">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleCustomerExpansion(customer.id)} className="text-gray-500 hover:text-blue-600">
                        {expandedCustomerId === customer.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>}
                </div>
              </div>
            </div>

            {/* Expanded Customer Details */}
            {expandedCustomerId === customer.id && <div className="border-t border-gray-100">
                {customer.hasCard ? (
                  <div className="p-4">
                    {/* Electronic Business Card Preview */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl p-6 text-white">
                        <div className="flex items-center space-x-4 mb-4">
                          {customer.photo ? (
                            <img
                              src={customer.photo}
                              alt="照片"
                              className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {customer.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold mb-1">{customer.name}</h3>
                            {customer.company && (
                              <p className="text-blue-100 text-sm">{customer.company}</p>
                            )}
                            {customer.jobTitle && (
                              <p className="text-blue-200 text-xs">{customer.jobTitle}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {customer.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          {customer.website && (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>{customer.website}</span>
                            </div>
                          )}
                        </div>

                        {/* Social Media Links */}
                        {(customer.line || customer.facebook || customer.instagram) && (
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-sm text-blue-100 mb-2">社群媒體</p>
                            <div className="space-y-1 text-sm">
                              {customer.line && <div>LINE: {customer.line}</div>}
                              {customer.facebook && <div>Facebook: {customer.facebook}</div>}
                              {customer.instagram && <div>Instagram: {customer.instagram}</div>}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* QR Code and Share Section - Inside the card */}
                      <div className="bg-gray-50 p-4 rounded-b-xl">
                        {/* QR Code */}
                        {showQRForCustomer[customer.id] && (
                          <div className="mb-4 text-center">
                            <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <QrCode className="w-16 h-16 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-600">掃描 QR Code 獲取名片</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => toggleQRForCustomer(customer.id)}
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
                          >
                            <QrCode className="w-3 h-3 mr-1" />
                            QR Code
                          </Button>
                          
                          <Button
                            onClick={() => handleShareCustomer(customer)}
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs h-8"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            分享
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 flex items-center space-x-2">
                          <StickyNote className="w-4 h-4" />
                          <span>備註</span>
                        </h5>
                        {!editingNotes[customer.id] && <Button size="sm" variant="ghost" onClick={() => handleEditNotes(customer.id, customer.notes)} className="text-blue-600 hover:text-blue-700">
                            <Edit3 className="w-3 h-3 mr-1" />
                            編輯
                          </Button>}
                      </div>
                      
                      {editingNotes[customer.id] ? <div className="space-y-2">
                          <Textarea
                            value={tempNotes[customer.id] || ''}
                            onChange={e => setTempNotes(prev => ({
                              ...prev,
                              [customer.id]: e.target.value
                            }))}
                            placeholder="新增客戶備註..."
                            className="w-full text-sm resize-none"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleSaveNotes(customer.id)} className="bg-green-500 hover:bg-green-600">
                              <Save className="w-3 h-3 mr-1" />
                              儲存
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingNotes(prev => ({
                    ...prev,
                    [customer.id]: false
                  }))}>
                              取消
                            </Button>
                          </div>
                        </div> : <p className="text-sm text-gray-600">
                          {customer.notes || '尚無備註'}
                        </p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleScheduleAppointment(customer)}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                        size="sm"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        安排行程
                      </Button>
                      <Button
                        onClick={() => handleChatWithCustomer(customer)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        開始對話
                      </Button>
                    </div>
                  </div>) : (
                  <div className="p-4 space-y-2 bg-gray-50">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      加入時間: {new Date(customer.addedDate).toLocaleDateString('zh-TW')}
                    </p>
                  </div>)}
              </div>}
          </div>)}
      </div>;
  };

  if (activeChatCustomer) {
    return <ChatInterface customer={activeChatCustomer} onClose={handleCloseChatInterface} />;
  }

  if (showSchedule) {
    return <Schedule onClose={handleCloseSchedule} />;
  }

  return <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">我的客戶</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋客戶姓名、電話或信箱..."
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'customers'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            我的客戶 ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('invited')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'invited'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            已邀請 ({invited.length})
          </button>
        </div>

        {/* Customer Lists */}
        <div className="pb-20">
          {activeTab === 'customers' ? (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">我的客戶</h2>
                <p className="text-sm text-gray-600">已加入您名片的客戶列表</p>
              </div>
              {renderCustomerList(customers, true)}
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">已邀請</h2>
                <p className="text-sm text-gray-600">已發送邀請但尚未加入的客戶</p>
              </div>
              {renderCustomerList(invited, false)}
              {invited.length > 0 && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    💡 提示：這些客戶已收到您的邀請，一旦他們建立 AILE 名片並加入，就會自動移到「我的客戶」列表中。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>;
};

export default MyCustomers;
