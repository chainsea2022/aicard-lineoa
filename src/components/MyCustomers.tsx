
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Star, Users, QrCode, UserPlus, MessageSquare, Mail, Share2, Tag, Filter, Edit, Save, X, Plus, ChevronDown, ChevronRight, Phone, TrendingUp, Award, Eye, Crown, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
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
}

interface ProfessionalAdviser {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  industry: string;
  photo: string;
  isFollowing: boolean;
  followers: number;
  expertise: string[];
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
  const [showAdvisers, setShowAdvisers] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [followingCount, setFollowingCount] = useState(12);
  const [followersCount, setFollowersCount] = useState(8);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  const professionalAdvisers = [
    {
      id: 1,
      name: '王建國',
      jobTitle: '資深投資顧問',
      company: '台灣金融投資集團',
      industry: '金融投資',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isFollowing: false,
      followers: 12500,
      expertise: ['股票投資', '基金管理', '風險控制']
    },
    {
      id: 2,
      name: '李美華',
      jobTitle: '數位行銷總監',
      company: '創新科技行銷',
      industry: '數位行銷',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
      isFollowing: false,
      followers: 8900,
      expertise: ['社群行銷', 'SEO優化', '品牌策略']
    },
    {
      id: 3,
      name: '張志強',
      jobTitle: '技術長',
      company: 'AI科技有限公司',
      industry: '人工智慧',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isFollowing: false,
      followers: 15200,
      expertise: ['機器學習', '深度學習', '數據分析']
    }
  ];

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
    setLocalCustomers(savedCustomers);
    onCustomersUpdate(savedCustomers);
  }, [onCustomersUpdate]);

  const filteredCustomers = localCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = activeSection === 'cards' ? customer.hasCard : !customer.hasCard;
    
    switch (activeFilter) {
      case 'favorites':
        return matchesSearch && customer.isFavorite && matchesSection;
      default:
        if (availableTags.includes(activeFilter)) {
          return matchesSearch && customer.tags?.includes(activeFilter) && matchesSection;
        }
        return matchesSearch && matchesSection;
    }
  });

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

  const followAdviser = (adviserId: number) => {
    const adviser = professionalAdvisers.find(a => a.id === adviserId);
    if (adviser) {
      adviser.isFollowing = !adviser.isFollowing;
      
      if (adviser.isFollowing) {
        const newCustomer: Customer = {
          id: Date.now(),
          name: adviser.name,
          phone: '',
          email: '',
          company: adviser.company,
          jobTitle: adviser.jobTitle,
          photo: adviser.photo,
          hasCard: true,
          addedDate: new Date().toISOString(),
          notes: `專業顧問 - ${adviser.industry}`,
          isFavorite: true,
          tags: ['專業顧問', adviser.industry]
        };
        
        const updatedCustomers = [...localCustomers, newCustomer];
        setLocalCustomers(updatedCustomers);
        localStorage.setItem('aile-customers', JSON.stringify(updatedCustomers));
        onCustomersUpdate(updatedCustomers);
        
        toast({ 
          title: "已關注專業顧問", 
          description: `${adviser.name} 已加入您的關注列表` 
        });

        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('customerAddedNotification', {
            detail: { customerName: adviser.name, action: 'followed' }
          }));
        }, 1000);
      } else {
        toast({ 
          title: "已取消關注", 
          description: `不再關注 ${adviser.name}` 
        });
      }
    }
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
        hasCard: false,
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

  const showUpgradePrompt = () => {
    toast({
      title: "升級至 Aile 商務版",
      description: "解鎖專業商務管理功能，享受更多進階服務",
      duration: 3000,
    });
  };

  const renderCompactAdviserCard = (adviser: ProfessionalAdviser) => (
    <Card key={adviser.id} className="w-32 flex-shrink-0 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
      <CardContent className="p-3">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="w-16 h-16 border-2 border-blue-300">
            <AvatarImage src={adviser.photo} alt={adviser.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {adviser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-bold text-xs text-gray-800 truncate w-full">{adviser.name}</h3>
            <p className="text-xs text-blue-600 truncate w-full">{adviser.jobTitle}</p>
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-1">
              <Eye className="w-3 h-3" />
              <span>{(adviser.followers / 1000).toFixed(1)}K</span>
            </div>
          </div>
          <Button
            onClick={() => followAdviser(adviser.id)}
            size="sm"
            variant={adviser.isFollowing ? "default" : "outline"}
            className="h-6 px-2 text-xs w-full"
          >
            {adviser.isFollowing ? "已關注" : "關注"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompactRecommendationCard = (contact: RecommendedContact) => (
    <Card key={contact.id} className="w-32 flex-shrink-0 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
      <CardContent className="p-3">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="w-16 h-16 border-2 border-orange-300">
            <AvatarImage src={contact.photo} alt={contact.name} />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold">
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-bold text-xs text-gray-800 truncate w-full">{contact.name}</h3>
            <p className="text-xs text-orange-600 truncate w-full">{contact.jobTitle}</p>
            <p className="text-xs text-gray-500 truncate w-full mt-1">{contact.mutualFriends.length}位共同好友</p>
          </div>
          <Button
            onClick={() => addRecommendedContact(contact.id)}
            size="sm"
            variant="outline"
            className="h-6 px-2 text-xs border-orange-300 text-orange-600 hover:bg-orange-100 w-full"
          >
            加入
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompactCard = (customer: Customer) => (
    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm mb-1.5 overflow-hidden">
      <div className="flex items-center p-2 space-x-2">
        {activeSection === 'cards' && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage 
              src={customer.photo || getRandomProfessionalAvatar(customer.id)} 
              alt={customer.name} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
              {customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
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
        
        {activeSection === 'contacts' && (customer.invitationSent || customer.emailInvitationSent) && (
          <div className="flex items-center space-x-1 flex-shrink-0">
            {customer.invitationSent && (
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" title="已發送簡訊邀請" />
            )}
            {customer.emailInvitationSent && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="已發送Email邀請" />
            )}
          </div>
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

  const renderExpandedCard = (customer: Customer) => {
    const isEditing = editingCard === customer.id;
    const displayCustomer = isEditing ? editingCustomer! : customer;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {activeSection === 'cards' && (
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarImage 
                  src={displayCustomer.photo || getRandomProfessionalAvatar(displayCustomer.id)} 
                  alt={displayCustomer.name} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                  {displayCustomer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
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
              <Button
                onClick={() => toggleFavorite(customer.id)}
                variant="ghost"
                size="sm"
                className="p-0 h-auto mt-1"
              >
                <Star 
                  className={`w-4 h-4 ${customer.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                />
              </Button>
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

          {(customer.isInvited || customer.invitationSent || customer.emailInvitationSent) && (
            <div className="border-t pt-3">
              <label className="text-xs text-gray-500 mb-2 block">邀請狀態</label>
              <div className="flex items-center space-x-3">
                {customer.invitationSent && (
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">已發送簡訊</span>
                  </div>
                )}
                {customer.emailInvitationSent && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600">已發送Email</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Share2 className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600">已分享</span>
                </div>
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

      {/* Following/Followers Statistics */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 flex-shrink-0">
        <div className="flex items-center justify-around">
          <button 
            onClick={() => setShowFollowingModal(true)}
            className="flex flex-col items-center space-y-1 hover:bg-white/50 p-2 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-1">
              <UserCheck className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-lg text-purple-700">{followingCount}</span>
            </div>
            <span className="text-xs text-purple-600">關注中</span>
          </button>
          <div className="w-px h-8 bg-purple-300"></div>
          <button 
            onClick={() => setShowFollowersModal(true)}
            className="flex flex-col items-center space-y-1 hover:bg-white/50 p-2 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-lg text-purple-700">{followersCount}</span>
            </div>
            <span className="text-xs text-purple-600">關注者</span>
          </button>
        </div>
      </div>

      {/* Professional Advisers Section */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">專業顧問推薦</span>
          </div>
          <Button
            onClick={showUpgradePrompt}
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:bg-white/50"
          >
            查看更多
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {professionalAdvisers.map(adviser => (
                <CarouselItem key={adviser.id} className="pl-2 basis-auto">
                  {renderCompactAdviserCard(adviser)}
                </CarouselItem>
              ))}
              <CarouselItem className="pl-2 basis-auto">
                <Card className="w-32 flex-shrink-0 border-2 border-dashed border-blue-300 bg-blue-50/50">
                  <CardContent className="p-3">
                    <button 
                      onClick={showUpgradePrompt}
                      className="w-full h-full flex flex-col items-center justify-center space-y-2 text-blue-600 hover:text-blue-700"
                    >
                      <Crown className="w-8 h-8" />
                      <span className="text-xs font-medium text-center">升級查看更多專業顧問</span>
                    </button>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Smart Recommendations Section */}
      <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">智能推薦</span>
          </div>
          <Button
            onClick={showUpgradePrompt}
            variant="ghost"
            size="sm"
            className="text-xs text-orange-600 hover:bg-white/50"
          >
            查看更多
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {recommendedContacts.map(contact => (
                <CarouselItem key={contact.id} className="pl-2 basis-auto">
                  {renderCompactRecommendationCard(contact)}
                </CarouselItem>
              ))}
              <CarouselItem className="pl-2 basis-auto">
                <Card className="w-32 flex-shrink-0 border-2 border-dashed border-orange-300 bg-orange-50/50">
                  <CardContent className="p-3">
                    <button 
                      onClick={showUpgradePrompt}
                      className="w-full h-full flex flex-col items-center justify-center space-y-2 text-orange-600 hover:text-orange-700"
                    >
                      <Crown className="w-8 h-8" />
                      <span className="text-xs font-medium text-center">升級查看更多推薦</span>
                    </button>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex bg-white border-b border-gray-200 flex-shrink-0">
        <Button
          onClick={() => setActiveSection('cards')}
          variant={activeSection === 'cards' ? 'default' : 'ghost'}
          className="flex-1 rounded-none border-r"
        >
          <QrCode className="w-4 h-4 mr-2" />
          我的名片夾
          <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {localCustomers.filter(c => c.hasCard).length}
          </span>
        </Button>
        <Button
          onClick={() => setActiveSection('contacts')}
          variant={activeSection === 'contacts' ? 'default' : 'ghost'}
          className="flex-1 rounded-none"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          我的聯絡人
          <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {localCustomers.filter(c => !c.hasCard).length}
          </span>
        </Button>
      </div>

      {/* Filter Tags */}
      <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <ScrollArea className="w-full">
          <div className="flex space-x-1 pb-1 min-w-max">
            <Button
              onClick={() => setActiveFilter('favorites')}
              variant={activeFilter === 'favorites' ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 text-xs h-7"
            >
              <Star className="w-3 h-3 mr-1" />
              關注
            </Button>
            
            {availableTags.map(tag => (
              <Button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                variant={activeFilter === tag ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0 text-xs h-7"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
            
            <Button
              onClick={() => setActiveFilter('all')}
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 text-xs h-7"
            >
              <Filter className="w-3 h-3 mr-1" />
              全部
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Customer List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredCustomers.length > 0 ? (
            <div className="space-y-0">
              {filteredCustomers.map(customer => 
                expandedCard === customer.id 
                  ? renderExpandedCard(customer)
                  : renderCompactCard(customer)
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? '找不到符合條件的聯絡人' : `還沒有任何${activeSection === 'cards' ? '名片' : '聯絡人'}`}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                使用掃描功能來新增{activeSection === 'cards' ? '名片' : '聯絡人'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Following Modal Placeholder */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">我的關注</h3>
            <p className="text-gray-600 text-sm mb-4">顯示您關注的 {followingCount} 位好友</p>
            <Button onClick={() => setShowFollowingModal(false)} className="w-full">
              關閉
            </Button>
          </div>
        </div>
      )}

      {/* Followers Modal Placeholder */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">關注我的</h3>
            <p className="text-gray-600 text-sm mb-4">顯示關注您的 {followersCount} 位好友</p>
            <Button onClick={() => setShowFollowersModal(false)} className="w-full">
              關閉
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCustomers;
