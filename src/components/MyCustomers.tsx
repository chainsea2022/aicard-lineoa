import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, Users, QrCode, UserPlus, MessageSquare, Mail, Share2, Tag, Filter, Edit, Save, X, Plus, ChevronDown, ChevronRight, Phone, TrendingUp, Crown, Heart, UserCheck, Bell, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  const [activeSection, setActiveSection] = useState<'friends' | 'contacts'>('friends');
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(['工作', '朋友', '客戶', '合作夥伴', '潛在客戶']);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newTag, setNewTag] = useState('');
  const [isRecommendationMinimized, setIsRecommendationMinimized] = useState(false);
  const [invitationFilter, setInvitationFilter] = useState<'all' | 'invited' | 'uninvited'>('all');
  const [showMoreScanned, setShowMoreScanned] = useState(false);
  const [showMoreFollowing, setShowMoreFollowing] = useState(false);
  const [expandedSubSection, setExpandedSubSection] = useState<'myFriends' | 'followingMe' | null>(null);
  const [friendsFilter, setFriendsFilter] = useState<'all' | 'myFriends' | 'followingMe'>('all');

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

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const updatedCustomers = savedCustomers.map((customer: Customer) => ({
      ...customer,
      isMyFriend: customer.isMyFriend || customer.hasCard,
      isFollowingMe: customer.isFollowingMe || false,
      hasPendingInvitation: customer.hasPendingInvitation || false
    }));
    setLocalCustomers(updatedCustomers);
    onCustomersUpdate(updatedCustomers);
  }, [onCustomersUpdate]);

  const myFriendsScanned = localCustomers.filter(c => c.isMyFriend && c.hasCard);
  const followingMeUnscanned = localCustomers.filter(c => c.isFollowingMe && !c.isMyFriend);
  const followingMeWithPendingInvitations = followingMeUnscanned.filter(c => c.hasPendingInvitation);
  const myContacts = localCustomers.filter(c => !c.hasCard);

  const displayedScannedFriends = showMoreScanned ? myFriendsScanned : myFriendsScanned.slice(0, 5);
  const displayedFollowingMe = showMoreFollowing ? followingMeUnscanned : followingMeUnscanned.slice(0, 5);

  const getFilteredFriends = () => {
    let friendsList = [];
    
    switch (friendsFilter) {
      case 'myFriends':
        friendsList = displayedScannedFriends;
        break;
      case 'followingMe':
        friendsList = displayedFollowingMe;
        break;
      default:
        friendsList = [...displayedScannedFriends, ...displayedFollowingMe];
    }

    return friendsList.filter(customer => {
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

  const filteredContacts = myContacts.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (invitationFilter) {
      case 'invited':
        return matchesSearch && (customer.invitationSent || customer.emailInvitationSent);
      case 'uninvited':
        return matchesSearch && !(customer.invitationSent || customer.emailInvitationSent);
      default:
        return matchesSearch;
    }
  });

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
        tags: ['推薦聯絡人']
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

  const addFollowerToFriends = (customerId: number) => {
    const updatedCustomers = localCustomers.map(c => 
      c.id === customerId ? { ...c, isMyFriend: true } : c
    );
    setLocalCustomers(updatedCustomers);
    localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
    onCustomersUpdate(updatedCustomers);
    toast({ title: "已加入我的好友" });
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

  const renderRecommendationCard = (contact: RecommendedContact) => (
    <Card className="w-full bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10 border border-orange-300 flex-shrink-0">
            <AvatarImage src={contact.photo} alt={contact.name} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold text-xs">
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs text-gray-800 truncate">{contact.name}</h3>
            <p className="text-xs text-gray-600 truncate">{contact.jobTitle}</p>
            <p className="text-xs text-gray-500 truncate">{contact.company}</p>
          </div>
          <Button
            onClick={() => addRecommendedContact(contact.id)}
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-100 flex-shrink-0 text-xs h-6 px-2"
          >
            加入
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSubSectionHeader = (title: string, count: number, hasNotifications: boolean = false, subSection: 'myFriends' | 'followingMe') => (
    <div 
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-colors"
      onClick={() => setExpandedSubSection(expandedSubSection === subSection ? null : subSection)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-blue-800">{title}</h3>
          <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {count}
          </span>
          {hasNotifications && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
              有新邀請
            </span>
          )}
        </div>
        {expandedSubSection === subSection ? 
          <ChevronDown className="w-4 h-4 text-blue-600" /> : 
          <ChevronRight className="w-4 h-4 text-blue-600" />
        }
      </div>
    </div>
  );

  const renderFriendCard = (customer: Customer) => {
    const isUnscannedFollower = customer.isFollowingMe && !customer.isMyFriend;
    
    return (
      <div key={customer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm mb-1.5 overflow-hidden">
        <div className="flex items-center p-2 space-x-2">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage 
              src={customer.photo || getRandomProfessionalAvatar(customer.id)} 
              alt={customer.name} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
              {customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <h3 className="font-bold text-xs text-gray-800 truncate">{customer.name}</h3>
              <Button
                onClick={() => toggleFavorite(customer.id)}
                variant="ghost"
                size="sm"
                className="p-0 h-4 w-4 flex-shrink-0"
              >
                <Star 
                  className={`w-3 h-3 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                />
              </Button>
              {isUnscannedFollower && (
                <span className="text-xs text-red-600 font-medium">⚠️ 尚未加入</span>
              )}
            </div>
            
            <div className="text-xs text-gray-600 space-y-0.5">
              {customer.company && (
                <div className="truncate text-xs">{customer.company}</div>
              )}
              <div className="flex items-center space-x-2 text-xs">
                {customer.phone && (
                  <button
                    onClick={() => handlePhoneClick(customer.phone)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Phone className="w-2.5 h-2.5" />
                    <span className="truncate text-xs">{customer.phone}</span>
                  </button>
                )}
                {customer.line && (
                  <button
                    onClick={() => handleLineClick(customer.line!)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <span className="text-xs">💬</span>
                    <span className="text-xs">LINE</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {isUnscannedFollower && (
            <Button
              onClick={() => addFollowerToFriends(customer.id)}
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs flex-shrink-0"
            >
              加入
            </Button>
          )}
          
          <Button
            onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-5 w-5 p-0"
          >
            {expandedCard === customer.id ? 
              <ChevronDown className="w-3 h-3" /> : 
              <ChevronRight className="w-3 h-3" />
            }
          </Button>
        </div>
      </div>
    );
  };

  const renderContactCard = (customer: Customer) => (
    <Card key={customer.id} className="mb-2 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-sm text-gray-800">{customer.name}</h3>
              <Button
                onClick={() => toggleFavorite(customer.id)}
                variant="ghost"
                size="sm"
                className="p-0 h-4 w-4 flex-shrink-0"
              >
                <Star 
                  className={`w-3 h-3 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                />
              </Button>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              {customer.company && <div>{customer.company}</div>}
              {customer.jobTitle && <div>{customer.jobTitle}</div>}
              {customer.phone && <div>{customer.phone}</div>}
              {customer.email && <div>{customer.email}</div>}
            </div>
            
            {customer.tags && customer.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {customer.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-1 ml-3 flex-shrink-0">
            {customer.phone && (
              <Button
                onClick={() => handleSMSClick(customer.phone)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                title="發送簡訊"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </Button>
            )}
            {customer.email && (
              <Button
                onClick={() => handleEmailClick(customer.email)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                title="發送Email"
              >
                <Mail className="w-4 h-4 text-green-600" />
              </Button>
            )}
            <Button
              onClick={() => setExpandedCard(expandedCard === customer.id ? null : customer.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {expandedCard === customer.id ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderExpandedCard = (customer: Customer) => {
    const isEditing = editingCard === customer.id;
    const displayCustomer = isEditing ? editingCustomer! : customer;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage 
                src={displayCustomer.photo || getRandomProfessionalAvatar(displayCustomer.id)} 
                alt={displayCustomer.name} 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                {displayCustomer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
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

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 shadow-lg flex-shrink-0">
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

      <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
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

      {/* Section Tabs */}
      <div className="flex bg-white border-b border-gray-200 flex-shrink-0">
        <Button
          onClick={() => setActiveSection('friends')}
          variant={activeSection === 'friends' ? 'default' : 'ghost'}
          className="flex-1 rounded-none border-r text-xs"
        >
          <Heart className="w-4 h-4 mr-1" />
          我的電子名片夾
          <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
            {myFriendsScanned.length + followingMeUnscanned.length}
          </span>
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

      {/* Filter Sections */}
      {activeSection === 'friends' && (
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="p-3 border-b">
            <div className="flex space-x-1">
              <Button
                onClick={() => setFriendsFilter('all')}
                variant={friendsFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0 text-xs h-7"
              >
                全部
              </Button>
              <Button
                onClick={() => setFriendsFilter('myFriends')}
                variant={friendsFilter === 'myFriends' ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0 text-xs h-7"
              >
                我的好友名片
              </Button>
              <Button
                onClick={() => setFriendsFilter('followingMe')}
                variant={friendsFilter === 'followingMe' ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0 text-xs h-7"
              >
                追蹤我
                {followingMeWithPendingInvitations.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                    {followingMeWithPendingInvitations.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
          <div className="p-3">
            <ScrollArea>
              <div className="flex space-x-1 pb-1 min-w-max">
                <Button
                  onClick={() => toggleFilter('favorites')}
                  variant={activeFilter === 'favorites' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-shrink-0 text-xs h-7"
                >
                  <Star className="w-3 h-3 mr-1" />
                  關注中
                </Button>
                
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    onClick={() => toggleFilter(tag)}
                    variant={activeFilter === tag ? 'default' : 'outline'}
                    size="sm"
                    className="flex-shrink-0 text-xs h-7"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {activeSection === 'contacts' && (
        <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex space-x-1">
            <Button
              onClick={() => setInvitationFilter('all')}
              variant={invitationFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 text-xs h-7"
            >
              全部
            </Button>
            <Button
              onClick={() => setInvitationFilter('invited')}
              variant={invitationFilter === 'invited' ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 text-xs h-7"
            >
              已邀請
            </Button>
            <Button
              onClick={() => setInvitationFilter('uninvited')}
              variant={invitationFilter === 'uninvited' ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 text-xs h-7"
            >
              未邀請
            </Button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {activeSection === 'friends' ? (
            <div className="space-y-0">
              {getFilteredFriends().length > 0 ? (
                getFilteredFriends().map(customer => 
                  expandedCard === customer.id 
                    ? renderExpandedCard(customer)
                    : renderFriendCard(customer)
                )
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {searchTerm || activeFilter !== 'all' ? '找不到符合條件的名片' : '還沒有任何電子名片卡'}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">使用掃描功能來新增名片卡</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-0">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(customer => 
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

      {/* Smart Recommendations Section - Bottom */}
      <div className={`bg-gradient-to-r from-orange-50 to-yellow-50 border-t border-orange-200 flex-shrink-0 transition-all duration-300 ${isRecommendationMinimized ? 'p-2' : 'p-3'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">智能推薦</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              onClick={() => setIsRecommendationMinimized(!isRecommendationMinimized)}
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:bg-white/50 h-6 w-6 p-0"
            >
              {isRecommendationMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              onClick={showUpgradePrompt}
              variant="ghost"
              size="sm"
              className="text-xs text-orange-600 hover:bg-white/50 h-6 px-2"
            >
              更多
            </Button>
          </div>
        </div>
        
        {!isRecommendationMinimized && (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {recommendedContacts.map((contact) => (
                <CarouselItem key={contact.id} className="pl-2 md:pl-4 basis-3/4">
                  {renderRecommendationCard(contact)}
                </CarouselItem>
              ))}
              <CarouselItem className="pl-2 md:pl-4 basis-3/4">
                <Card className="w-full border-2 border-dashed border-orange-300 bg-orange-50/50">
                  <CardContent className="p-3">
                    <button 
                      onClick={showUpgradePrompt}
                      className="w-full h-full flex flex-col items-center justify-center space-y-1 text-orange-600 hover:text-orange-700"
                    >
                      <Crown className="w-6 h-6" />
                      <span className="text-xs font-medium text-center">升級解鎖</span>
                    </button>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        )}
        
        {isRecommendationMinimized && (
          <div className="text-center">
            <span className="text-xs text-orange-600">點擊展開查看推薦</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCustomers;
