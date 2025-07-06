import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Users, UserPlus, Heart, Bell, ChevronDown, ChevronRight, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MyCustomersProps, Customer, RecommendedContact } from './types';
import { getDefaultCustomers } from './utils';
import { CustomerCard } from './CustomerCard';
import { ContactCard } from './ContactCard';
import { ExpandedCard } from './ExpandedCard';
import { SmartRecommendation } from './SmartRecommendation';

const MyCustomers: React.FC<MyCustomersProps> = ({ onClose, customers, onCustomersUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSection, setActiveSection] = useState<'cards' | 'contacts'>('cards');
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['工作', '朋友', '客戶', '合作夥伴', '潛在客戶']);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isRecommendationCollapsed, setIsRecommendationCollapsed] = useState(false);
  const [showTagFilters, setShowTagFilters] = useState(true);

  const recommendedContacts: RecommendedContact[] = [
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

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    
    if (savedCustomers.length === 0) {
      const defaultCustomers = getDefaultCustomers();
      // 確保有8個追蹤我的聯絡人 (6個已加入 + 2個新加入)
      const followingMeContacts = [
        // 2個新加入的聯絡人
        {
          id: 1001,
          name: '吳雅芳',
          phone: '0912-345-678',
          email: 'wu.yafang@email.com',
          company: '科技公司',
          jobTitle: '產品經理',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date().toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: true
        },
        {
          id: 1002,
          name: '劉志明',
          phone: '0923-456-789',
          email: 'liu.zhiming@email.com',
          company: '設計工作室',
          jobTitle: '創意總監',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date().toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: true
        },
        // 6個已追蹤我的聯絡人
        {
          id: 1003,
          name: '許文華',
          phone: '0934-567-890',
          email: 'xu.wenhua@email.com',
          company: '行銷公司',
          jobTitle: '業務經理',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date(Date.now() - 86400000).toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: false
        },
        {
          id: 1004,
          name: '黃志成',
          phone: '0945-678-901',
          email: 'huang.zhicheng@email.com',
          company: '建築事務所',
          jobTitle: '建築師',
          photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date(Date.now() - 172800000).toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: false
        },
        {
          id: 1005,
          name: '蔡雅玲',
          phone: '0956-789-012',
          email: 'cai.yaling@email.com',
          company: '金融服務',
          jobTitle: '理財顧問',
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date(Date.now() - 259200000).toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: false
        },
        {
          id: 1006,
          name: '陳建華',
          phone: '0967-890-123',
          email: 'chen.jianhua@email.com',
          company: '媒體公司',
          jobTitle: '編輯',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date(Date.now() - 345600000).toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: false
        },
        {
          id: 1007,
          name: '張婷婷',
          phone: '0978-901-234',
          email: 'zhang.tingting@email.com',
          company: '教育機構',
          jobTitle: '講師',
          photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date(Date.now() - 432000000).toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: false
        },
        {
          id: 1008,
          name: '李明達',
          phone: '0989-012-345',
          email: 'li.mingda@email.com',
          company: '零售業',
          jobTitle: '店長',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          hasCard: true,
          addedDate: new Date(Date.now() - 518400000).toISOString(),
          notes: '',
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: false
        }
      ];
      
      const allCustomers = [...defaultCustomers, ...followingMeContacts];
      setLocalCustomers(allCustomers);
      localStorage.setItem('aile-customers', JSON.stringify(allCustomers));
      onCustomersUpdate(allCustomers);
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

  // 監聽來自 MyCard 組件的事件
  useEffect(() => {
    const handleCustomerAddedNotification = (event: CustomEvent) => {
      const { customerName, action, message } = event.detail;
      
      if (action === 'qrcode_scanned' || action === 'contact_added') {
        // 創建新的追蹤者
        const newFollower: Customer = {
          id: Date.now(),
          name: customerName,
          phone: '0912-000-000',
          email: `${customerName.toLowerCase()}@example.com`,
          company: '未知公司',
          jobTitle: '未知職位',
          hasCard: true,
          addedDate: new Date().toISOString(),
          notes: message || `透過 ${action === 'qrcode_scanned' ? 'QR Code' : '加入聯絡人'} 加入`,
          relationshipStatus: 'addedMe' as const,
          isMyFriend: false,
          isFollowingMe: true,
          hasPendingInvitation: true,
          isNewAddition: true
        };

        const updatedCustomers = [...localCustomers, newFollower];
        updateCustomers(updatedCustomers);
        
        toast({
          title: "新的追蹤者！",
          description: `${customerName} 已加入您的名片，請查看追蹤我列表`
        });
      }
    };

    window.addEventListener('customerAddedNotification', handleCustomerAddedNotification as EventListener);
    
    return () => {
      window.removeEventListener('customerAddedNotification', handleCustomerAddedNotification as EventListener);
    };
  }, [localCustomers, onCustomersUpdate]);

  const myBusinessCards = localCustomers.filter(c => c.hasCard);
  const myContacts = localCustomers.filter(c => !c.hasCard);

  const getPendingNotificationCount = () => {
    return myBusinessCards.filter(c => 
      c.relationshipStatus === 'addedMe' && c.hasPendingInvitation
    ).length;
  };

  const getNewAdditionsCount = () => {
    return myBusinessCards.filter(c => 
      c.relationshipStatus === 'addedMe' && c.isNewAddition
    ).length;
  };

  const getFilteredCards = () => {
    let filteredCards = myBusinessCards.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (activeFilter) {
        case 'followingMe':
          return matchesSearch && customer.relationshipStatus === 'addedMe';
        case 'favorites':
          return matchesSearch && customer.isFavorite;
        default:
          if (availableTags.includes(activeFilter)) {
            return matchesSearch && customer.tags?.includes(activeFilter);
          }
          return matchesSearch;
      }
    });

    // Sort followingMe cards with new additions first
    if (activeFilter === 'followingMe') {
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

  const updateCustomers = (updatedCustomers: Customer[]) => {
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
  };

  const toggleFavorite = (customerId: number) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, isFavorite: !customer.isFavorite }
        : customer
    );
    updateCustomers(updatedCustomers);
  };

  const addFollowerToCollected = (customerId: number) => {
    const customer = localCustomers.find(c => c.id === customerId);
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
    updateCustomers(updatedCustomers);
    
    // 發送聊天室通知
    if (customer) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('customerAddedNotification', {
          detail: { 
            customerName: customer.name, 
            action: 'mutual_added',
            message: `您已加入 ${customer.name} 的名片，對方將收到通知。`
          }
        }));
      }, 500);
    }
    
    toast({ title: "已加入我的電子名片夾" });
  };

  const ignoreFollower = (customerId: number) => {
    const updatedCustomers = localCustomers.map(c => 
      c.id === customerId ? { ...c, isFollowingMe: false, hasPendingInvitation: false, isNewAddition: false } : c
    );
    updateCustomers(updatedCustomers);
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
      updateCustomers(updatedCustomers);
      
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

  const addTag = (customerId: number, tag: string) => {
    if (!tag.trim()) return;
    
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { ...customer, tags: [...(customer.tags || []), tag.trim()] }
        : customer
    );
    updateCustomers(updatedCustomers);
    
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
    updateCustomers(updatedCustomers);
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
    updateCustomers(updatedCustomers);
    
    const inviteType = type === 'sms' ? '簡訊' : 'Email';
    toast({ 
      title: `${inviteType}邀請已發送`, 
      description: `已向客戶發送${inviteType}邀請` 
    });
  };

  const saveCustomer = (updatedCustomer: Customer) => {
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    );
    updateCustomers(updatedCustomers);
    toast({ title: "客戶資料已更新" });
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
              {activeSection === 'cards' && getPendingNotificationCount() > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 font-medium">
                      有 {getNewAdditionsCount()} 位新朋友追蹤您
                    </span>
                  </div>
                  <Button
                    onClick={() => setActiveFilter('followingMe')}
                    size="sm"
                    variant="outline"
                    className="text-xs h-6 border-red-300 text-red-600 hover:bg-red-100"
                  >
                    查看
                  </Button>
                </div>
              )}
              
              {/* 特殊篩選條件 */}
              <div className="space-y-2 mb-3">
                {activeSection === 'cards' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => toggleFilter('followingMe')}
                      variant={activeFilter === 'followingMe' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-shrink-0 text-xs h-7 relative bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      追蹤我
                      {getPendingNotificationCount() > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {getPendingNotificationCount()}
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => toggleFilter('favorites')}
                      variant={activeFilter === 'favorites' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-shrink-0 text-xs h-7 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      關注
                    </Button>
                  </div>
                )}
              </div>
              
              {/* 標籤篩選條件 - 可左右滑動 */}
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-500 mb-2">標籤分類</p>
                <ScrollArea className="w-full">
                  <div className="flex space-x-1 pb-1" style={{ minWidth: 'max-content' }}>
                    {availableTags.map(tag => (
                      <Button
                        key={tag}
                        onClick={() => toggleFilter(tag)}
                        variant={activeFilter === tag ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-6 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 whitespace-nowrap"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
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
                      ? <ExpandedCard
                          key={customer.id}
                          customer={customer}
                          activeSection={activeSection}
                          onToggleFavorite={toggleFavorite}
                          onAddFollower={addFollowerToCollected}
                          onIgnoreFollower={ignoreFollower}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onSendInvitation={sendInvitation}
                          onAddTag={addTag}
                          onRemoveTag={removeTag}
                          onSaveCustomer={saveCustomer}
                          onCollapse={() => setExpandedCard(null)}
                        />
                      : <CustomerCard
                          key={customer.id}
                          customer={customer}
                          onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
                          onAddFollower={addFollowerToCollected}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                        />
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
                      ? <ExpandedCard
                          key={customer.id}
                          customer={customer}
                          activeSection={activeSection}
                          onToggleFavorite={toggleFavorite}
                          onAddFollower={addFollowerToCollected}
                          onIgnoreFollower={ignoreFollower}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onSendInvitation={sendInvitation}
                          onAddTag={addTag}
                          onRemoveTag={removeTag}
                          onSaveCustomer={saveCustomer}
                          onCollapse={() => setExpandedCard(null)}
                        />
                      : <ContactCard
                          key={customer.id}
                          customer={customer}
                          onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
                        />
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

        <SmartRecommendation
          isCollapsed={isRecommendationCollapsed}
          onToggleCollapse={() => setIsRecommendationCollapsed(!isRecommendationCollapsed)}
          onAddRecommendedContact={addRecommendedContact}
          recommendedContacts={recommendedContacts}
        />
      </div>
    </div>
  );
};

export default MyCustomers;
