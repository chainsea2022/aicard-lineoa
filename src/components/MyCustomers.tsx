import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, MessageCircle, ChevronDown, ChevronUp, Zap, Upload, Save, X, MessageSquare, Mail, Search, Filter, Star, Users, Building2, Calendar, Share, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  status: 'joined' | 'invited';
  industry?: string;
  isFavorite?: boolean;
  notes?: string;
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers: propCustomers = [], onCustomersUpdate }) => {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);
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
      notes: ''
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
      status: 'joined',
      industry: '金融',
      isFavorite: true,
      notes: ''
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
      status: 'invited',
      industry: '科技',
      isFavorite: false,
      notes: ''
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
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

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

  const [importFile, setImportFile] = useState<File | null>(null);

  const industries = ['all', ...Array.from(new Set(customers.map(c => c.industry).filter(Boolean)))];

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
        customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || 
        (filterType === 'aile' && customer.isAileUser) ||
        (filterType === 'customer' && !customer.isAileUser) ||
        (filterType === 'favorites' && customer.isFavorite);

      const matchesIndustry = filterIndustry === 'all' || customer.industry === filterIndustry;

      return matchesSearch && matchesType && matchesIndustry;
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
      industry: newCustomer.industry || '',
      addedVia: 'manual',
      status: isAileUser ? 'joined' : 'invited',
      isFavorite: false,
      notes: newCustomer.notes || ''
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
          notes: ''
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
    // 發送行事曆通知功能
    const eventTitle = `與 ${customer.name} 的會議`;
    const eventDetails = {
      title: eventTitle,
      description: `與 ${customer.company} 的 ${customer.name} 進行商務會議`,
      location: customer.address || '待定',
      attendees: [customer.email].filter(Boolean)
    };

    // 模擬發送行事曆邀請
    toast({
      title: "行事曆通知已發送",
      description: `已向 ${customer.name} 發送會議邀請通知`,
    });

    console.log('Calendar event details:', eventDetails);
  };

  const renderCustomerCard = (customer: Customer, isExpanded: boolean) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {!isExpanded ? (
        <div className="p-3">
          <div className="flex items-center space-x-3 h-14">
            {customer.photo ? (
              <img
                src={customer.photo}
                alt={customer.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {customer.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-gray-800 text-sm truncate">{customer.name}</h3>
                {customer.isAileUser ? (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full flex items-center flex-shrink-0">
                    <Zap className="w-3 h-3 mr-1" />
                    Aile
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                    客戶
                  </span>
                )}
              </div>
              {customer.company && (
                <p className="text-xs text-gray-500 truncate">{customer.company}</p>
              )}
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(customer.id)}
                className={`p-1 h-8 w-8 ${customer.isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"}`}
              >
                <Star className={`w-4 h-4 ${customer.isFavorite ? 'fill-current' : ''}`} />
              </Button>
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
                className="text-green-600 hover:text-green-700 p-1 h-8 w-8"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCustomerExpansion(customer.id)}
                className="text-gray-600 hover:text-gray-700 p-1 h-8 w-8"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {customer.isAileUser ? (
            <div>
              <div className="flex items-center space-x-3 mb-4">
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
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Aile
                    </span>
                    {customer.industry && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {customer.industry}
                      </span>
                    )}
                  </div>
                  {customer.company && (
                    <p className="text-sm text-gray-600">{customer.company}</p>
                  )}
                  {customer.position && (
                    <p className="text-xs text-gray-500">{customer.position}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(customer.id)}
                    className={customer.isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"}
                  >
                    <Star className={`w-4 h-4 ${customer.isFavorite ? 'fill-current' : ''}`} />
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
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

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
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.website && (
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 text-center">🌐</span>
                      <span>{customer.website}</span>
                    </div>
                  )}
                </div>

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

                <div className="mt-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => handleOpenSchedule(customer)}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    行程
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => handleShareCard(customer)}
                  >
                    <Share className="w-4 h-4 mr-1" />
                    分享
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    聊天
                  </Button>
                </div>

                {/* 備註區塊 */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">備註</span>
                  </div>
                  <Textarea
                    placeholder="新增備註..."
                    value={customer.notes || ''}
                    onChange={(e) => {
                      const updatedCustomer = { ...customer, notes: e.target.value };
                      setCustomers(prevCustomers =>
                        prevCustomers.map(c => (c.id === customer.id ? updatedCustomer : c))
                      );
                    }}
                    className="min-h-[60px] text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
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
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      客戶
                    </span>
                    {customer.industry && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {customer.industry}
                      </span>
                    )}
                  </div>
                  {customer.company && (
                    <p className="text-sm text-gray-600">{customer.company}</p>
                  )}
                  {customer.position && (
                    <p className="text-xs text-gray-500">{customer.position}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(customer.id)}
                    className={customer.isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"}
                  >
                    <Star className={`w-4 h-4 ${customer.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
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
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">電話：</span>
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div>
                      <span className="text-gray-500">信箱：</span>
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.company && (
                    <div>
                      <span className="text-gray-500">公司：</span>
                      <span>{customer.company}</span>
                    </div>
                  )}
                  {customer.position && (
                    <div>
                      <span className="text-gray-500">職位：</span>
                      <span>{customer.position}</span>
                    </div>
                  )}
                </div>
                
                {/* 備註區塊 */}
                <div className="border-t pt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">備註</span>
                  </div>
                  <Textarea
                    placeholder="新增備註..."
                    value={customer.notes || ''}
                    onChange={(e) => {
                      const updatedCustomer = { ...customer, notes: e.target.value };
                      setCustomers(prevCustomers =>
                        prevCustomers.map(c => (c.id === customer.id ? updatedCustomer : c))
                      );
                    }}
                    className="min-h-[60px] text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

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

      <div className="p-4 bg-gray-50 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜尋客戶姓名、公司、電話或信箱..."
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
            <span>客戶</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="選擇產業" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部產業</SelectItem>
              {industries.slice(1).map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joined">我的客戶 ({joinedCustomers.length})</TabsTrigger>
            <TabsTrigger value="invited">已邀請 ({invitedCustomers.length})</TabsTrigger>
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
                  {searchQuery || filterType !== 'all' || filterIndustry !== 'all' 
                    ? '沒有符合條件的客戶'
                    : '尚無已加入的客戶'
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
                  {searchQuery || filterType !== 'all' || filterIndustry !== 'all'
                    ? '沒有符合條件的客戶'
                    : '尚無已邀請的客戶'
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
              <Label htmlFor="industry" className="text-right">產業</Label>
              <Input
                id="industry"
                value={newCustomer.industry}
                onChange={(e) => setNewCustomer({...newCustomer, industry: e.target.value})}
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
