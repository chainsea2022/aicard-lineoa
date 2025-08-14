import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, X, Star, UserPlus, CheckCircle, Users, Tag, Heart, Phone, MessageCircle, Mail, Send, Share, Copy, MessageSquare, Bell, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { CustomerDetailPage } from './MyCustomers/CustomerDetailPage';
import { Customer } from './MyCustomers/types';
import { generateMockCustomers } from './MyCustomers/mockData';
import { getRandomProfessionalAvatar } from './MyCustomers/utils';
import InvitationDialog from './InvitationDialog';
import { SmartRecommendationDetail } from './SmartRecommendationDetail';

interface UnifiedCardFolderProps {
  onClose: () => void;
}

interface FilterState {
  category: 'all' | 'my-cards' | 'unregistered' | 'recommendations' | 'invited-by' | 'invited' | 'following' | 'tags' | 'tag';
  selectedTags?: string[];
  tag?: string;
}

// Mock data for smart recommendations
const generateMockRecommendations = (count: number): Customer[] => {
  const names = ['張志明', '李小美', '王大偉', '陳雅婷', '林俊傑'];
  const companies = ['科技公司', '貿易公司', '設計工作室', '顧問公司', '媒體公司'];
  const jobTitles = ['產品經理', '設計師', '工程師', '業務經理', '行銷專員'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: 2000 + i,
    name: names[i % names.length],
    phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `${names[i % names.length].toLowerCase()}@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
    company: companies[i % companies.length],
    jobTitle: jobTitles[i % jobTitles.length],
    photo: getRandomProfessionalAvatar(2000 + i),
    hasCard: true,
    addedDate: new Date().toISOString(),
    notes: '智能推薦聯絡人',
    tags: ['智能推薦'],
    relationshipStatus: 'collected' as const,
    isDigitalCard: true,
    isRegisteredUser: true,
    isRecommendation: true
  }));
};

const UnifiedCardFolder: React.FC<UnifiedCardFolderProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterState>({ category: 'all' });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [selectedInvitationCustomer, setSelectedInvitationCustomer] = useState<Customer | null>(null);
  const [showRecommendationDetail, setShowRecommendationDetail] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const mockData = generateMockCustomers();
    const recommendations = generateMockRecommendations(4);
    return [...mockData, ...recommendations];
  });

  // Common tags data
  const commonTags = ['同事', '客戶', '朋友', '供應商', '合作夥伴', '主管', '下屬', '同學', '家人', '醫生'];

  // Calculate counts for filters
  const myCardsCount = customers.filter(c => c.isRegisteredUser && !c.isRecommendation).length;
  const unregisteredCount = customers.filter(c => !c.isRegisteredUser).length;
  const recommendationsCount = customers.filter(c => c.isRecommendation).length;
  const invitedByCount = customers.filter(c => c.relationshipStatus === 'addedMe').length;
  const invitedCount = customers.filter(c => c.invitationSent || c.emailInvitationSent).length;

  const getFilteredCustomers = () => {
    let filtered = customers.filter(customer => {
      // Search filter
      if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, 'i');
        const matchesSearch = searchRegex.test(customer.name) || 
                             searchRegex.test(customer.company || '') || 
                             searchRegex.test(customer.phone || '') || 
                             searchRegex.test(customer.jobTitle || '');
        if (!matchesSearch) return false;
      }

      // Category filter
      switch (filter.category) {
        case 'my-cards':
          return customer.isRegisteredUser && !customer.isRecommendation;
        case 'unregistered':
          return !customer.isRegisteredUser;
        case 'recommendations':
          return customer.isRecommendation;
        case 'invited-by':
          return customer.relationshipStatus === 'addedMe';
        case 'invited':
          return customer.invitationSent || customer.emailInvitationSent;
        case 'following':
          return customer.isFavorite;
        case 'tags':
          return filter.selectedTags ? filter.selectedTags.some(tag => customer.tags?.includes(tag)) : false;
        case 'tag':
          return filter.tag ? customer.tags?.includes(filter.tag) : false;
        case 'all':
        default:
          return true;
      }
    });

    // Sort customers: favorites first, then by added date
    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      const dateA = new Date(a.addedDate || 0).getTime();
      const dateB = new Date(b.addedDate || 0).getTime();
      return dateB - dateA;
    });
  };

  const getCardStyle = (customer: Customer) => {
    if (customer.isRecommendation) {
      return {
        className: "border-2 border-dashed border-muted-foreground bg-card",
        badge: { text: "智能推薦", className: "bg-recommendation-green text-white" }
      };
    }
    
    if (!customer.isRegisteredUser) {
      return {
        className: "border border-muted bg-card",
        badge: { text: "未註冊", className: "bg-unregistered-orange text-white" }
      };
    }
    
    if (customer.isFavorite) {
      return {
        className: "border-2 border-favorite-blue bg-favorite-blue-bg",
        badge: null
      };
    }
    
    return {
      className: "border border-muted bg-card",
      badge: null
    };
  };

  const handleCardClick = (customer: Customer) => {
    if (customer.isRecommendation) {
      setSelectedCustomer(customer);
      setShowRecommendationDetail(true);
    } else {
      setSelectedCustomer(customer);
    }
  };

  const handleSendInvitation = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      if (customer.lineId) {
        // User has LINE ID, send LINE invitation
        const lineMessage = "邀請您註冊電子名片，體驗更便利的名片交換！";
        const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(lineMessage)}`;
        window.open(lineUrl, '_blank');
        
        // Mark as invited and update customer state
        const updatedCustomers = customers.map(c => 
          c.id === customerId ? { ...c, invitationSent: true } : c
        );
        setCustomers(updatedCustomers);
        
        toast({
          title: "LINE 邀請已發送",
          description: `已向 ${customer.name} 發送 LINE 邀請`,
          className: "max-w-[280px] mx-auto"
        });
      } else {
        // Paper card user, show invitation options dialog
        setSelectedInvitationCustomer(customer);
        setInvitationDialogOpen(true);
      }
    }
  };

  const handleToggleFavorite = (customerId: number) => {
    const updatedCustomers = customers.map(c => 
      c.id === customerId ? { ...c, isFavorite: !c.isFavorite } : c
    );
    setCustomers(updatedCustomers);
  };

  const handlePhoneCall = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer?.phone) {
      window.open(`tel:${customer.phone}`, '_blank');
    }
  };

  const handleLineContact = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer?.line || customer?.lineId) {
      const lineId = customer.line || customer.lineId;
      window.open(`https://line.me/ti/p/~${lineId}`, '_blank');
    }
  };

  const handleAddToFolder = (customerId: number) => {
    const updatedCustomers = customers.map(c => 
      c.id === customerId 
        ? { ...c, isRecommendation: false, isRegisteredUser: true, relationshipStatus: 'collected' as const }
        : c
    );
    setCustomers(updatedCustomers);
    
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      toast({
        title: "已加入名片夾",
        description: `${customer.name} 已加入您的名片夾`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  const handleSkipRecommendation = (customerId: number) => {
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    setCustomers(updatedCustomers);
    
    toast({
      title: "已略過推薦",
      description: "推薦已略過",
      className: "max-w-[280px] mx-auto"
    });
  };

  const filteredCustomers = getFilteredCustomers();

  if (selectedCustomer && showRecommendationDetail) {
    return (
      <SmartRecommendationDetail
        customer={selectedCustomer}
        onClose={() => {
          setSelectedCustomer(null);
          setShowRecommendationDetail(false);
        }}
        onAddToFolder={handleAddToFolder}
        onSkip={handleSkipRecommendation}
      />
    );
  }

  if (selectedCustomer) {
    return (
      <CustomerDetailPage 
        customer={selectedCustomer} 
        onClose={() => setSelectedCustomer(null)} 
        onToggleFavorite={(id) => {
          const updatedCustomers = customers.map(c => 
            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
          );
          setCustomers(updatedCustomers);
          setSelectedCustomer(prev => prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev);
        }}
        onAddFollower={() => {}}
        onPhoneClick={() => {}}
        onLineClick={() => {}}
        onSendInvitation={handleSendInvitation}
        onSaveCustomer={() => {}}
        onDeleteCustomer={(id) => {
          const updatedCustomers = customers.filter(c => c.id !== id);
          setCustomers(updatedCustomers);
          setSelectedCustomer(null);
        }}
        activeSection="cards"
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col h-full overflow-hidden" style={{
      maxWidth: '375px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片夾</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="search"
            placeholder="可搜尋公司、姓名、手機號、職稱"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={filter.category === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter({ category: 'all' })}
            className="whitespace-nowrap"
          >
            全部
          </Button>
          <Button
            variant={filter.category === 'my-cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter({ category: 'my-cards' })}
            className="whitespace-nowrap"
          >
            我的名片夾 ({myCardsCount})
          </Button>
          <Button
            variant={filter.category === 'unregistered' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter({ category: 'unregistered' })}
            className="whitespace-nowrap"
          >
            未註冊 ({unregisteredCount})
          </Button>
          <Button
            variant={filter.category === 'recommendations' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter({ category: 'recommendations' })}
            className="whitespace-nowrap"
          >
            智能推薦 ({recommendationsCount})
          </Button>
          
          {/* Advanced Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Filter className="w-4 h-4 mr-1" />
                更多篩選
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border border-border">
              <DropdownMenuItem 
                onClick={() => setFilter({ category: 'invited-by' })}
                className="hover:bg-accent"
              >
                被邀請 ({invitedByCount})
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilter({ category: 'invited' })}
                className="hover:bg-accent"
              >
                已邀請 ({invitedCount})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setFilter({ category: 'following' })}
                className="hover:bg-accent"
              >
                <Star className="w-4 h-4 mr-2" />
                關注
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Common Tags Section */}
      <div className="px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">常用標籤</span>
          <div className="flex items-center gap-2 overflow-x-auto flex-1">
            {(showAllTags ? commonTags : commonTags.slice(0, 3)).map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setFilter({ category: 'tag', tag })}
                className="text-xs bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800 h-6 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0"
              >
                {tag}
              </Button>
            ))}
            {!showAllTags && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllTags(true)}
                className="text-xs text-muted-foreground hover:text-foreground h-6 px-2 whitespace-nowrap flex-shrink-0"
              >
                更多
              </Button>
            )}
            {showAllTags && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllTags(false)}
                className="text-xs text-muted-foreground hover:text-foreground h-6 px-2 whitespace-nowrap flex-shrink-0"
              >
                收起
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredCustomers.map((customer) => {
            const cardStyle = getCardStyle(customer);
            
            return (
              <Card 
                key={customer.id} 
                className={`${cardStyle.className} cursor-pointer transition-all hover:shadow-md`}
                onClick={() => handleCardClick(customer)}
              >
                <CardContent className="p-4">
                  <div className={`flex items-start ${(customer.isRegisteredUser || customer.lineId) ? 'space-x-3' : 'space-x-0'}`}>
                    {/* Only show avatar for registered users and unregistered LINE users */}
                    {(customer.isRegisteredUser || customer.lineId) && (
                      <div className="relative">
                        <img
                          src={customer.photo || getRandomProfessionalAvatar(customer.id)}
                          alt={customer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              {customer.isRegisteredUser ? (
                                <>
                                  <h3 className="font-medium text-card-foreground truncate">{customer.name}</h3>
                                  {customer.jobTitle && (
                                    <p className="text-sm text-muted-foreground truncate">{customer.jobTitle}</p>
                                  )}
                                  {customer.company && (
                                    <p className="text-sm text-muted-foreground truncate">{customer.company}</p>
                                  )}
                                </>
                              ) : customer.lineId ? (
                                <>
                                  <h3 className="font-medium text-card-foreground truncate">{customer.name}</h3>
                                  <p className="text-sm text-muted-foreground truncate">LINE 用戶</p>
                                </>
                              ) : (
                                <>
                                  {customer.company && (
                                    <p className="text-sm text-muted-foreground truncate">{customer.company}</p>
                                  )}
                                  {customer.jobTitle && (
                                    <p className="text-sm text-muted-foreground truncate">{customer.jobTitle}</p>
                                  )}
                                  <h3 className="font-medium text-card-foreground truncate">{customer.name}</h3>
                                </>
                              )}
                            </div>
                        
                        <div className="flex flex-col items-end space-y-2 ml-2">
                          {cardStyle.badge && (
                            <Badge className={cardStyle.badge.className} variant="secondary">
                              {cardStyle.badge.text}
                            </Badge>
                          )}
                          
                          {/* Follow star for all cards except smart recommendations */}
                          {!customer.isRecommendation && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(customer.id);
                                }}
                              >
                                <Star className={`w-4 h-4 ${customer.isFavorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                              </Button>
                              
                              {/* Action buttons for registered users */}
                              {customer.isRegisteredUser && (
                                <>
                                  {customer.line && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLineContact(customer.id);
                                      }}
                                    >
                                      <MessageCircle className="w-4 h-4 text-green-600" />
                                    </Button>
                                  )}
                                  {customer.phone && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePhoneCall(customer.id);
                                      }}
                                    >
                                      <Phone className="w-4 h-4 text-blue-600" />
                                    </Button>
                                  )}
                                </>
                              )}
                              
                              {/* Action buttons for unregistered LINE users */}
                              {!customer.isRegisteredUser && customer.lineId && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSendInvitation(customer.id);
                                  }}
                                >
                                  {customer.invitationSent ? 
                                    <Bell className="w-4 h-4 text-green-600" /> : 
                                    <Circle className="w-4 h-4 text-muted-foreground" />
                                  }
                                </Button>
                              )}
                              
                              {/* Action buttons for paper card users */}
                              {!customer.isRegisteredUser && !customer.lineId && (
                                <>
                                  {customer.phone && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePhoneCall(customer.id);
                                      }}
                                    >
                                      <Phone className="w-4 h-4 text-blue-600" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    {customer.invitationSent || customer.emailInvitationSent ? 
                                      <Bell className="w-4 h-4 text-green-600" /> : 
                                      <Circle className="w-4 h-4 text-muted-foreground" />
                                    }
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                          
                          {/* Smart recommendation buttons */}
                          {customer.isRecommendation && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="default"
                                className="h-6 px-2 text-xs bg-recommendation-green hover:bg-recommendation-green/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToFolder(customer.id);
                                }}
                              >
                                加入名片夾
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSkipRecommendation(customer.id);
                                }}
                              >
                                略過
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">沒有找到符合條件的聯絡人</p>
            </div>
          )}
        </div>
      </div>

      {/* Invitation Dialog */}
      <InvitationDialog
        isOpen={invitationDialogOpen}
        onClose={() => {
          setInvitationDialogOpen(false);
          setSelectedInvitationCustomer(null);
        }}
        customerName={selectedInvitationCustomer?.name || ''}
        onInvitationSent={() => {
          if (selectedInvitationCustomer) {
            const updatedCustomers = customers.map(c => 
              c.id === selectedInvitationCustomer.id ? { ...c, invitationSent: true } : c
            );
            setCustomers(updatedCustomers);
          }
        }}
      />
    </div>
  );
};

export default UnifiedCardFolder;