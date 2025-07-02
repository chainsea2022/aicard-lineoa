import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, MessageCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import ChatInterface from './ChatInterface';

interface MyCustomersProps {
  onClose: () => void;
  customers?: any[];
  onCustomersUpdate?: (customers: any[]) => void;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  photo: string | null;
  isAileUser: boolean;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  addedVia: string;
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers: propCustomers = [], onCustomersUpdate }) => {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([
    // 新增模擬數據來示範不同類型的客戶
    {
      id: 1,
      name: '陳小明',
      phone: '0912345678',
      email: 'chen@example.com',
      company: 'ABC 公司',
      photo: null,
      isAileUser: true, // Aile 用戶
      addedVia: 'qrcode'
    },
    {
      id: 2,
      name: '李小華',
      phone: '0987654321',
      email: 'lee@example.com',
      company: 'XYZ 企業',
      photo: null,
      isAileUser: false, // 一般掃描客戶
      addedVia: 'qrcode'
    }
  ]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<number[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (propCustomers.length > 0) {
      setCustomers(prev => {
        const existingIds = prev.map(c => c.id);
        const newCustomers = propCustomers.filter(c => !existingIds.includes(c.id));
        const updated = [...prev, ...newCustomers];
        return updated;
      });
    }
  }, [propCustomers]);

  const simulatePhoneCheck = (phone: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = phone.startsWith('09') && phone.length === 10;
        resolve(isValid);
      }, 1000);
    });
  };

  const handleAddCustomer = async () => {
    const isValidPhone = await simulatePhoneCheck(newCustomerPhone);
    if (!isValidPhone) {
      alert('請輸入有效的電話號碼 (09 開頭，共 10 碼)');
      return;
    }

    const newCustomer: Customer = {
      id: Date.now(),
      name: newCustomerName,
      phone: newCustomerPhone,
      email: '',
      company: '',
      photo: null,
      isAileUser: false,
      addedVia: 'manual'
    };

    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    setIsAddCustomerOpen(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
  };

  const toggleCustomerExpansion = (customerId: number) => {
    setExpandedCustomerIds(prevIds =>
      prevIds.includes(customerId)
        ? prevIds.filter(id => id !== customerId)
        : [...prevIds, customerId]
    );
  };

  const isCustomerExpanded = (customerId: number) => {
    return expandedCustomerIds.includes(customerId);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditing(true);
  };

  const handleSaveCustomer = (updatedCustomer: Customer) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    setIsEditing(false);
    setEditingCustomer(null);
  };

  const renderCustomerCard = (customer: Customer, isExpanded: boolean) => (
    <div className="space-y-3">
      {/* Customer Info Display */}
      <div className="flex items-center space-x-3">
        {customer.photo ? (
          <img
            src={customer.photo}
            alt={customer.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
            {customer.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-800">{customer.name}</h3>
            {/* 客戶類型標識 */}
            {customer.isAileUser ? (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Aile
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                客戶
              </span>
            )}
          </div>
          {customer.company && (
            <p className="text-sm text-gray-600">{customer.company}</p>
          )}
          <p className="text-xs text-gray-500">{customer.phone}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const chatCustomer = {
                id: customer.id,
                name: customer.name,
                photo: customer.photo,
                company: customer.company
              };
              setSelectedCustomer(chatCustomer);
              setShowChatInterface(true);
            }}
            className="text-green-600 hover:text-green-700"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleCustomerExpansion(customer.id)}
            className="text-gray-600 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Electronic Business Card */}
      {isExpanded && (customer.isAileUser || customer.email) && (
        <div className="ml-4 border-l-2 border-gray-200 pl-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              {customer.photo && (
                <img
                  src={customer.photo}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
              )}
              <div>
                <h4 className="font-bold">{customer.name}</h4>
                {customer.company && <p className="text-xs text-blue-100">{customer.company}</p>}
              </div>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.website && (
                <div className="flex items-center space-x-2">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span>{customer.website}</span>
                </div>
              )}
            </div>

            {/* 社群媒體連結 */}
            {(customer.line || customer.facebook || customer.instagram) && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-blue-100 mb-1">社群媒體</p>
                <div className="space-y-1 text-xs">
                  {customer.line && <div>LINE: {customer.line}</div>}
                  {customer.facebook && <div>Facebook: {customer.facebook}</div>}
                  {customer.instagram && <div>Instagram: {customer.instagram}</div>}
                </div>
              </div>
            )}

            {/* 編輯按鈕 */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <Button
                size="sm"
                onClick={() => handleEditCustomer(customer)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                編輯電子名片
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddCustomerOpen(true)}
            className="text-white hover:bg-white/20"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {customers.map(customer => (
            <React.Fragment key={customer.id}>
              {renderCustomerCard(customer, isCustomerExpanded(customer.id))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新增客戶</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                姓名
              </Label>
              <Input
                id="name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                電話
              </Label>
              <Input
                id="phone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddCustomer}>
              新增
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Interface */}
      {showChatInterface && selectedCustomer && (
        <ChatInterface
          customer={selectedCustomer}
          onClose={() => setShowChatInterface(false)}
        />
      )}

      {/* Edit Customer Dialog */}
      {isEditing && editingCustomer && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>編輯客戶</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  姓名
                </Label>
                <Input
                  id="name"
                  value={editingCustomer.name}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  電話
                </Label>
                <Input
                  id="phone"
                  value={editingCustomer.phone}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  公司
                </Label>
                <Input
                  id="company"
                  value={editingCustomer.company || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, company: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => handleSaveCustomer(editingCustomer)}
              >
                儲存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyCustomers;
