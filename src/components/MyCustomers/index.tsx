
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Filter, Users, Star, Plus, MessageSquare, Phone, Mail, Calendar, UserPlus, Bell, Settings, Eye, EyeOff, MoreVertical, Trash2, Edit, Archive, Heart, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { CustomerCard } from './CustomerCard';
import { ExpandedCard } from './ExpandedCard';
import { ContactCard } from './ContactCard';
import { SmartRecommendation } from './SmartRecommendation';
import { Customer, RecommendedContact, CustomerRelationshipStatus } from './types';
import { getRandomProfessionalAvatar } from './utils';

interface MyCustomersProps {
  onClose: () => void;
  customers?: any[];
  onCustomersUpdate?: (customers: any[]) => void;
}

interface CustomerFilter {
  hasCard?: boolean | null;
  tags?: string[];
  invitationStatus?: 'all' | 'invited' | 'not_invited' | 'invitation_history';
  followingMe?: boolean;
  iFollowing?: boolean;
  selectedTags?: string[];
}

const generateMockRecommendedContacts = (count: number): RecommendedContact[] => {
  const names = ['張志明', '李小美', '王大偉', '陳雅婷', '林俊傑'];
  const companies = ['科技公司', '貿易公司', '設計工作室', '顧問公司', '媒體公司'];
  const jobTitles = ['產品經理', '設計師', '工程師', '業務經理', '行銷專員'];
  const reasons = ['共同朋友', '同行業', '附近地區', '相似興趣', '專業推薦'];

  return Array.from({ length: count }, (_, i) => ({
    id: 1000 + i,
    name: names[i % names.length],
    company: companies[i % companies.length],
    jobTitle: jobTitles[i % jobTitles.length],
    photo: getRandomProfessionalAvatar(1000 + i),
    mutualFriends: ['共同朋友1', '共同朋友2'],
    reason: reasons[i % reasons.length],
    isPublicProfile: Math.random() > 0.3,
    allowDirectContact: Math.random() > 0.5
  }));
};

const generateMockCustomers = (): Customer[] => {
  const baseDate = new Date();
  
  return [
    {
      id: 1,
      name: '王小明',
      phone: '0912-345-678',
      email: 'wang.xiaoming@example.com',
      company: '台北科技公司',
      jobTitle: '軟體工程師',
      photo: getRandomProfessionalAvatar(1),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '在技術研討會認識的朋友',
      tags: ['工作', '朋友', '技術'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: true,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: true,
      isDigitalCard: true
    },
    {
      id: 2,
      name: '李大華',
      phone: '0987-654-321',
      email: 'li.dahua@example.com',
      company: '創新設計工作室',
      jobTitle: '設計總監',
      photo: getRandomProfessionalAvatar(2),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '合作過的設計師夥伴',
      tags: ['工作', '合作夥伴', '設計'],
      relationshipStatus: 'addedMe',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: true,
      isFavorite: false,
      isDigitalCard: true
    },
    {
      id: 3,
      name: '陳美玲',
      phone: '0923-456-789',
      email: 'chen.meiling@example.com',
      company: '行銷顧問公司',
      jobTitle: '行銷經理',
      photo: getRandomProfessionalAvatar(3),
      hasCard: false,
      addedDate: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '紙本名片掃描',
      tags: ['行銷', '顧問'],
      relationshipStatus: 'collected',
      isDigitalCard: false,
      invitationSent: false,
      emailInvitationSent: false
    },
    {
      id: 4,
      name: '張建國',
      phone: '0934-567-890',
      email: 'zhang.jianguo@example.com',
      company: '金融服務公司',
      jobTitle: '投資顧問',
      photo: getRandomProfessionalAvatar(4),
      hasCard: false,
      addedDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '會議中交換的紙本名片',
      tags: ['金融', '投資'],
      relationshipStatus: 'collected',
      isDigitalCard: false,
      invitationSent: true,
      emailInvitationSent: true,
      invitationDate: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      emailInvitationDate: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];
};

const mockRecommendedContacts: RecommendedContact[] = generateMockRecommendedContacts(5);

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers = [], onCustomersUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<CustomerFilter>({});
  const [activeTab, setActiveTab] = useState<'digital' | 'paper'>('digital');
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [recommendedContacts, setRecommendedContacts] = useState<RecommendedContact[]>(mockRecommendedContacts);
  const [favoriteRecommendationIds, setFavoriteRecommendationIds] = useState<number[]>([]);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem('aile-customers');
    return savedCustomers ? JSON.parse(savedCustomers) : [...customers, ...generateMockCustomers()];
  });

  const [addedRecommendationsCount, setAddedRecommendationsCount] = useState<number>(() => {
    const saved = localStorage.getItem('aile-added-recommendations-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // 所有可用標籤
  const allTags = Array.from(new Set(localCustomers.flatMap(customer => customer.tags || [])));

  useEffect(() => {
    localStorage.setItem('aile-customers', JSON.stringify(localCustomers));
    if (onCustomersUpdate) {
      onCustomersUpdate(localCustomers);
    }
  }, [localCustomers, onCustomersUpdate]);

  // 監聽來自聊天室和掃描器的通知
  useEffect(() => {
    const handleCustomerNotification = (event: CustomEvent) => {
      const { customerName, action, relationshipStatus, isDigitalCard, customer } = event.detail;
      
      console.log('收到客戶通知:', { customerName, action, isDigitalCard, customer });
      
      if (action === 'paper_scanned' && isDigitalCard === false) {
        // 紙本掃描操作 - 直接使用傳遞過來的完整客戶資料
        let newPaperContact;
        
        if (customer) {
          // 使用完整的客戶資料
          newPaperContact = {
            ...customer,
            isDigitalCard: false,  // 確保標記為紙本聯絡人
            relationshipStatus: 'collected',
            invitationSent: customer.invitationSent || false,
            emailInvitationSent: customer.emailInvitationSent || false
          };
        } else {
          // 備用方案：創建基本客戶資料
          newPaperContact = {
            id: Date.now(),
            name: customerName,
            phone: '0912-345-678',
            email: `${customerName.toLowerCase()}@example.com`,
            company: '紙本名片公司',
            jobTitle: '職位',
            photo: getRandomProfessionalAvatar(Date.now()),
            hasCard: false,
            addedDate: new Date().toISOString(),
            notes: '紙本名片掃描',
            tags: ['紙本掃描'],
            relationshipStatus: 'collected',
            isDigitalCard: false,
            invitationSent: false,
            emailInvitationSent: false
          };
        }
        
        setLocalCustomers(prev => [...prev, newPaperContact]);
        
        toast({
          title: "紙本名片已加入",
          description: `${customerName} 已加入您的聯絡人列表`
        });
        
      } else if (action === 'qr_scanned' && isDigitalCard === true) {
        // QR Code 掃描其他人的數位名片
        let newDigitalContact;
        
        if (customer) {
          newDigitalContact = {
            ...customer,
            isDigitalCard: true,  // 確保標記為數位名片
            relationshipStatus: 'collected',
            isMyFriend: true
          };
        } else {
          newDigitalContact = {
            id: Date.now(),
            name: customerName,
            phone: '0912-345-678',
            email: `${customerName.toLowerCase()}@example.com`,
            company: 'QR掃描公司',
            jobTitle: '職位',
            photo: getRandomProfessionalAvatar(Date.now()),
            hasCard: true,
            addedDate: new Date().toISOString(),
            notes: 'QR Code掃描加入',
            tags: ['QR掃描'],
            relationshipStatus: 'collected',
            isDigitalCard: true,
            isMyFriend: true
          };
        }
        
        setLocalCustomers(prev => [...prev, newDigitalContact]);
        
        toast({
          title: "數位名片已加入",
          description: `${customerName} 已加入您的名片夾`
        });
        
      } else if (action === 'qr_scanned_me' || action === 'mutual_add') {
        // 數位名片相關操作 - 別人掃描我的名片
        const newCustomer = {
          id: Date.now(),
          name: customerName,
          phone: '0912-345-678',
          email: `${customerName.toLowerCase()}@example.com`,
          company: '新加入的公司',
          jobTitle: '職位',
          photo: getRandomProfessionalAvatar(Date.now()),
          hasCard: true,
          addedDate: new Date().toISOString(),
          notes: action === 'qr_scanned_me' ? '掃描我的QR Code加入' : '互相加入',
          tags: ['新加入'],
          relationshipStatus: relationshipStatus || 'addedMe',
          isDigitalCard: true,
          isNewAddition: action === 'qr_scanned_me',
          isFollowingMe: action === 'qr_scanned_me'
        };
        
        setLocalCustomers(prev => [...prev, newCustomer]);
      }
    };

    window.addEventListener('customerAddedNotification', handleCustomerNotification as EventListener);
    
    return () => {
      window.removeEventListener('customerAddedNotification', handleCustomerNotification as EventListener);
    };
  }, []);

  const updateCustomers = (updatedCustomers: Customer[]) => {
    setLocalCustomers(updatedCustomers);
  };

  // 分離數位名片和紙本名片
  const digitalCards = localCustomers.filter(customer => customer.isDigitalCard !== false);
  const paperCards = localCustomers.filter(customer => customer.isDigitalCard === false);

  // 計算各種通知數量
  const followingMeCount = digitalCards.filter(customer => customer.isFollowingMe && customer.relationshipStatus === 'addedMe').length;
  const iFollowingCount = digitalCards.filter(customer => customer.isFavorite).length;

  const getFilteredCustomers = (customerList: Customer[]) => {
    return customerList.filter(customer => {
      const searchRegex = new RegExp(searchQuery, 'i');
      const matchesSearch = searchRegex.test(customer.name) || searchRegex.test(customer.company || '') || searchRegex.test(customer.jobTitle || '');

      const matchesFilter = Object.keys(filter).every(key => {
        if (key === 'hasCard' && filter.hasCard !== null) {
          return customer.hasCard === filter.hasCard;
        }
        if (key === 'tags' && filter.tags && filter.tags.length > 0) {
          return filter.tags.every(tag => customer.tags?.includes(tag));
        }
        if (key === 'selectedTags' && filter.selectedTags && filter.selectedTags.length > 0) {
          return filter.selectedTags.some(tag => customer.tags?.includes(tag));
        }
        if (key === 'followingMe' && filter.followingMe) {
          return customer.isFollowingMe === true;
        }
        if (key === 'iFollowing' && filter.iFollowing) {
          return customer.isFavorite === true;
        }
        if (key === 'invitationStatus' && filter.invitationStatus && filter.invitationStatus !== 'all') {
          const isInvited = customer.invitationSent || customer.emailInvitationSent;
          switch (filter.invitationStatus) {
            case 'invited':
              return isInvited;
            case 'not_invited':
              return !isInvited;
            case 'invitation_history':
              return isInvited && (customer.invitationDate || customer.emailInvitationDate);
            default:
              return true;
          }
        }
        return true;
      });

      return matchesSearch && matchesFilter;
    });
  };

  const filteredDigitalCards = getFilteredCustomers(digitalCards);
  const filteredPaperCards = getFilteredCustomers(paperCards);

  const handlePhoneClick = (phoneNumber: string) => {
    toast({
      title: "撥打電話",
      description: `撥打電話給 ${phoneNumber}`
    });
  };

  const handleLineClick = (lineId: string) => {
    toast({
      title: "開啟 LINE",
      description: `開啟 LINE ID: ${lineId}`
    });
  };

  const toggleFavoriteRecommendation = (contactId: number) => {
    setFavoriteRecommendationIds(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const addRecommendedContact = (contact: RecommendedContact) => {
    const newCustomer: Customer = {
      id: Date.now(),
      name: contact.name,
      phone: '',
      email: '',
      company: contact.company,
      jobTitle: contact.jobTitle,
      photo: contact.photo,
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: `推薦聯絡人 - ${contact.reason}`,
      tags: ['推薦聯絡人'],
      relationshipStatus: 'collected',
      isDigitalCard: true
    };
    
    const updatedCustomers = [...localCustomers, newCustomer];
    updateCustomers(updatedCustomers);
    
    const newCount = addedRecommendationsCount + 1;
    setAddedRecommendationsCount(newCount);
    localStorage.setItem('aile-added-recommendations-count', newCount.toString());
    
    toast({ 
      title: "已加入聯絡人", 
      description: `${contact.name} 已加入您的聯絡人列表` 
    });

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('customerAddedNotification', {
        detail: { customerName: contact.name, action: 'added' }
      }));
    }, 1000);
  };

  const handleAddFollower = (id: number) => {
    const updatedCustomers = localCustomers.map(customer =>
      customer.id === id ? { 
        ...customer, 
        relationshipStatus: 'collected' as CustomerRelationshipStatus,
        isMyFriend: true,
        isNewAddition: false
      } : customer
    );
    updateCustomers(updatedCustomers);
    toast({
      title: "已加回聯絡人",
      description: "聯絡人已成功加入"
    });
  };

  const handleSendInvitation = (id: number, type: 'sms' | 'email') => {
    const updatedCustomers = localCustomers.map(customer => {
      if (customer.id === id) {
        const now = new Date().toISOString();
        if (type === 'sms') {
          return { 
            ...customer, 
            invitationSent: true,
            invitationDate: now
          };
        } else {
          return { 
            ...customer, 
            emailInvitationSent: true,
            emailInvitationDate: now
          };
        }
      }
      return customer;
    });
    updateCustomers(updatedCustomers);
    
    toast({
      title: `已發送${type === 'sms' ? '簡訊' : 'Email'}邀請`,
      description: `邀請已成功發送`
    });
  };

  const removeCustomer = (id: number) => {
    const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
    updateCustomers(updatedCustomers);
    toast({
      title: "已移除聯絡人",
      description: "聯絡人已從您的列表中移除"
    });
  };

  const archiveCustomer = (id: number) => {
    const updatedCustomers = localCustomers.map(customer =>
      customer.id === id ? { ...customer, relationshipStatus: 'archived' as CustomerRelationshipStatus } : customer
    );
    updateCustomers(updatedCustomers);
    toast({
      title: "已封存聯絡人",
      description: "聯絡人已封存"
    });
  };

  const editCustomer = (id: number, updates: Partial<Customer>) => {
    const updatedCustomers = localCustomers.map(customer =>
      customer.id === id ? { ...customer, ...updates } : customer
    );
    updateCustomers(updatedCustomers);
    toast({
      title: "已編輯聯絡人",
      description: "聯絡人資訊已更新"
    });
  };

  const handleCardAction = (action: string, customer: Customer) => {
    switch (action) {
      case 'message':
        toast({ title: "傳送訊息", description: `傳送訊息給 ${customer.name}` });
        break;
      case 'phone':
        toast({ title: "撥打電話", description: `撥打電話給 ${customer.name}` });
        break;
      case 'mail':
        toast({ title: "傳送郵件", description: `傳送郵件給 ${customer.name}` });
        break;
      case 'calendar':
        toast({ title: "新增行程", description: `新增與 ${customer.name} 的行程` });
        break;
      default:
        break;
    }
  };

  const clearFilter = () => {
    setFilter({});
  };

  const toggleTagFilter = (tag: string) => {
    const currentTags = filter.selectedTags || [];
    const newTags = currentTags.includes(tag) 
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setFilter({ ...filter, selectedTags: newTags });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片人脈夾</h2>
        <div></div>
      </div>

      {/* 主要內容容器 */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'digital' | 'paper')} className="flex-1 flex flex-col min-h-0">
          {/* 搜索和篩選區域 */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="digital" className="relative">
                我的電子名片夾
                {followingMeCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center rounded-full">
                    {followingMeCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="paper">我的聯絡人</TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="mt-2">
              <Input
                type="search"
                placeholder="搜尋聯絡人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full"
              />
            </div>

            {/* Enhanced Filter Options */}
            {activeTab === 'digital' && (
              <div className="mt-3 space-y-3">
                {/* 互動關係篩選 - 兩排排列 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={filter.followingMe ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, followingMe: !filter.followingMe })}
                    className="relative flex items-center justify-center text-xs h-9"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    追蹤我
                    {followingMeCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-4 h-4 flex items-center justify-center rounded-full">
                        {followingMeCount}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant={filter.iFollowing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ ...filter, iFollowing: !filter.iFollowing })}
                    className="relative flex items-center justify-center text-xs h-9"
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    我關注的
                    {iFollowingCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 min-w-4 h-4 flex items-center justify-center rounded-full">
                        {iFollowingCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* 標籤篩選 */}
                {allTags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">標籤篩選</h4>
                    <div className="flex items-center space-x-1 flex-wrap gap-1">
                      {allTags.map(tag => (
                        <Button
                          key={tag}
                          variant={filter.selectedTags?.includes(tag) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleTagFilter(tag)}
                          className="text-xs h-7 px-2"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 清除篩選按鈕 */}
                {(filter.followingMe || filter.iFollowing || (filter.selectedTags && filter.selectedTags.length > 0)) && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilter}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      清除篩選
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'paper' && (
              <div className="mt-3 space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-2">邀請狀態</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filter.invitationStatus === 'all' || !filter.invitationStatus ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'all' })}
                      className="text-xs h-8"
                    >
                      全部
                    </Button>
                    <Button
                      variant={filter.invitationStatus === 'invited' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'invited' })}
                      className="text-xs h-8"
                    >
                      已邀請
                    </Button>
                    <Button
                      variant={filter.invitationStatus === 'not_invited' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'not_invited' })}
                      className="text-xs h-8"
                    >
                      未邀請
                    </Button>
                    <Button
                      variant={filter.invitationStatus === 'invitation_history' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter({ ...filter, invitationStatus: 'invitation_history' })}
                      className="text-xs h-8"
                    >
                      邀請紀錄
                    </Button>
                  </div>
                </div>

                {/* 標籤篩選 */}
                {allTags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">標籤篩選</h4>
                    <div className="flex items-center space-x-1 flex-wrap gap-1">
                      {allTags.map(tag => (
                        <Button
                          key={tag}
                          variant={filter.selectedTags?.includes(tag) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleTagFilter(tag)}
                          className="text-xs h-7 px-2"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 清除篩選按鈕 */}
                {(filter.invitationStatus !== 'all' && filter.invitationStatus) || (filter.selectedTags && filter.selectedTags.length > 0) && (
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilter}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      清除篩選
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 主要內容區域 - 使用原生滾動 */}
          <div className="flex-1 min-h-0 relative">
            <TabsContent value="digital" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              {/* 使用原生滾動容器 */}
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{ 
                  paddingBottom: isRecommendationCollapsed ? '80px' : '280px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="p-3 space-y-2">
                  {/* 優先顯示追蹤我的新用戶 */}
                  {filteredDigitalCards
                    .filter(customer => customer.relationshipStatus === 'addedMe')
                    .map(customer => (
                      <div key={customer.id} className="space-y-2">
                        <CustomerCard
                          customer={customer}
                          onClick={() => setExpandedCardId(expandedCardId === customer.id ? null : customer.id)}
                          onAddFollower={handleAddFollower}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onToggleFavorite={(id) => {
                            const updatedCustomers = localCustomers.map(c =>
                              c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                            );
                            updateCustomers(updatedCustomers);
                          }}
                        />
                        
                        {/* Inline Expanded Card */}
                        {expandedCardId === customer.id && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mx-1 shadow-sm">
                            <ExpandedCard
                              customer={customer}
                              activeSection="cards"
                              onToggleFavorite={(id) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onAddFollower={handleAddFollower}
                              onIgnoreFollower={() => {}}
                              onPhoneClick={handlePhoneClick}
                              onLineClick={handleLineClick}
                              onSendInvitation={handleSendInvitation}
                              onAddTag={() => {}}
                              onRemoveTag={() => {}}
                              onSaveCustomer={(customerId: number, updates: Partial<Customer>) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === customerId ? { ...c, ...updates } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onDeleteCustomer={(id) => {
                                const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
                                updateCustomers(updatedCustomers);
                              }}
                              onCollapse={() => setExpandedCardId(null)}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                  {/* 其他已收藏的名片 */}
                  {filteredDigitalCards
                    .filter(customer => customer.relationshipStatus !== 'addedMe')
                    .map(customer => (
                      <div key={customer.id} className="space-y-2">
                        <CustomerCard
                          customer={customer}
                          onClick={() => setExpandedCardId(expandedCardId === customer.id ? null : customer.id)}
                          onAddFollower={handleAddFollower}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onToggleFavorite={(id) => {
                            const updatedCustomers = localCustomers.map(c =>
                              c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                            );
                            updateCustomers(updatedCustomers);
                          }}
                        />
                        
                        {/* Inline Expanded Card */}
                        {expandedCardId === customer.id && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mx-1 shadow-sm">
                            <ExpandedCard
                              customer={customer}
                              activeSection="cards"
                              onToggleFavorite={(id) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onAddFollower={handleAddFollower}
                              onIgnoreFollower={() => {}}
                              onPhoneClick={handlePhoneClick}
                              onLineClick={handleLineClick}
                              onSendInvitation={handleSendInvitation}
                              onAddTag={() => {}}
                              onRemoveTag={() => {}}
                              onSaveCustomer={(customerId: number, updates: Partial<Customer>) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === customerId ? { ...c, ...updates } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onDeleteCustomer={(id) => {
                                const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
                                updateCustomers(updatedCustomers);
                              }}
                              onCollapse={() => setExpandedCardId(null)}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                  {filteredDigitalCards.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">沒有符合條件的名片</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paper" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              {/* 使用原生滾動容器 */}
              <div 
                className="flex-1 overflow-y-auto overflow-x-hidden"
                style={{ 
                  paddingBottom: '20px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="p-3 space-y-2">
                  {filteredPaperCards.length > 0 ? (
                    filteredPaperCards.map(customer => (
                      <div key={customer.id} className="space-y-2">
                        <ContactCard
                          customer={customer}
                          onClick={() => setExpandedCardId(expandedCardId === customer.id ? null : customer.id)}
                          onSendInvitation={handleSendInvitation}
                        />
                        
                        {/* Inline Expanded Card */}
                        {expandedCardId === customer.id && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mx-1 shadow-sm">
                            <ExpandedCard
                              customer={customer}
                              activeSection="contacts"
                              onToggleFavorite={(id) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onAddFollower={handleAddFollower}
                              onIgnoreFollower={() => {}}
                              onPhoneClick={handlePhoneClick}
                              onLineClick={handleLineClick}
                              onSendInvitation={handleSendInvitation}
                              onAddTag={() => {}}
                              onRemoveTag={() => {}}
                              onSaveCustomer={(customerId: number, updates: Partial<Customer>) => {
                                const updatedCustomers = localCustomers.map(c =>
                                  c.id === customerId ? { ...c, ...updates } : c
                                );
                                updateCustomers(updatedCustomers);
                              }}
                              onDeleteCustomer={(id) => {
                                const updatedCustomers = localCustomers.filter(customer => customer.id !== id);
                                updateCustomers(updatedCustomers);
                              }}
                              onCollapse={() => setExpandedCardId(null)}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">沒有符合條件的聯絡人</p>
                      <p className="text-gray-400 text-xs mt-1">使用掃描功能來新增紙本名片</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* 固定在底部的智能推薦區域 - 僅在數位名片夾頁面顯示 */}
            {activeTab === 'digital' && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
                <SmartRecommendation
                  isCollapsed={isRecommendationCollapsed}
                  onToggleCollapse={() => setIsRecommendationCollapsed(!isRecommendationCollapsed)}
                  onAddRecommendation={addRecommendedContact}
                  recommendations={recommendedContacts}
                  onToggleFavorite={toggleFavoriteRecommendation}
                  onPhoneClick={handlePhoneClick}
                  onLineClick={handleLineClick}
                  favoriteIds={favoriteRecommendationIds}
                  addedCount={addedRecommendationsCount}
                />
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MyCustomers;
