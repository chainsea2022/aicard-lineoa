
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, MessageCircle, ChevronDown, ChevronUp, Zap, Upload, Save, MessageSquare, Mail, Search, Star, Users, Calendar, Share, Phone, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from '@/hooks/use-toast';
import ChatInterface from './ChatInterface';

interface MyCustomersProps {
  onClose: () => void;
  customers?: any[];
  onCustomersUpdate?: (customers: any[]) => void;
  onScheduleUpdate?: (schedules: any[]) => void;
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
  status: 'joined' | 'invited';
  industry?: string;
  isFavorite?: boolean;
  notes?: string;
  schedules?: Schedule[];
}

interface Schedule {
  id: number;
  customerId: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  attendees?: string[];
  type: 'meeting' | 'call' | 'email';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers: propCustomers = [], onCustomersUpdate, onScheduleUpdate }) => {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
  const [selectedCustomerForSchedule, setSelectedCustomerForSchedule] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([
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
      status: 'joined',
      industry: '科技',
      isFavorite: false,
      notes: '',
      schedules: []
    },
    {
      id: 2,
      name: 'lee_xiahua',
      phone: '0987654321',
      email: 'lee@example.com',
      company: '',
      position: '',
      photo: null,
      isAileUser: false,
      addedVia: 'qrcode',
      status: 'joined',
      industry: '',
      isFavorite: true,
      notes: '',
      line: 'lee_xiahua',
      schedules: [{ id: 1, customerId: 2, title: '商務會議', date: new Date().toISOString().split('T')[0], time: '14:00', type: 'meeting', status: 'scheduled' }]
    },
    {
      id: 3,
      name: 'wang_daming',
      phone: '0911111111',
      email: 'wang@example.com',
      company: '',
      position: '',
      photo: null,
      isAileUser: false,
      addedVia: 'manual',
      status: 'invited',
      industry: '',
      isFavorite: false,
      notes: '',
      line: 'wang_daming',
      schedules: []
    }
  ]);
  const [expandedCustomerIds, setExpandedCustomerIds] = useState<number[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('joined');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'aile' | 'customer' | 'favorites'>('all');

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
    description: '',
    industry: '',
    notes: ''
  });

  const [newSchedule, setNewSchedule] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    attendees: '',
    type: 'meeting' as Schedule['type']
  });

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

  const filterCustomers = (customerList: Customer[]) => {
    return customerList.filter(customer => {
      const matchesSearch = searchQuery === '' || 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        customer.phone.includes(searchQuery) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (customer.line && customer.line.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'all' || 
        (filterType === 'aile' && customer.isAileUser) ||
        (filterType === 'customer' && !customer.isAileUser) ||
        (filterType === 'favorites' && customer.isFavorite);
      
      return matchesSearch && matchesType;
    });
  };

  const joinedCustomers = filterCustomers(customers.filter(c => c.status === 'joined'));
  const invitedCustomers = filterCustomers(customers.filter(c => c.status === 'invited'));

  const toggleFavorite = (customerId: number) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(c => 
        c.id === customerId ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  };

  const hasScheduleToday = (customer: Customer) => {
    const today = new Date().toISOString().split('T')[0];
    return customer.schedules?.some(schedule => schedule.date === today) || false;
  };

  const getTodaySchedule = (customer: Customer) => {
    const today = new Date().toISOString().split('T')[0];
    return customer.schedules?.find(schedule => schedule.date === today);
  };

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

    const isAileUser = Math.random() > 0.5;

    const customer: Customer = {
      id: Date.now(),
      name: newCustomer.name!,
      phone: newCustomer.phone!,
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
      industry: newCustomer.industry || '',
      addedVia: 'manual',
      status: isAileUser ? 'joined' : 'invited',
      isFavorite: false,
      notes: newCustomer.notes || '',
      schedules: []
    };

    if (!isAileUser) {
      setPendingCustomer(customer);
      setIsInviteDialogOpen(true);
      setIsAddCustomerOpen(false);
    } else {
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
        description: '',
        industry: '',
        notes: ''
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
        description: '',
        industry: '',
        notes: ''
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

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
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
          status: 'invited',
          industry: item.industry || '',
          isFavorite: false,
          notes: '',
          schedules: []
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
    toast({
      title: "客戶資料已更新",
      description: "客戶資料已成功儲存",
    });
  };

  const handleSaveCustomerNotes = (customerId: number, notes: string) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(c => (c.id === customerId ? { ...c, notes } : c))
    );
    toast({
      title: "備註已儲存",
      description: "客戶備註已成功更新",
    });
  };

  const handleShareCard = (customer: Customer) => {
    const shareText = `分享 ${customer.name} 的 AILE 電子名片`;
    const shareUrl = `https://aile.app/card/${customer.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "連結已複製！",
        description: "電子名片連結已複製到剪貼簿",
      });
    }
  };

  const handleOpenSchedule = (customer: Customer) => {
    setSelectedCustomerForSchedule(customer);
    setNewSchedule({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      attendees: '',
      type: 'meeting'
    });
    setIsScheduleDialogOpen(true);
  };

  const handleAddSchedule = () => {
    if (!selectedCustomerForSchedule || !newSchedule.title || !newSchedule.date || !newSchedule.time) {
      toast({
        title: "請填寫完整資訊",
        description: "標題、日期和時間為必填欄位",
      });
      return;
    }

    const schedule: Schedule = {
      id: Date.now(),
      customerId: selectedCustomerForSchedule.id,
      title: newSchedule.title,
      date: newSchedule.date,
      time: newSchedule.time,
      location: newSchedule.location,
      description: newSchedule.description,
      attendees: newSchedule.attendees ? newSchedule.attendees.split(',').map(name => name.trim()).filter(name => name) : [],
      type: newSchedule.type,
      status: 'scheduled'
    };

    // Update customer schedules
    setCustomers(prevCustomers =>
      prevCustomers.map(c => 
        c.id === selectedCustomerForSchedule.id 
          ? { ...c, schedules: [...(c.schedules || []), schedule] }
          : c
      )
    );

    // Sync with schedule management system
    if (onScheduleUpdate) {
      onScheduleUpdate([schedule]);
    }

    setIsScheduleDialogOpen(false);
    setSelectedCustomerForSchedule(null);
    setNewSchedule({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      attendees: '',
      type: 'meeting'
    });

    toast({
      title: "行程已新增",
      description: `已為 ${selectedCustomerForSchedule.name} 新增行程，並同步至行程管理系統`,
    });
  };

  const renderCustomerCard = (customer: Customer, isExpanded: boolean) => {
    const todaySchedule = getTodaySchedule(customer);
    
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {customer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-800">{customer.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(customer.id)}
                    className="p-1 h-auto"
                  >
                    <Star className={`w-4 h-4 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                  </Button>
                  {customer.isAileUser && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Zap className="w-3 h-3" />
                      <span>Aile</span>
                    </span>
                  )}
                </div>
                
                {/* 未展開時顯示公司或LINE帳號 */}
                {!isExpanded && (
                  <div className="text-sm text-gray-600">
                    {customer.isAileUser ? (
                      customer.company || '未提供公司資訊'
                    ) : (
                      customer.line ? `LINE: ${customer.line}` : '未提供LINE帳號'
                    )}
                  </div>
                )}
                
                {/* 今日行程提醒 */}
                {!isExpanded && todaySchedule && (
                  <div className="mt-1 flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit">
                    <Clock className="w-3 h-3" />
                    <span>今日 {todaySchedule.time} {todaySchedule.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCustomerExpansion(customer.id)}
              className="p-2"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 展開內容 */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">電話：</span>
                <span className="text-gray-800">{customer.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">Email：</span>
                <span className="text-gray-800">{customer.email || '未提供'}</span>
              </div>
              <div>
                <span className="text-gray-500">公司：</span>
                <span className="text-gray-800">{customer.company || '未提供'}</span>
              </div>
              <div>
                <span className="text-gray-500">職位：</span>
                <span className="text-gray-800">{customer.position || '未提供'}</span>
              </div>
              {customer.line && (
                <div>
                  <span className="text-gray-500">LINE：</span>
                  <span className="text-gray-800">{customer.line}</span>
                </div>
              )}
              {customer.website && (
                <div>
                  <span className="text-gray-500">網站：</span>
                  <span className="text-gray-800">{customer.website}</span>
                </div>
              )}
            </div>

            {/* 行程區塊 */}
            {customer.schedules && customer.schedules.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-2">近期行程</h4>
                <div className="space-y-2">
                  {customer.schedules.slice(0, 2).map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{schedule.title}</span>
                        <span className="text-gray-500 ml-2">
                          {new Date(schedule.date).toLocaleDateString('zh-TW')} {schedule.time}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                        schedule.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {schedule.status === 'scheduled' ? '已安排' :
                         schedule.status === 'completed' ? '已完成' : '已取消'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 備註區塊 */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-800 mb-2">備註</h4>
              <textarea
                value={customer.notes || ''}
                onChange={(e) => {
                  const updatedCustomer = { ...customer, notes: e.target.value };
                  setCustomers(prevCustomers =>
                    prevCustomers.map(c => (c.id === customer.id ? updatedCustomer : c))
                  );
                }}
                placeholder="添加客戶備註..."
                className="w-full p-2 border border-gray-200 rounded-md text-sm resize-none"
                rows={3}
              />
              <Button
                size="sm"
                onClick={() => handleSaveCustomerNotes(customer.id, customer.notes || '')}
                className="mt-2"
              >
                <Save className="w-3 h-3 mr-1" />
                儲存備註
              </Button>
            </div>

            {/* 操作按鈕 */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditCustomer(customer)}
                className="flex items-center space-x-1"
              >
                <Edit className="w-3 h-3" />
                <span>編輯</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenSchedule(customer)}
                className="flex items-center space-x-1"
              >
                <Calendar className="w-3 h-3" />
                <span>行程</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowChatInterface(true);
                }}
                className="flex items-center space-x-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>對話</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShareCard(customer)}
                className="flex items-center space-x-1"
              >
                <Share className="w-3 h-3" />
                <span>分享</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
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
            <h1 className="font-bold text-lg">名片人脈夾</h1>
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

      <div className="p-4 bg-gray-50 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜尋名片姓名、公司、電話或信箱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === 'favorites' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('favorites')}
            className="flex items-center space-x-1"
          >
            <Star className={`w-3 h-3 ${filterType === 'favorites' ? 'fill-current' : ''}`} />
            <span>關注</span>
          </Button>
          
          <Button
            variant={filterType === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            全部
          </Button>
          
          <Button
            variant={filterType === 'aile' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('aile')}
            className="flex items-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>Aile</span>
          </Button>
          
          <Button
            variant={filterType === 'customer' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('customer')}
            className="flex items-center space-x-1"
          >
            <Users className="w-3 h-3" />
            <span>聯絡人</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joined">我的名片夾 ({joinedCustomers.length})</TabsTrigger>
            <TabsTrigger value="invited">聯絡人 ({invitedCustomers.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="joined" className="mt-4">
            <div className="space-y-2">
              {joinedCustomers.map(customer => (
                <React.Fragment key={customer.id}>
                  {renderCustomerCard(customer, isCustomerExpanded(customer.id))}
                </React.Fragment>
              ))}
              {joinedCustomers.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchQuery || filterType !== 'all' 
                    ? '沒有符合條件的名片'
                    : '尚無名片，快去與他人交換名片吧！'
                  }
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="invited" className="mt-4">
            <div className="space-y-2">
              {invitedCustomers.map(customer => (
                <React.Fragment key={customer.id}>
                  {renderCustomerCard(customer, isCustomerExpanded(customer.id))}
                </React.Fragment>
              ))}
              {invitedCustomers.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  {searchQuery || filterType !== 'all'
                    ? '沒有符合條件的聯絡人'
                    : '尚無聯絡人，可透過掃描或匯入建立聯絡人清單'
                  }
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">備註</Label>
              <Textarea
                id="notes"
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
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

      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新增行程</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-title" className="text-right">會議標題 *</Label>
              <Input
                id="schedule-title"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                placeholder="輸入會議標題"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">
                  日期 *
                </Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 mb-1">
                  時間 *
                </Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-attendees" className="text-right">參與者</Label>
              <Input
                id="schedule-attendees"
                value={newSchedule.attendees}
                onChange={(e) => setNewSchedule({...newSchedule, attendees: e.target.value})}
                placeholder="張小明, 李小華"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-type" className="text-right">類型</Label>
              <select
                id="schedule-type"
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({...newSchedule, type: e.target.value as Schedule['type']})}
                className="col-span-3 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="meeting">會議</option>
                <option value="call">通話</option>
                <option value="email">信件</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-location" className="text-right">地點</Label>
              <Input
                id="schedule-location"
                value={newSchedule.location}
                onChange={(e) => setNewSchedule({...newSchedule, location: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="schedule-description" className="text-right">描述</Label>
              <Textarea
                id="schedule-description"
                value={newSchedule.description}
                onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleAddSchedule}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600"
            >
              建立
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showChatInterface && selectedCustomer && (
        <ChatInterface
          customer={selectedCustomer}
          onClose={() => setShowChatInterface(false)}
        />
      )}

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
                <Label htmlFor="edit-industry" className="text-right">產業</Label>
                <Input
                  id="edit-industry"
                  value={editingCustomer.industry || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, industry: e.target.value })
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">備註</Label>
                <Textarea
                  id="edit-notes"
                  value={editingCustomer.notes || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, notes: e.target.value })
                  }
                  className="col-span-3"
                  rows={3}
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
