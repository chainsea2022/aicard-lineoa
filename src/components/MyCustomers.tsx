
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserCheck, Edit3, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface MyCustomersProps {
  onClose: () => void;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  hasCard: boolean;
  addedDate: string;
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invited, setInvited] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<'customers' | 'invited'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

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
    const updatedCustomers = allCustomers.map(customer => 
      customer.id === editingId ? { ...customer, name: editName } : customer
    );
    
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    
    const customersList = updatedCustomers.filter(c => c.hasCard);
    const invitedList = updatedCustomers.filter(c => !c.hasCard);
    
    setCustomers(customersList);
    setInvited(invitedList);
    setEditingId(null);
    setEditName('');
    
    toast({
      title: "客戶名稱已更新！",
      description: "客戶資訊已成功更新。",
    });
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
      description: "客戶已從名單中移除。",
    });
  };

  const filterCustomers = (list: Customer[]) => {
    return list.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderCustomerList = (list: Customer[], showCardIcon: boolean) => {
    const filteredList = filterCustomers(list);
    
    if (filteredList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>目前沒有客戶</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredList.map((customer) => (
          <div
            key={customer.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {customer.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  {editingId === customer.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        確認
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-800">{customer.name}</h3>
                        {showCardIcon && customer.hasCard && (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        加入時間: {new Date(customer.addedDate).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {editingId !== customer.id && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(customer)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(customer.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
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
    </div>
  );
};

export default MyCustomers;
