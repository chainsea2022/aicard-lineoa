import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, Users, UserPlus, MessageSquare, Mail, Tag, Edit, Save, X, Plus, ChevronDown, ChevronRight, Phone, TrendingUp, Crown, Heart, Bell, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MyCustomersProps {
  onClose: () => void;
  customers: any[];
  onCustomersUpdate: (customers: any[]) => void;
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
  notes: string;
  isInvited?: boolean;
  invitationSent?: boolean;
  emailInvitationSent?: boolean;
  tags?: string[];
  isFavorite?: boolean;
  isMyFriend?: boolean;
  isFollowingMe?: boolean;
  hasPendingInvitation?: boolean;
  relationshipStatus?: 'collected' | 'addedMe';
  isNewAddition?: boolean;
}

interface RecommendedContact {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  photo: string;
  mutualFriends: string[];
  reason: string;
}

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers, onCustomersUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSection, setActiveSection] = useState<'cards' | 'contacts'>('cards');
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['工作', '朋友', '客戶', '合作夥伴', '潛在客戶']);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newTag, setNewTag] = useState('');
  const [recommendationCount, setRecommendationCount] = useState(0);
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(false);
  const [showTagFilters, setShowTagFilters] = useState(true);

  const recommendedContacts = [
    {
      id: 1,
      name: '陳雅婷',
      jobTitle: '產品經理',
      company: '創新軟體公司',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      mutualFriends: ['王小明'],
      reason: '您和陳雅婷有1位共同好友'
    },
    {
      id: 2,
      name: '林俊傑',
      jobTitle: '業務總監',
      company: '國際貿易公司',
      photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
      mutualFriends: ['李大華'],
      reason: '您和林俊傑有1位共同好友'
    },
    {
      id: 3,
      name: '張美琪',
      jobTitle: '行銷總監',
      company: '廣告創意公司',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
      mutualFriends: ['王小明', '李大華'],
      reason: '您和張美琪有2位共同好友'
    },
    {
      id: 4,
      name: '劉志明',
      jobTitle: '技術長',
      company: '科技新創公司',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      mutualFriends: ['陳雅婷'],
      reason: '您和劉志明有1位共同好友'
    }
  ];

  const professionalAvatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face'
  ];

  const getRandomProfessionalAvatar = (customerId: number) => {
    return professionalAvatars[customerId % professionalAvatars.length];
  };

  const getDefaultCustomers = (): Customer[] => [
    {
      id: 1001,
      name: '王小明',
      phone: '0912-345-678',
      email: 'wang@example.com',
      company: '科技創新公司',
      jobTitle: '產品經理',
      line: 'wang_xiaoming',
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '已掃描加入的電子名片',
      relationshipStatus: 'collected' as const,
      isMyFriend: true,
      isFollowingMe: false,
      tags: ['工作', '朋友']
    },
    {
      id: 1002,
      name: '李雅婷',
      phone: '0923-456-789',
      email: 'li@example.com',
      company: '設計工作室',
      jobTitle: '創意總監',
      line: 'li_yating',
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '設計合作夥伴',
      relationshipStatus: 'collected' as const,
      isMyFriend: true,
      isFollowingMe: false,
      tags: ['工作']
    },
    {
      id: 1003,
      name: '張志豪',
      phone: '0934-567-890',
      email: 'zhang@example.com',
      company: '行銷顧問公司',
      jobTitle: '行銷總監',
      line: 'zhang_zhihao',
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '行銷合作夥伴',
      relationshipStatus: 'collected' as const,
      isMyFriend: true,
      isFollowingMe: false,
      isFavorite: true,
      tags: ['合作夥伴']
    },
    {
      id: 1004,
      name: '陳建志',
      phone: '0945-678-901',
      email: 'chen@example.com',
      company: '軟體開發公司',
      jobTitle: '技術總監',
      line: 'chen_jianzhi',
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '已掃描加入的技術顧問',
      relationshipStatus: 'collected' as const,
      isMyFriend: true,
      isFollowingMe: false,
      tags: ['客戶']
    },
    {
      id: 1005,
      name: '林美慧',
      phone: '0956-789-012',
      email: 'lin@example.com',
      company: '財務顧問公司',
      jobTitle: '財務顧問',
      line: 'lin_meihui',
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '已收藏的聯絡人',
      relationshipStatus: 'collected' as const,
      isMyFriend: true,
      isFollowingMe: false,
      tags: ['潛在客戶']
    },
    {
      id: 2001,
      name: '吳雅芳',
      phone: '0978-901-234',
      email: 'wu@example.com',
      company: '廣告公司',
      jobTitle: '創意總監',
      line: 'wu_yafang',
      hasCard: true,
      addedDate: new Date(Date.now() - 3600000).toISOString(),
      notes: '對方已加我，等待我回應',
      relationshipStatus: 'addedMe' as const,
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: true,
      tags: ['合作夥伴']
    },
    {
      id: 2002,
      name: '劉志明',
      phone: '0989-012-345',
      email: 'liu@example.com',
      company: '科技新創',
      jobTitle: '執行長',
      line: 'liu_zhiming',
      hasCard: true,
      addedDate: new Date(Date.now() - 7200000).toISOString(),
      notes: '新創公司執行長',
      relationshipStatus: 'addedMe' as const,
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: true,
      tags: ['潛在客戶']
    },
    {
      id: 2003,
      name: '許文華',
      phone: '0990-123-456',
      email: 'xu@example.com',
      company: '媒體公司',
      jobTitle: '記者',
      line: 'xu_wenhua',
      hasCard: true,
      addedDate: new Date(Date.now() - 10800000).toISOString(),
      notes: '媒體記者聯絡人',
      relationshipStatus: 'addedMe' as const,
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: true,
      isFavorite: true,
      tags: ['媒體']
    },
    {
      id: 2004,
      name: '黃志成',
      phone: '0901-234-567',
      email: 'huang@example.com',
      company: '建築事務所',
      jobTitle: '建築師',
      line: 'huang_zhicheng',
      hasCard: true,
      addedDate: new Date(Date.now() - 14400000).toISOString(),
      notes: '建築專案合作',
      relationshipStatus: 'addedMe' as const,
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      tags: ['工作']
    },
    {
      id: 2005,
      name: '蔡雅玲',
      phone: '0912-345-678',
      email: 'cai@example.com',
      company: '行銷公司',
      jobTitle: '行銷經理',
      line: 'cai_yaling',
      hasCard: true,
      addedDate: new Date(Date.now() - 18000000).toISOString(),
      notes: '行銷活動合作',
      relationshipStatus: 'addedMe' as const,
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      tags: ['行銷']
    }
  ].map(customer => ({
    ...customer,
    tags: customer.tags || []
  }));

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    
    if (savedCustomers.length === 0) {
      const defaultCustomers = getDefaultCustomers();
      setLocalCustomers(defaultCustomers);
      localStorage.setItem('aile-customers', JSON.stringify(defaultCustomers));
      onCustomersUpdate(defaultCustomers);
      return;
    }

    const updatedCustomers = savedCustomers.map((customer: any) => {
      let relationshipStatus: 'collected' | 'addedMe' = 'collected';
      
      if (!customer.isMyFriend && customer.isFollowingMe) {
        relationshipStatus = 'addedMe';
      } else {
        relationshipStatus = 'collected';
      }

      return {
        ...customer,
        isMyFriend: customer.isMyFriend || customer.hasCard,
        isFollowingMe: customer.isFollowingMe || false,
        hasPendingInvitation: customer.hasPendingInvitation || false,
        relationshipStatus,
        isNewAddition: customer.isNewAddition || false
      } as Customer;
    });
    setLocalCustomers(updatedCustomers);
    onCustomersUpdate(updatedCustomers);
  }, [onCustomersUpdate]);

  const myBusinessCards = localCustomers.filter(c => c.hasCard);
  const myContacts = localCustomers.filter(c => !c.hasCard);

  const getPendingNotificationCount = () => {
    return myBusinessCards.filter(c => 
      c.relationshipStatus === 'addedMe' && c.hasPendingInvitation
    ).length;
  };

  const getFilteredCards = () => {
    let filteredCards = myBusinessCards.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (activeFilter) {
        case 'favorites':
          return matchesSearch && customer.isFavorite;
        case 'collected':
          return matchesSearch && customer.relationshipStatus === 'collected';
        case 'addedMe':
          return matchesSearch && customer.relationshipStatus === 'addedMe';
        default:
          if (availableTags.includes(activeFilter)) {
            return matchesSearch && customer.tags?.includes(activeFilter);
          }
          return matchesSearch;
      }
    });

    if (activeFilter === 'addedMe') {
      filteredCards.sort((a, b) => {
        if (a.isNewAddition && !b.isNewAddition) return -1;
        if (!a.isNewAddition && b.isNewAddition) return 1;
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      });
    }

    return filteredCards;
  };

  const getFilteredContacts = () => {
    return myContacts.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (activeFilter) {
        case 'favorites':
          return matchesSearch && customer.isFavorite;
        default:
          if (availableTags.includes(activeFilter)) {
            return matchesSearch && customer.tags?.includes(activeFilter);
          }
          return matchesSearch;
      }
    });
  };

  const toggleFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
  };

  const toggleFavorite = (customerId: number) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, isFavorite: !customer.isFavorite }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
  };

  const addFollowerToCollected = (customerId: number) => {
    const updatedCustomers = localCustomers.map(c => {
      if (c.id === customerId) {
        return { 
          ...c, 
          isMyFriend: true,
          relationshipStatus: 'collected' as const,
          hasPendingInvitation: false,
          isNewAddition: false
        };
      }
      return c;
    });
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    toast({ title: "已加入已收藏名片夾" });
  };

  const ignoreFollower = (customerId: number) => {
    const updatedCustomers = localCustomers.map(c => 
      c.id === customerId ? { ...c, isFollowingMe: false, hasPendingInvitation: false, isNewAddition: false } : c
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    toast({ title: "已忽略此追蹤者" });
  };

  const addRecommendedContact = (contactId: number) => {
    const contact = recommendedContacts.find(c => c.id === contactId);
    if (contact) {
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
        relationshipStatus: 'collected'
      };
      
      const updatedCustomers = [...localCustomers, newCustomer];
      setLocalCustomers(updatedCustomers);
      localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
      onCustomersUpdate(updatedCustomers);
      
      toast({ 
        title: "已加入聯絡人", 
        description: `${contact.name} 已加入您的聯絡人列表` 
      });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('customerAddedNotification', {
          detail: { customerName: contact.name, action: 'added' }
        }));
      }, 1000);
    }
  };

  const startEditing = (customer: Customer) => {
    setEditingCard(customer.id);
    setEditingCustomer({ ...customer });
  };

  const cancelEditing = () => {
    setEditingCard(null);
    setEditingCustomer(null);
  };

  const saveEditing = () => {
    if (!editingCustomer) return;
    
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    setEditingCard(null);
    setEditingCustomer(null);
    toast({ title: "客戶資料已更新" });
  };

  const addTag = (customerId: number, tag: string) => {
    if (!tag.trim()) return;
    
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, tags: [...(customer.tags || []), tag.trim()] }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    
    if (!availableTags.includes(tag.trim())) {
      setAvailableTags([...availableTags, tag.trim()]);
    }
  };

  const removeTag = (customerId: number, tag: string) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, tags: customer.tags?.filter(t => t !== tag) || [] }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
  };

  const handlePhoneClick = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
      toast({ title: "正在撥打電話..." });
    }
  };

  const handleLineClick = (lineId: string) => {
    if (lineId) {
      const lineUrl = `https://line.me/ti/p/~${lineId}`;
      window.open(lineUrl, '_blank');
      toast({ title: "正在開啟 LINE 聊天室..." });
    }
  };

  const sendInvitation = (customerId: number, type: 'sms' | 'email') => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { 
            ...customer, 
            invitationSent: type === 'sms' ? true : customer.invitationSent,
            emailInvitationSent: type === 'email' ? true : customer.emailInvitationSent
          }
        : customer
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    
    const inviteType = type === 'sms' ? '簡訊' : 'Email';
    toast({ 
      title: `${inviteType}邀請已發送`, 
      description: `已向客戶發送${inviteType}邀請` 
    });
  };

  const showUpgradePrompt = () => {
    toast({
      title: "升級至 Aile 商務版",
      description: "解鎖專業商務管理功能，享受更多進階服務",
      duration: 3000,
    });
  };

  const handleSMSClick = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `sms:${phoneNumber}`;
      toast({ title: "正在開啟簡訊..." });
    }
  };

  const handleEmailClick = (email: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
      toast({ title: "正在開啟郵件..." });
    }
  };

  const getRelationshipStatusDisplay = (status?: 'collected' | 'addedMe') => {
    switch (status) {
      case 'collected':
        return { text: '+ 已收藏', className: 'text-blue-600 bg-blue-50' };
      case 'addedMe':
        return { text: '⚠️ 被加入', className: 'text-orange-600 bg-orange-50' };
      default:
        return { text: '+ 已收藏', className: 'text-blue-600 bg-blue-50' };
    }
  };

  const renderCondensedCard = (customer: Customer) => {
    const statusDisplay = getRelationshipStatusDisplay(customer.relationshipStatus);
    
    return (
      <Card 
        key={customer.id} 
        className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md bg-white border border-gray-200"
        onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
      >
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-10 h-10 flex-shrink-0 border border-blue-300">
                <AvatarImage 
                  src={customer.photo || getRandomProfessionalAvatar(customer.id)} 
                  alt={customer.name} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {customer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {customer.isNewAddition && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {customer.isFavorite && (
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="text-xs text-gray-600 truncate mb-1">
                {customer.company && customer.jobTitle 
                  ? `${customer.company} · ${customer.jobTitle}`
                  : customer.company || customer.jobTitle || '無公司資訊'
                }
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusDisplay.className}`}>
                    {statusDisplay.text}
                  </span>
                  
                  {/* LINE and Phone icons */}
                  <div className="flex items-center space-x-1">
                    {customer.line && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLineClick(customer.line!);
                        }}
                        className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                        title="開啟 LINE"
                      >
                        <MessageSquare className="w-3 h-3 text-green-600" />
                      </button>
                    )}
                    {customer.phone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhoneClick(customer.phone);
                        }}
                        className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="撥打電話"
                      >
                        <Phone className="w-3 h-3 text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
                
                {customer.relationshipStatus === 'addedMe' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addFollowerToCollected(customer.id);
                    }}
                    size="sm"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-xs h-6 px-2"
                  >
                    加入
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContactCard = (customer: Customer) => (
    <Card 
      key={customer.id} 
      className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
              {customer.isFavorite && (
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              )}
            </div>
            
            <div className="text-xs text-gray-600 truncate">
              {customer.company && customer.jobTitle 
                ? `${customer.company} · ${customer.jobTitle}`
                : customer.company || customer.jobTitle || (customer.phone || customer.email || '無聯絡資訊')
              }
            </div>
            
            {customer.tags && customer.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {customer.tags.slice(0, 2).map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {customer.tags.length > 2 && (
                  <span className="text-xs text-gray-400">+{customer.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {(customer.invitationSent || customer.emailInvitationSent) && (
              <span className="text-xs text-green-600 font-medium">已邀請</span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderExpandedCard = (customer: Customer) => {
    const isEditing = editingCard === customer.id;
    const displayCustomer = isEditing ? editingCustomer! : customer;
    const isFollowingMe = customer.isFollowingMe && !customer.isMyFriend;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarImage 
                  src={displayCustomer.photo || getRandomProfessionalAvatar(displayCustomer.id)} 
                  alt={displayCustomer.name} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                  {displayCustomer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {customer.isNewAddition && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-gray-800">
                {isEditing ? (
                  <Input
                    value={displayCustomer.name}
                    onChange={(e) => setEditingCustomer({...editingCustomer!, name: e.target.value})}
                    className="text-lg font-bold"
                  />
                ) : (
                  displayCustomer.name
                )}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  onClick={() => toggleFavorite(customer.id)}
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                >
                  <Star 
                    className={`w-4 h-4 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                  />
                </Button>
                {customer.hasPendingInvitation && (
                  <div className="flex items-center space-x-1">
                    <Bell className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600">待處理邀請</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isEditing ? (
              <>
                <Button onClick={saveEditing} size="sm" variant="default">
                  <Save className="w-4 h-4" />
                </Button>
                <Button onClick={cancelEditing} size="sm" variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button onClick={() => startEditing(customer)} size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setExpandedCard(null)}
              variant="ghost"
              size="sm"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {customer.relationshipStatus === 'addedMe' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-orange-800">
                <span className="font-medium">⚠️ 對方已加您</span>
                <p className="text-xs text-orange-600 mt-1">您可以加入已收藏或忽略此人</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => addFollowerToCollected(customer.id)}
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-xs"
                >
                  加入
                </Button>
                <Button
                  onClick={() => ignoreFollower(customer.id)}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  忽略
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500">公司</label>
              {isEditing ? (
                <Input
                  value={displayCustomer.company || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, company: e.target.value})}
                  placeholder="公司名稱"
                />
              ) : (
                <div className="text-sm">{displayCustomer.company || '-'}</div>
              )}
            </div>
            
            <div>
              <label className="text-xs text-gray-500">職稱</label>
              {isEditing ? (
                <Input
                  value={displayCustomer.jobTitle || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, jobTitle: e.target.value})}
                  placeholder="職稱"
                />
              ) : (
                <div className="text-sm">{displayCustomer.jobTitle || '-'}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">電話</label>
              {isEditing ? (
                <Input
                  value={displayCustomer.phone || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, phone: e.target.value})}
                  placeholder="電話號碼"
                />
              ) : (
                <div className="text-sm">
                  {displayCustomer.phone ? (
                    <button
                      onClick={() => handlePhoneClick(displayCustomer.phone)}
                      className="text-blue-600 hover:text-blue-700 transition-colors underline flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{displayCustomer.phone}</span>
                    </button>
                  ) : (
                    '-'
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">Email</label>
              {isEditing ? (
                <Input
                  value={displayCustomer.email || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, email: e.target.value})}
                  placeholder="電子信箱"
                />
              ) : (
                <div className="text-sm">{displayCustomer.email || '-'}</div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">LINE</label>
              {isEditing ? (
                <Input
                  value={displayCustomer.line || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, line: e.target.value})}
                  placeholder="LINE ID"
                />
              ) : (
                <div className="text-sm">
                  {displayCustomer.line ? (
                    <button
                      onClick={() => handleLineClick(displayCustomer.line!)}
                      className="text-green-600 hover:text-green-700 transition-colors underline"
                    >
                      {displayCustomer.line}
                    </button>
                  ) : (
                    '-'
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">網站</label>
              {isEditing ? (
                <Input
                  value={displayCustomer.website || ''}
                  onChange={(e) => setEditingCustomer({...editingCustomer!, website: e.target.value})}
                  placeholder="網站網址"
                />
              ) : (
                <div className="text-sm">{displayCustomer.website || '-'}</div>
              )}
            </div>
          </div>

          {activeSection === 'contacts' && (
            <div className="border-t pt-3 mt-3">
              <label className="text-xs text-gray-500 mb-2 block">邀請功能</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => sendInvitation(customer.id, 'sms')}
                  size="sm"
                  variant="outline"
                  disabled={customer.invitationSent}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>{customer.invitationSent ? '簡訊已發送' : '發送簡訊'}</span>
                </Button>
                <Button
                  onClick={() => sendInvitation(customer.id, 'email')}
                  size="sm"
                  variant="outline"
                  disabled={customer.emailInvitationSent}
                  className="flex items-center space-x-2"
                >
                  <Mail className="w-3 h-3" />
                  <span>{customer.emailInvitationSent ? 'Email已發送' : '發送Email'}</span>
                </Button>
              </div>
            </div>
          )}

          <div className="border-t pt-3">
            <label className="text-xs text-gray-500 mb-2 block">標籤</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {displayCustomer.tags?.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                  {!isEditing && (
                    <button
                      onClick={() => removeTag(customer.id, tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            
            {!isEditing && (
              <div className="flex space-x-2">
                <Input
                  placeholder="新增標籤"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(customer.id, newTag);
                      setNewTag('');
                    }
                  }}
                  className="text-xs"
                />
                <Button
                  onClick={() => {
                    addTag(customer.id, newTag);
                    setNewTag('');
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="border-t pt-3">
            <label className="text-xs text-gray-500 mb-2 block">備註</label>
            {isEditing ? (
              <Textarea
                value={displayCustomer.notes || ''}
                onChange={(e) => setEditingCustomer({...editingCustomer!, notes: e.target.value})}
                placeholder="備註內容"
                rows={3}
              />
            ) : (
              <div className="text-sm text-gray-600 min-h-[60px] p-2 border rounded">
                {displayCustomer.notes || '無備註'}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400 border-t pt-2">
            加入時間: {new Date(customer.addedDate).toLocaleDateString('zh-TW')}
          </div>
        </div>
      </div>
    );
  };

  const renderSmartRecommendationCard = (contact: RecommendedContact, index: number) => {
    if (index >= 10) {
      return (
        <Card key="upgrade" className="w-24 h-16 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-dashed border-purple-300 flex-shrink-0">
          <CardContent className="p-1 h-full">
            <button 
              onClick={showUpgradePrompt}
              className="w-full h-full flex flex-col items-center justify-center space-y-0.5 text-purple-600 hover:text-purple-700"
            >
              <Crown className="w-3 h-3" />
              <span className="text-xs font-medium text-center leading-tight">升級<br />解鎖</span>
            </button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={contact.id} className="w-24 h-16 bg-white border border-orange-200 flex-shrink-0">
        <CardContent className="p-1">
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-1 mb-0.5">
              <Avatar className="w-4 h-4 border border-orange-300 flex-shrink-0">
                <AvatarImage src={contact.photo} alt={contact.name} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold text-xs">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs text-gray-800 truncate">{contact.name}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 truncate mb-1">{contact.jobTitle}</p>
            <Button
              onClick={() => addRecommendedContact(contact.id)}
              size="sm"
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-100 text-xs h-4 px-1 mt-auto"
            >
              加入
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-sm mx-auto">
      <div className="flex-shrink-0">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-1.5 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-bold text-base">名片人脈夾</h1>
          </div>
        </div>

        <div className="p-3 bg-white border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜尋名片或聯絡人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm h-9"
            />
          </div>
        </div>

        <div className="flex bg-white border-b border-gray-200">
          <Button
            onClick={() => {
              setActiveSection('cards');
              setActiveFilter('all');
            }}
            variant={activeSection === 'cards' ? 'default' : 'ghost'}
            className="flex-1 rounded-none border-r text-xs relative"
          >
            <Heart className="w-4 h-4 mr-1" />
            我的電子名片夾
            <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
              {myBusinessCards.length}
            </span>
            {/* Notification badge for pending invitations */}
            {getPendingNotificationCount() > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {getPendingNotificationCount()}
              </div>
            )}
          </Button>
          <Button
            onClick={() => setActiveSection('contacts')}
            variant={activeSection === 'contacts' ? 'default' : 'ghost'}
            className="flex-1 rounded-none text-xs"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            我的聯絡人
            <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
              {myContacts.length}
            </span>
          </Button>
        </div>

        <div className="p-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">篩選條件</span>
            <Button
              onClick={() => setShowTagFilters(!showTagFilters)}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
            >
              {showTagFilters ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          </div>
          
          {showTagFilters && (
            <>
              {/* Notification bar for pending additions */}
              {activeSection === 'cards' && getPendingNotificationCount() > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 font-medium">
                      有 {getPendingNotificationCount()} 位新朋友加您
                    </span>
                  </div>
                  <Button
                    onClick={() => setActiveFilter('addedMe')}
                    size="sm"
                    variant="outline"
                    className="text-xs h-6 border-red-300 text-red-600 hover:bg-red-100"
                  >
                    查看
                  </Button>
                </div>
              )}
              
              <ScrollArea>
                <div className="flex space-x-1 pb-1 min-w-max">
                  <Button
                    onClick={() => toggleFilter('favorites')}
                    variant={activeFilter === 'favorites' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-shrink-0 text-xs h-6"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    關注中
                  </Button>

                  {activeSection === 'cards' && (
                    <>
                      <Button
                        onClick={() => toggleFilter('collected')}
                        variant={activeFilter === 'collected' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-6"
                      >
                        + 已收藏
                      </Button>
                      <Button
                        onClick={() => toggleFilter('addedMe')}
                        variant={activeFilter === 'addedMe' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-6 relative"
                      >
                        ⚠️ 被加入
                        {getPendingNotificationCount() > 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {getPendingNotificationCount()}
                          </div>
                        )}
                      </Button>
                    </>
                  )}
                  
                  {availableTags.map(tag => (
                    <Button
                      key={tag}
                      onClick={() => toggleFilter(tag)}
                      variant={activeFilter === tag ? 'default' : 'outline'}
                      size="sm"
                      className="flex-shrink-0 text-xs h-6"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-3">
            {activeSection === 'cards' ? (
              <div className="space-y-0">
                {getFilteredCards().length > 0 ? (
                  getFilteredCards().map(customer => 
                    expandedCard === customer.id 
                      ? renderExpandedCard(customer)
                      : renderCondensedCard(customer)
                  )
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      {searchTerm || activeFilter !== 'all' ? '找不到符合條件的電子名片' : '還沒有任何電子名片'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      掃描對方的電子名片來建立人脈關係
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-0">
                {getFilteredContacts().length > 0 ? (
                  getFilteredContacts().map(customer => 
                    expandedCard === customer.id 
                      ? renderExpandedCard(customer)
                      : renderContactCard(customer)
                  )
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      {searchTerm ? '找不到符合條件的聯絡人' : '還沒有任何聯絡人'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      掃描紙本名片來新增聯絡人
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-t border-orange-200 flex-shrink-0">
          <div className={`transition-all duration-300 ${isRecommendationCollapsed ? 'p-2' : 'p-2'}`}>
            {!isRecommendationCollapsed ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-700">智能推薦</span>
                  </div>
                  <Button
                    onClick={() => setIsRecommendationCollapsed(true)}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 text-orange-600 hover:bg-orange-100"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {recommendedContacts.concat(Array(10).fill(null)).map((contact, index) => 
                      contact ? renderSmartRecommendationCard(contact, index) : renderSmartRecommendationCard({
                        id: 100 + index,
                        name: `推薦聯絡人 ${index + 5}`,
                        jobTitle: '專業人士',
                        company: '知名企業',
                        photo: professionalAvatars[index % professionalAvatars.length],
                        mutualFriends: [],
                        reason: '系統推薦'
                      }, index + 4)
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">智能推薦</span>
                  <div className="flex space-x-1">
                    {recommendedContacts.slice(0, 3).map((contact, index) => (
                      <Avatar key={contact.id} className="w-6 h-6 border border-orange-300">
                        <AvatarImage src={contact.photo} alt={contact.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold text-xs">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="w-6 h-6 border border-orange-300 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-xs text-orange-600 font-medium">+</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsRecommendationCollapsed(false)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 text-orange-600 hover:bg-orange-100"
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCustomers;
