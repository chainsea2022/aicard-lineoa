import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Users, UserPlus, Heart, Bell, ChevronDown, ChevronRight, Tag, Star, UserCheck, UserX, Zap, Mail, MessageSquare } from 'lucide-react';
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
      mutualFriends: ['陈雅婷'],
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
      
      // 檢查是否有新的追蹤者並顯示通知
      const newFollowers = defaultCustomers.filter(c => 
        c.relationshipStatus === 'addedMe' && c.isNewAddition
      );
      
      if (newFollowers.length > 0) {
        setTimeout(() => {
          toast({
            title: "🎉 有新朋友加了你的名片！",
            description: `${newFollowers.length} 位朋友剛加入你的名片，快去查看吧！`
          });
        }, 1000);
      }
      
      return;
    }

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
    console.log('加我名片的客戶:', updatedCustomers.filter(c => c.relationshipStatus === 'addedMe'));
    setLocalCustomers(updatedCustomers);
    onCustomersUpdate(updatedCustomers);
  }, [onCustomersUpdate]);

  useEffect(() => {
    const handleCustomerScannedCard = (event: CustomEvent) => {
      const newCustomer = event.detail;
      
      const existingCustomer = localCustomers.find(c => c.name === newCustomer.name);
      if (existingCustomer) {
        return;
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

  // 我的電子名片夾區塊（數位電子名片專區）
  const myBusinessCards = localCustomers.filter(c => c.hasCard);
  
  // 我的聯絡人區塊（紙本掃描名片專區）
  const myContacts = localCustomers.filter(c => !c.hasCard);

  const getFollowerRequests = () => {
    const followers = myBusinessCards.filter(c => c.relationshipStatus === 'addedMe');
    console.log('追蹤請求:', followers);
    return followers;
  };

  const getNewFollowersCount = () => {
    return myBusinessCards.filter(c => 
      c.relationshipStatus === 'addedMe' && c.isNewAddition
    ).length;
  };

  const getTotalFollowersCount = () => {
    return getFollowerRequests().length;
  };

  const getFilteredCards = () => {
    let filteredCards = myBusinessCards;
    console.log('所有名片:', filteredCards);
    console.log('當前篩選條件:', activeFilter);

    if (searchTerm) {
      filteredCards = filteredCards.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

    // 智能推薦的名片顯示在最上方
    const recommendedCards = filteredCards.filter(c => c.tags?.includes('推薦聯絡人'));
    const normalCards = filteredCards.filter(c => !c.tags?.includes('推薦聯絡人'));

    if (activeFilter === 'followingMe') {
      filteredCards.sort((a, b) => {
        if (a.isNewAddition && !b.isNewAddition) return -1;
        if (!a.isNewAddition && b.isNewAddition) return 1;
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      });
    } else {
      filteredCards = [...recommendedCards, ...normalCards];
    }

    console.log('篩選後的名片:', filteredCards);
    return filteredCards;
  };

  const getFilteredContacts = () => {
    let filteredContacts = myContacts;

    if (searchTerm) {
      filteredContacts = filteredContacts.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 聯絡人篩選邏輯
    switch (activeFilter) {
      case 'invited':
        filteredContacts = filteredContacts.filter(customer => 
          customer.invitationSent || customer.emailInvitationSent
        );
        break;
      case 'notInvited':
        filteredContacts = filteredContacts.filter(customer => 
          !customer.invitationSent && !customer.emailInvitationSent
        );
        break;
      case 'inviteHistory':
        filteredContacts = filteredContacts.filter(customer => 
          customer.invitationSent || customer.emailInvitationSent
        );
        break;
      default:
        if (availableTags.includes(activeFilter)) {
          filteredContacts = filteredContacts.filter(customer => customer.tags?.includes(activeFilter));
        }
        break;
    }

    return filteredContacts;
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

  const addFollowerBack = (customerId: number) => {
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
    
    toast({ 
      title: "🙌 名片已互加成功", 
      description: `你們已互加名片，讓交流更進一步！` 
    });
  };

  const ignoreFollower = (customerId: number) => {
    const customer = localCustomers.find(c => c.id === customerId);
    const updatedCustomers = localCustomers.map(c => 
      c.id === customerId ? { 
        ...c, 
        isFollowingMe: false, 
        hasPendingInvitation: false, 
        isNewAddition: false,
        relationshipStatus: 'ignored' as const
      } : c
    );
    updateCustomers(updatedCustomers);
    toast({ 
      title: "已忽略", 
      description: `已忽略 ${customer?.name} 的追蹤請求` 
    });
  };

  const addAllFollowersBack = () => {
    const followerRequests = getFollowerRequests();
    const updatedCustomers = localCustomers.map(c => {
      if (c.relationshipStatus === 'addedMe') {
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
    
    toast({ 
      title: "🎉 全部加回成功", 
      description: `已加回 ${followerRequests.length} 位朋友的名片！` 
    });
  };

  const deleteCustomer = (customerId: number) => {
    const updatedCustomers = localCustomers.filter(c => c.id !== customerId);
    updateCustomers(updatedCustomers);
  };

  const InstagramStyleFollowerCard = ({ customer }: { customer: Customer }) => {
    const timeAgo = () => {
      const now = new Date();
      const added = new Date(customer.addedDate);
      const diffMinutes = Math.floor((now.getTime() - added.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) return '剛剛';
      if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} 小時前`;
      return `${Math.floor(diffMinutes / 1440)} 天前`;
    };

    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          {customer.photo && (
            <img 
              src={customer.photo} 
              alt={customer.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" 
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
              {customer.isNewAddition && (
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                  新
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{customer.company}</p>
            <p className="text-sm text-gray-500 truncate">{customer.jobTitle}</p>
            <p className="text-xs text-gray-400 mt-1">
              {timeAgo()} 加了你的名片
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={() => addFollowerBack(customer.id)}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm h-9 rounded-lg font-medium"
          >
            <UserCheck className="w-4 h-4 mr-1" />
            ＋加回
          </Button>
          <Button
            onClick={() => ignoreFollower(customer.id)}
            size="sm"
            variant="outline"
            className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50 text-sm h-9 rounded-lg"
          >
            <UserX className="w-4 h-4 mr-1" />
            忽略
          </Button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-50">
          <Button
            onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
            variant="ghost"
            size="sm"
            className="w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            查看詳細資料
          </Button>
        </div>
      </div>
    );
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
    const currentDate = new Date().toISOString();
    const updatedCustomers = localCustomers.map(customer => 
      customer.id === customerId 
        ? { 
            ...customer, 
            invitationSent: type === 'sms' ? true : customer.invitationSent,
            emailInvitationSent: type === 'email' ? true : customer.emailInvitationSent,
            invitationDate: type === 'sms' ? currentDate : customer.invitationDate,
            emailInvitationDate: type === 'email' ? currentDate : customer.emailInvitationDate
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

  const followerRequests = getFollowerRequests();
  const newFollowersCount = getNewFollowersCount();
  const totalFollowersCount = getTotalFollowersCount();

  console.log('最終追蹤請求列表:', followerRequests);
  console.log('新追蹤者數量:', newFollowersCount);
  console.log('總追蹤者數量:', totalFollowersCount);

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
            {/* Instagram 式紅點通知 */}
            {totalFollowersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                {totalFollowersCount}
              </div>
            )}
          </Button>
          <Button
            onClick={() => {
              setActiveSection('contacts');
              setActiveFilter('all');
            }}
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
              {/* Instagram 式置頂通知區塊 */}
              {activeSection === 'cards' && totalFollowersCount > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mb-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-full -mr-8 -mt-8 opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-2xl">👋</div>
                      <div>
                        <h3 className="text-sm font-semibold text-orange-800">
                          🎉 你有 {newFollowersCount > 0 ? newFollowersCount : totalFollowersCount} 位{newFollowersCount > 0 ? '新' : ''}朋友加了你的名片
                        </h3>
                        <p className="text-xs text-orange-600">
                          {newFollowersCount > 0 ? '是否也加入他們？' : '點選查看完整列表'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setActiveFilter('followingMe')}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 rounded-lg font-medium"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        查看全部
                      </Button>
                      {newFollowersCount > 1 && (
                        <Button
                          onClick={addAllFollowersBack}
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50 text-xs h-8 rounded-lg"
                        >
                          全部加回
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 特殊篩選條件 */}
              <div className="space-y-2 mb-3">
                {activeSection === 'cards' ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => toggleFilter('followingMe')}
                      variant={activeFilter === 'followingMe' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-shrink-0 text-xs h-7 relative bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 rounded-lg"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      加我名片
                      {totalFollowersCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {totalFollowersCount}
                        </div>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => toggleFilter('favorites')}
                      variant={activeFilter === 'favorites' ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-shrink-0 text-xs h-7 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 rounded-lg"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      關注
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="flex space-x-2 pb-2" style={{ minWidth: 'max-content' }}>
                      <Button
                        onClick={() => toggleFilter('invited')}
                        variant={activeFilter === 'invited' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-7 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-lg"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        已邀請
                      </Button>
                      
                      <Button
                        onClick={() => toggleFilter('notInvited')}
                        variant={activeFilter === 'notInvited' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-7 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        未邀請
                      </Button>
                      
                      <Button
                        onClick={() => toggleFilter('inviteHistory')}
                        variant={activeFilter === 'inviteHistory' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-7 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg"
                      >
                        邀請紀錄
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 標籤篩選條件 - 可左右滑動 */}
              <div className="border-t border-gray-100 pt-2">
                <p className="text-xs text-gray-500 mb-2">標籤分類</p>
                <div className="overflow-x-auto">
                  <div className="flex space-x-2 pb-2" style={{ minWidth: 'max-content' }}>
                    {availableTags.map(tag => (
                      <Button
                        key={tag}
                        onClick={() => toggleFilter(tag)}
                        variant={activeFilter === tag ? 'default' : 'outline'}
                        size="sm"
                        className="flex-shrink-0 text-xs h-6 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 whitespace-nowrap rounded-lg"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
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
                {activeFilter === 'followingMe' && (
                  <div className="mb-4">
                    {/* Instagram 式標題 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-orange-500" />
                        <h3 className="font-semibold text-gray-900">加我名片的人</h3>
                        <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                          {totalFollowersCount}
                        </div>
                      </div>
                      {totalFollowersCount > 1 && (
                        <Button
                          onClick={addAllFollowersBack}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs h-7 rounded-lg font-medium"
                        >
                          全部加回
                        </Button>
                      )}
                    </div>
                    
                    {/* Instagram 式追蹤請求列表 */}
                    {followerRequests.map(customer => (
                      <InstagramStyleFollowerCard key={customer.id} customer={customer} />
                    ))}
                  </div>
                )}
                
                {activeFilter !== 'followingMe' && getFilteredCards().length > 0 ? (
                  getFilteredCards().map(customer => 
                    expandedCard === customer.id 
                      ? <ExpandedCard
                          key={customer.id}
                          customer={customer}
                          activeSection={activeSection}
                          onToggleFavorite={toggleFavorite}
                          onAddFollower={addFollowerBack}
                          onIgnoreFollower={ignoreFollower}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onSendInvitation={sendInvitation}
                          onAddTag={addTag}
                          onRemoveTag={removeTag}
                          onSaveCustomer={saveCustomer}
                          onDeleteCustomer={deleteCustomer}
                          onCollapse={() => setExpandedCard(null)}
                        />
                      : <CustomerCard
                          key={customer.id}
                          customer={customer}
                          onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
                          onAddFollower={addFollowerBack}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onToggleFavorite={toggleFavorite}
                        />
                  )
                ) : activeFilter !== 'followingMe' && (
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

                {activeFilter === 'followingMe' && followerRequests.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">還沒有人加你的名片</h3>
                    <p className="text-gray-500 text-sm">
                      當有人掃描您的 QR Code 或加入您的聯絡人時
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      將會顯示在這裡
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
                          onAddFollower={addFollowerBack}
                          onIgnoreFollower={ignoreFollower}
                          onPhoneClick={handlePhoneClick}
                          onLineClick={handleLineClick}
                          onSendInvitation={sendInvitation}
                          onAddTag={addTag}
                          onRemoveTag={removeTag}
                          onSaveCustomer={saveCustomer}
                          onDeleteCustomer={deleteCustomer}
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
                      {searchTerm || activeFilter !== 'all' ? '找不到符合條件的聯絡人' : '還沒有任何聯絡人'}
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

        {activeSection === 'cards' && (
          <SmartRecommendation
            isCollapsed={isRecommendationCollapsed}
            onToggleCollapse={() => setIsRecommendationCollapsed(!isRecommendationCollapsed)}
            onAddRecommendedContact={addRecommendedContact}
            recommendedContacts={recommendedContacts}
          />
        )}
      </div>
    </div>
  );
};

export default MyCustomers;
