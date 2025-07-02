import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, MessageCircle, ChevronDown, ChevronUp, Zap, Upload, Save, X, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from '@/hooks/use-toast';
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
  position?: string;
  photo: string | null;
  isAileUser: boolean;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  description?: string;
  addedVia: string;
  status: 'joined' | 'invited'; // 新增狀態欄位
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers: propCustomers = [], onCustomersUpdate }) => {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([
    // 模擬數據
    {
      id: 1,
      name: '陳小明',
      phone: '0912345678',
      email: 'chen@example.com',
      company: 'ABC 公司',
      position: '經理',
      photo: null,
      isAileUser: true,
      addedVia: 'qrcode',
      status: 'joined'
    },
    {
      id: 2,
      name: '李小華',
      phone: '0987654321',
      email: 'lee@example.com',
      company: 'XYZ 企業',
      position: '主管',
      photo: null,
      isAileUser: false,
      addedVia: 'qrcode',
      status: 'joined'
    },
    {
      id: 3,
      name: '王大明',
      phone: '0911111111',
      email: 'wang@example.com',
      company: '123 科技',
      position: '工程師',
      photo: null,
      isAileUser: false,
      addedVia: 'manual',
      status: 'invited'
    }
  ]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<number[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('joined');

  // 新增客戶表單狀態
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    website: '',
    line: '',
    facebook: '',
    instagram: '',
    address: '',
    description: ''
  });

  // 匯入文件狀態
  const [importFile, setImportFile] = useState<File | null>(null);

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

  // 過濾客戶列表
  const joinedCustomers = customers.filter(c => c.status === 'joined');
  const invitedCustomers = customers.filter(c => c.status === 'invited');

  const simulatePhoneCheck = (phone: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = phone.startsWith('09') && phone.length === 10;
        resolve(isValid);
      }, 1000);
    });
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('請輸入姓名和電話');
      return;
    }

    const isValidPhone = await simulatePhoneCheck(newCustomer.phone);
    if (!isValidPhone) {
      alert('請輸入有效的電話號碼 (09 開頭，共 10 碼)');
      return;
    }

    // 模擬檢查是否為 Aile 用戶
    const isAileUser = Math.random() > 0.5; // 50% 機率

    const customer: Customer = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || '',
      company: newCustomer.company || '',
      position: newCustomer.position || '',
      photo: null,
      isAileUser,
      website: newCustomer.website || '',
      line: newCustomer.line || '',
      facebook: newCustomer.facebook || '',
      instagram: newCustomer.instagram || '',
      address: newCustomer.address || '',
      description: newCustomer.description || '',
      addedVia: 'manual',
      status: isAileUser ? 'joined' : 'invited'
    };

    if (!isAileUser) {
      // 如果不是 Aile 用戶，顯示邀請對話框
      setPendingCustomer(customer);
      setIsInviteDialogOpen(true);
      setIsAddCustomerOpen(false);
    } else {
      // 如果是 Aile 用戶，直接加入客戶列表
      setCustomers(prevCustomers => [...prevCustomers, customer]);
      setIsAddCustomerOpen(false);
      setNewCustomer({
        name: '',
        phone: '',
        email: '',
        company: '',
        position: '',
        website: '',
        line: '',
        facebook: '',
        instagram: '',
        address: '',
        description: ''
      });
      
      toast({
        title: "客戶已加入！",
        description: `${customer.name} 已成功加入您的客戶名單。`,
      });
    }
  };

  const handleSendSMSInvitation = () => {
    if (pendingCustomer) {
      const registrationUrl = 'https://aile.app/register';
      const message = `您好！邀請您加入 AILE 電子名片，享受智能商務服務。請點擊註冊：${registrationUrl}`;
      
      toast({
        title: "簡訊邀請已發送！",
        description: `邀請註冊連結已發送給 ${pendingCustomer.name}`,
      });
      
      console.log('SMS內容:', message);
    }
  };

  const handleSendEmailInvitation = () => {
    if (pendingCustomer) {
      toast({
        title: "Email 已發送！",
        description: `邀請連結已透過Email發送給 ${pendingCustomer.name}。`,
      });
    }
  };

  const handleCompleteInvitation = () => {
    if (pendingCustomer) {
      setCustomers(prevCustomers => [...prevCustomers, pendingCustomer]);
      setIsInviteDialogOpen(false);
      setPendingCustomer(null);
      setNewCustomer({
        name: '',
        phone: '',
        email: '',
        company: '',
        position: '',
        website: '',
        line: '',
        facebook: '',
        instagram: '',
        address: '',
        description: ''
      });
      
      toast({
        title: "客戶已加入已邀請列表！",
        description: `${pendingCustomer.name} 已加入您的已邀請列表。`,
      });
    }
  };

  const handleImportFile = () => {
    if (!importFile) {
      alert('請選擇要匯入的檔案');
      return;
    }

    // 模擬匯入邏輯
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // 假設匯入的是 JSON 格式的客戶數據
        const importedCustomers = data.map((item: any, index: number) => ({
          id: Date.now() + index,
          name: item.name || '未知',
          phone: item.phone || '',
          email: item.email || '',
          company: item.company || '',
          position: item.position || '',
          photo: null,
          isAileUser: false,
          addedVia: 'import',
          status: 'invited'
        }));
        
        setCustomers(prev => [...prev, ...importedCustomers]);
        setIsImportOpen(false);
        setImportFile(null);
      } catch (error) {
        alert('檔案格式錯誤，請確認是正確的 JSON 格式');
      }
    };
    reader.readAsText(importFile);
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="space-y-3">
        {/* Customer Info Display - LINE style */}
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
            {customer.position && (
              <p className="text-xs text-gray-500">{customer.position}</p>
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
              onClick={() => handleEditCustomer(customer)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
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
        {isExpanded && (
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
                  {customer.position && <p className="text-xs text-blue-100">{customer.position}</p>}
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
            </div>
          </div>
        )}
      </div>
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
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="text-white hover:bg-white/20"
            >
              <Upload className="w-5 h-5" />
            </Button>
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
      </div>

      {/* Customer Lists with Tabs */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joined">我的客戶 ({joinedCustomers.length})</TabsTrigger>
            <TabsTrigger value="invited">已邀請 ({invitedCustomers.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="joined" className="mt-4">
            <div className="space-y-4">
              {joinedCustomers.map(customer => (
                <React.Fragment key={customer.id}>
                  {renderCustomerCard(customer, isCustomerExpanded(customer.id))}
                </React.Fragment>
              ))}
              {joinedCustomers.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  尚無已加入的客戶
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="invited" className="mt-4">
            <div className="space-y-4">
              {invitedCustomers.map(customer => (
                <React.Fragment key={customer.id}>
                  {renderCustomerCard(customer, isCustomerExpanded(customer.id))}
                </React.Fragment>
              ))}
              {invitedCustomers.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  尚無已邀請的客戶
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增客戶</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">姓名 *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">電話 *</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">公司</Label>
              <Input
                id="company"
                value={newCustomer.company}
                onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">職位</Label>
              <Input
                id="position"
                value={newCustomer.position}
                onChange={(e) => setNewCustomer({...newCustomer, position: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">網站</Label>
              <Input
                id="website"
                value={newCustomer.website}
                onChange={(e) => setNewCustomer({...newCustomer, website: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="line" className="text-right">LINE</Label>
              <Input
                id="line"
                value={newCustomer.line}
                onChange={(e) => setNewCustomer({...newCustomer, line: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">地址</Label>
              <Textarea
                id="address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                className="col-span-3"
                rows={2}
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

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>匯入客戶</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">選擇檔案</Label>
              <Input
                id="file"
                type="file"
                accept=".json,.csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
            <div className="text-sm text-gray-500">
              支援 JSON 格式檔案，請確保包含 name, phone, email, company 等欄位
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleImportFile}>
              匯入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invitation Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>邀請客戶加入 AILE</DialogTitle>
          </DialogHeader>
          {pendingCustomer && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-2">
                  📱 {pendingCustomer.name} 尚未註冊 AILE 電子名片
                </p>
                <p className="text-xs text-blue-600">
                  您可以透過簡訊或 Email 發送邀請連結，邀請客戶註冊 AILE 享受智能商務服務。
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">發送簡訊邀請</p>
                      <p className="text-xs text-gray-500">{pendingCustomer.phone}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendSMSInvitation}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    發送
                  </Button>
                </div>
                
                {pendingCustomer.email && (
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">發送 Email 邀請</p>
                        <p className="text-xs text-gray-500">{pendingCustomer.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendEmailInvitation}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      發送
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col space-y-2">
            <Button
              onClick={handleCompleteInvitation}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              完成並加入已邀請列表
            </Button>
            <Button
              onClick={() => {
                setIsInviteDialogOpen(false);
                setPendingCustomer(null);
                setIsAddCustomerOpen(true);
              }}
              variant="outline"
              className="w-full"
            >
              返回編輯客戶資料
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
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>編輯客戶</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">姓名</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">電話</Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer.phone}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">公司</Label>
                <Input
                  id="edit-company"
                  value={editingCustomer.company || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, company: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-position" className="text-right">職位</Label>
                <Input
                  id="edit-position"
                  value={editingCustomer.position || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, position: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-website" className="text-right">網站</Label>
                <Input
                  id="edit-website"
                  value={editingCustomer.website || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, website: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-line" className="text-right">LINE</Label>
                <Input
                  id="edit-line"
                  value={editingCustomer.line || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, line: e.target.value })
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
