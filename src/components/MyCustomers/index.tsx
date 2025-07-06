import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Users, UserPlus, Heart, Bell, ChevronDown, ChevronRight, Tag, Star, UserCheck, UserX } from 'lucide-react';
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
      console.log('設定預設客戶資料:', defaultCustomers);
      setLocalCustomers(defaultCustomers);
      localStorage.setItem('aile-customers', JSON.stringify(defaultCustomers));
      onCustomersUpdate(defaultCustomers);
      return;
    }

    // 確保每個客戶都有正確的屬性
    const updatedCustomers = savedCustomers.map((customer: any) => {
      return {
        ...customer,
        isMyFriend: customer.isMyFriend ?? (customer.relationshipStatus !== 'addedMe'),
        isFollowingMe: customer.isFollowingMe ?? (customer.relationshipStatus === 'addedMe'),
        hasPendingInvitation: customer.hasPendingInvitation ?? (customer.relationshipStatus === 'addedMe'),
        relationshipStatus: customer.relationshipStatus ?? (customer.hasCard ? 'collected' : 'addedMe'),
        isNewAddition: customer.isNewAddition ?? false
      } as Customer;
    });
    
    console.log('載入的客戶資料:', updatedCustomers);
    setLocalCustomers(updatedCustomers);
    onCustomersUpdate(updatedCustomers);
  }, [onCustomersUpdate]);

  // 監聽來自 MyCard 組件的事件
  useEffect(() => {
    const handleCustomerScannedCard = (event: CustomEvent) => {
      const newCustomer = event.detail;
      
      // 檢查是否已存在相同名稱的客戶
      const existingCustomer = localCustomers.find(c => c.name === newCustomer.name);
      if (existingCustomer) {
        return; // 如果已存在，不重複添加
      }

      const updatedCustomers = [...localCustomers, newCustomer];
      updateCustomers(updatedCustomers);
      
      toast({
        title: "新的追蹤者！",
        description: `${newCustomer.name} 已加入您的名片，請查看追蹤我列表`
      });
    };

    window.addEventListener('customerScannedCard', handleCustomerScannedCard as EventListener);
    
    return () => {
      window.removeEventListener('customerScannedCard', handleCustomerScannedCard as EventListener);
    };
  }, [localCustomers]);

  const myBusinessCards = localCustomers.filter(c => c.hasCard);
  const myContacts = localCustomers.filter(c => !c.hasCard);

  const getPendingFollowerRequests = () => {
    return myBusinessCards.filter(c => 
      c.relationshipStatus === 'addedMe' && c.hasPendingInvitation
    );
  };

  const getNewAdditionsCount = () => {
    return myBusinessCards.filter(c => 
      c.relationshipStatus === 'addedMe' && c.isNewAddition
    ).length;
  };

  const getFilteredCards = () => {
    let filteredCards = myBusinessCards;
    console.log('所有名片:', filteredCards);
    console.log('當前篩選條件:', activeFilter);

    // 先按搜尋條件篩選
    if (searchTerm) {
      filteredCards = filteredCards.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 再按篩選條件篩選
    switch (activeFilter) {
      case 'followingMe':
        filteredCards = filteredCards.filter(customer => {
          const isFollowingMe = customer.relationshipStatus === 'addedMe';
          console.log(`${customer.name} - relationshipStatus: ${customer.relationshipStatus}, isFollowingMe: ${isFollowingMe}`);
          return isFollowingMe;
        });
        break;
      case 'favorites':
        filteredCards = filteredCards.filter(customer => customer.isFavorite);
        break;
      default:
        if (availableTags.includes(activeFilter)) {
          filteredCards = filteredCards.filter(customer => customer.tags?.includes(activeFilter));
        }
        break;
    }

    // 排序：追蹤我列表中新加入的排在前面
    if (activeFilter === 'followingMe') {
      filteredCards.sort((a, b) => {
        if (a.isNewAddition && !b.isNewAddition) return -1;
        if (!a.isNewAddition && b.isNewAddition) return 1;
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      });
    }

    console.log('篩選後的名片:', filteredCards);
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
    console.log('切換篩選條件:', filter);
    setActiveFilter(activeFilter === filter ? 'all' : filter);
  };

  const updateCustomers = (updatedCustomers: Customer[]) => {
    console.log('更新客戶資料:', updatedCustomers);
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
    
    toast({ title: "已接受", description: `${customer?.name} 已加入您的電子名片夾` });
  };

  const ignoreFollower = (customerId: number) => {
    const customer = localCustomers.find(c => c.id === customerId);
    const updatedCustomers = localCustomers.map(c => 
      c.id === customerId ? { ...c, isFollowingMe: false, hasPendingInvitation: false, isNewAddition: false } : c
    );
    updateCustomers(updatedCustomers);
    toast({ title: "已拒絕", description: `已拒絕 ${customer?.name} 的追蹤請求` });
  };

  const FollowerRequestCard = ({ customer }: { customer: Customer }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 shadow-sm">
      <div className="flex items-center space-x-3">
        {customer.photo && (
          <img 
            src={customer.photo} 
            alt={customer.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
            {customer.isNewAddition && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                新
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{customer.company}</p>
          <p className="text-sm text-gray-500 truncate">{customer.jobTitle}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(customer.addedDate).toLocaleDateString('zh-TW')} 加入
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-3">
        <Button
          onClick={() => addFollowerToCollected(customer.id)}
          size="sm"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
        >
          <UserCheck className="w-3 h-3 mr-1" />
          接受
        </Button>
        <Button
          onClick={() => ignoreFollower(customer.id)}
          size="sm"
          variant="outline"
          className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-50 text-xs h-8"
        >
          <UserX className="w-3 h-3 mr-1" />
          拒絕
        </Button>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100">
        <Button
          onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
          variant="ghost"
          size="sm"
          className="w-full text-xs text-gray-500 hover:text-gray-700"
        >
          查看詳細資料
        </Button>
      </div>
    </div>
  );

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

  const pendingRequests = getPendingFollowerRequests();

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
            {pendingRequests.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {pendingRequests.length}
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
              {activeSection === 'cards' && pendingRequests.length > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 font-medium">
                      追蹤請求
                    </span>
                    <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {pendingRequests.length}
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mb-2">
                    有 {getNewAdditionsCount()} 位新朋友想要追蹤您
                  </p>
                  <Button
                    onClick={() => setActiveFilter('followingMe')}
                    size="sm"
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-xs h-7"
                  >
                    查看所有請求
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
                      {pendingRequests.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {pendingRequests.length}
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => toggleFilter('favorites')}
                      variant={activeFilter === 'favorites' ? 'default' : 'ghost'}
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
                {activeFilter === 'followingMe' && pendingRequests.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Bell className="w-4 h-4 text-red-500" />
                      <h3 className="font-medium text-gray-900">追蹤請求</h3>
                      <div className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        {pendingRequests.length}
                      </div>
                    </div>
                    {pendingRequests.map(customer => (
                      <FollowerRequestCard key={customer.id} customer={customer} />
                    ))}
                  </div>
                )}
                
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
                      : activeFilter === 'followingMe' && customer.hasPendingInvitation
                      ? null // 已在上面的請求列表中顯示
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
                      {activeFilter === 'followingMe' 
                        ? '目前沒有追蹤請求' 
                        : (searchTerm || activeFilter !== 'all' ? '找不到符合條件的電子名片' : '還沒有任何電子名片')
                      }
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {activeFilter === 'followingMe' 
                        ? '當有人掃描您的 QR Code 或加入您的聯絡人時，將會顯示在這裡'
                        : '掃描對方的電子名片來建立人脈關係'
                      }
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
