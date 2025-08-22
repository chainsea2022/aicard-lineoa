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
import AppDownloadLIFF from './AppDownloadLIFF';

interface UnifiedCardFolderProps {
  onClose: () => void;
}

interface FilterState {
  category: 'all' | 'none' | 'my-cards' | 'unregistered' | 'recommendations' | 'invited-by' | 'invited' | 'following' | 'tags' | 'tag';
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
  const [pendingInvitations, setPendingInvitations] = useState<Customer[]>([]);
  const [newAutoAddedCards, setNewAutoAddedCards] = useState<Set<number>>(new Set());
  const [autoAddSettings, setAutoAddSettings] = useState(true); // Privacy setting for auto-add
  const [showAppDownload, setShowAppDownload] = useState(false);
  const [declinedInvitations, setDeclinedInvitations] = useState<Customer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const mockData = generateMockCustomers();
    const recommendations = generateMockRecommendations(4);
    
    // Add some mock pending invitations
    const mockInvitations = Array.from({ length: 2 }, (_, i) => ({
      id: 3000 + i,
      name: ['李小華', '王建國'][i],
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `invitation${i}@example.com`,
      company: ['新創公司', '設計工作室'][i],
      jobTitle: ['產品經理', '設計師'][i],
      photo: getRandomProfessionalAvatar(3000 + i),
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '邀請加入',
      tags: [],
      relationshipStatus: 'invited' as const,
      isDigitalCard: true,
      isRegisteredUser: true,
      isPendingInvitation: true
    }));
    
    // Add mock unregistered LINE users who have been invited as friends
    const mockLineInvitedUsers = Array.from({ length: 3 }, (_, i) => ({
      id: 4000 + i,
      name: ['林小明', '陳雅雯', '黃志強'][i],
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `line${i}@example.com`,
      company: ['科技公司', '設計公司', '貿易公司'][i],
      jobTitle: ['工程師', '設計師', '業務'][i],
      photo: getRandomProfessionalAvatar(4000 + i),
      hasCard: false,
      addedDate: new Date().toISOString(),
      notes: 'LINE 用戶未註冊',
      tags: [],
      relationshipStatus: 'invited' as const,
      isDigitalCard: false,
      isRegisteredUser: false,
      lineId: `line${4000 + i}`,
      invitationSent: true
    }));
    
    return [...mockData, ...recommendations, ...mockLineInvitedUsers];
  });

  // Common tags data
  const commonTags = ['同事', '客戶', '朋友', '供應商', '合作夥伴', '主管', '下屬', '同學', '家人', '醫生'];

  // Calculate counts for filters
  const myCardsCount = customers.filter(c => c.isRegisteredUser && !c.isRecommendation && !c.isPendingInvitation).length;
  const unregisteredCount = customers.filter(c => !c.isRegisteredUser).length;
  const recommendationsCount = customers.filter(c => c.isRecommendation).length;
  const invitedByCount = customers.filter(c => c.relationshipStatus === 'addedMe' || c.isPendingInvitation).length;
  const invitedCount = customers.filter(c => c.invitationSent || c.emailInvitationSent).length;
  const pendingInvitationsCount = pendingInvitations.length;
  // Count unregistered LINE users who have been invited as friends
  const invitedLineUsersCount = customers.filter(c => !c.isRegisteredUser && c.lineId && c.invitationSent).length;

  // Initialize mock pending invitations
  useEffect(() => {
    const mockInvitations = Array.from({ length: 2 }, (_, i) => ({
      id: 3000 + i,
      name: ['李小華', '王建國'][i],
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `invitation${i}@example.com`,
      company: ['新創公司', '設計工作室'][i],
      jobTitle: ['產品經理', '設計師'][i],
      photo: getRandomProfessionalAvatar(3000 + i),
      hasCard: true,
      addedDate: new Date().toISOString(),
      notes: '邀請加入',
      tags: [],
      relationshipStatus: 'invited' as const,
      isDigitalCard: true,
      isRegisteredUser: true,
      isPendingInvitation: true
    }));
    setPendingInvitations(mockInvitations);
  }, []);

  // Handle invitation acceptance
  const handleAcceptInvitation = (customerId: number) => {
    const invitation = pendingInvitations.find(inv => inv.id === customerId);
    if (invitation) {
      if (autoAddSettings) {
        // Auto-add to card folder
        const newCustomer = { 
          ...invitation, 
          isPendingInvitation: false, 
          relationshipStatus: 'collected' as const 
        };
        setCustomers(prev => [...prev, newCustomer]);
        setNewAutoAddedCards(prev => new Set([...prev, customerId]));
        
        toast({
          title: "自動加入名片夾",
          description: `${invitation.name} 已自動加入您的名片夾`,
          className: "max-w-[280px] mx-auto"
        });
      } else {
        // Manual approval - add invitation to customers list for manual handling
        const newCustomer = { 
          ...invitation, 
          isPendingInvitation: false,
          needsManualApproval: true,
          relationshipStatus: 'invited' as const 
        };
        setCustomers(prev => [...prev, newCustomer]);
        
        toast({
          title: "收到邀請",
          description: `${invitation.name} 想要加入您的名片夾`,
          className: "max-w-[280px] mx-auto"
        });
      }
      
      // Remove from pending invitations
      setPendingInvitations(prev => prev.filter(inv => inv.id !== customerId));
    }
  };

  // Handle declining invitation
  const handleDeclineInvitation = (customerId: number) => {
    const invitation = pendingInvitations.find(inv => inv.id === customerId);
    if (invitation) {
      setDeclinedInvitations(prev => [...prev, invitation]);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== customerId));
      
      toast({
        title: "已略過邀請",
        description: `已略過 ${invitation.name} 的邀請`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Handle manual approval from customer card
  const handleManualApproval = (customerId: number, approved: boolean) => {
    if (approved) {
      const updatedCustomers = customers.map(c => 
        c.id === customerId 
          ? { ...c, needsManualApproval: false, relationshipStatus: 'collected' as const }
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
    } else {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setDeclinedInvitations(prev => [...prev, customer]);
      }
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      
      toast({
        title: "已略過邀請",
        description: "邀請已略過",
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Clear NEW badges when viewing card folder
  const handleFilterChange = (newFilter: FilterState) => {
    setFilter(newFilter);
    if (newFilter.category === 'my-cards' || newFilter.category === 'invited-by') {
      // Clear NEW badges when user views these sections
      setNewAutoAddedCards(new Set());
    }
  };

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
          return (customer.isRegisteredUser && !customer.isRecommendation && !customer.isPendingInvitation) || 
                 customer.needsManualApproval || customer.isPendingInvitation;
        case 'unregistered':
          return !customer.isRegisteredUser;
        case 'recommendations':
          return customer.isRecommendation;
        case 'invited-by':
          return customer.relationshipStatus === 'addedMe' || customer.isPendingInvitation || customer.needsManualApproval;
        case 'invited':
          return customer.invitationSent || customer.emailInvitationSent;
        case 'following':
          return customer.isFavorite;
        case 'tags':
          return filter.selectedTags ? filter.selectedTags.some(tag => customer.tags?.includes(tag)) : false;
        case 'tag':
          return filter.tag ? customer.tags?.includes(filter.tag) : false;
        case 'none':
          return true; // Show all when deselected
        case 'all':
        default:
          return true;
      }
    });

    // Include pending invitations in the filtered results for appropriate categories
    if (filter.category === 'invited-by' || filter.category === 'all' || filter.category === 'my-cards') {
      filtered = [...filtered, ...pendingInvitations];
    }

    // Sort customers: NEW cards first, then favorites, then by added date
    return filtered.sort((a, b) => {
      // NEW auto-added cards come first
      const aIsNew = newAutoAddedCards.has(a.id);
      const bIsNew = newAutoAddedCards.has(b.id);
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      
      // Then favorites
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      
      // Then by added date
      const dateA = new Date(a.addedDate || 0).getTime();
      const dateB = new Date(b.addedDate || 0).getTime();
      return dateB - dateA;
    });
  };

  const getCardStyle = (customer: Customer) => {
    if (customer.isPendingInvitation) {
      return {
        className: "border-2 border-purple-300 bg-purple-50",
        badge: { text: "被邀請", className: "bg-purple-500 text-white" }
      };
    }
    
    if (customer.needsManualApproval) {
      return {
        className: "border-2 border-blue-300 bg-blue-50",
        badge: { text: "被邀請", className: "bg-blue-500 text-white" }
      };
    }
    
    if (newAutoAddedCards.has(customer.id)) {
      return {
        className: "border-2 border-pink-300 bg-pink-50",
        badge: { text: "NEW", className: "bg-pink-500 text-white" }
      };
    }
    
    if (customer.isRecommendation) {
      return {
        className: "border-2 border-dashed border-muted-foreground bg-card",
        badge: { text: "智能推薦", className: "bg-recommendation-green text-white" }
      };
    }
    
    // Invited LINE users who are unregistered - special styling with both badges
    if (!customer.isRegisteredUser && customer.lineId && customer.invitationSent) {
      return {
        className: "border-2 border-orange-300 bg-orange-50",
        badge: { text: "被邀請", className: "bg-orange-500 text-white" }
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
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    if (customer.isRecommendation) {
      // Smart recommendation - add to registered users
      const updatedCustomers = customers.map(c => 
        c.id === customerId 
          ? { ...c, isRecommendation: false, isRegisteredUser: true, relationshipStatus: 'collected' as const }
          : c
      );
      setCustomers(updatedCustomers);
      
      toast({
        title: "已加入名片夾",
        description: `${customer.name} 已加入您的名片夾`,
        className: "max-w-[280px] mx-auto"
      });
    } else if (!customer.isRegisteredUser && customer.lineId) {
      // LINE OA contact - check if they should be registered or stay as contact
      const updatedCustomers = customers.map(c => 
        c.id === customerId 
          ? { 
              ...c, 
              isRegisteredUser: false, // Keep as unregistered (contact folder)
              relationshipStatus: 'collected' as const,
              invitationSent: true
            }
          : c
      );
      setCustomers(updatedCustomers);
      
      toast({
        title: "已加入聯絡人名片夾",
        description: `${customer.name} 已加入聯絡人名片夾`,
        className: "max-w-[280px] mx-auto"
      });
    } else {
      // Other cases - add to appropriate folder based on registration status
      const updatedCustomers = customers.map(c => 
        c.id === customerId 
          ? { ...c, relationshipStatus: 'collected' as const }
          : c
      );
      setCustomers(updatedCustomers);
      
      const folderType = customer.isRegisteredUser ? "電子名片夾" : "聯絡人名片夾";
      
      toast({
        title: "已加入名片夾",
        description: `${customer.name} 已加入${folderType}`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Handle ignoring invitation from LINE OA contacts
  const handleIgnoreInvitation = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      // Add to declined invitations history
      setDeclinedInvitations(prev => [...prev, customer]);
      
      // Remove from current customers list
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      
      toast({
        title: "已忽略邀請",
        description: `已忽略 ${customer.name} 的邀請，可在邀請歷史中查看`,
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

  // Show app download LIFF if requested
  if (showAppDownload) {
    return (
      <AppDownloadLIFF
        onClose={() => setShowAppDownload(false)}
      />
    );
  }

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
      <div className="px-4 py-3 border-b border-border bg-muted/30 overflow-visible">
        <div className="flex items-center justify-between overflow-visible">
          <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide py-2 pr-2">
            <Button
              variant={filter.category === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter({ category: filter.category === 'all' ? 'none' : 'all' })}
              className="whitespace-nowrap"
            >
              全部
            </Button>
            <Button
              variant={filter.category === 'my-cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ category: 'my-cards' })}
              className="whitespace-nowrap relative overflow-visible"
            >
              電子名片 ({myCardsCount})
              {(newAutoAddedCards.size > 0 || pendingInvitationsCount > 0) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {newAutoAddedCards.size + pendingInvitationsCount}
                </span>
              )}
            </Button>
            <Button
              variant={filter.category === 'unregistered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter({ category: 'unregistered' })}
              className="whitespace-nowrap relative overflow-visible"
            >
              聯絡人 ({unregisteredCount})
              {invitedLineUsersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {invitedLineUsersCount}
                </span>
              )}
            </Button>
            <Button
              variant={filter.category === 'recommendations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter({ category: 'recommendations' })}
              className="whitespace-nowrap"
            >
              智能推薦 ({recommendationsCount})
            </Button>
          </div>
          
          {/* Filter Dropdown */}
          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <Filter className="w-4 h-4 mr-1" />
                  篩選
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
                <DropdownMenuItem 
                  onClick={() => handleFilterChange({ category: 'invited-by' })}
                  className={filter.category === 'invited-by' ? 'bg-accent text-accent-foreground' : ''}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>被邀請 ({invitedByCount})</span>
                    {pendingInvitationsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingInvitationsCount}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter({ category: 'invited' })}
                  className={filter.category === 'invited' ? 'bg-accent text-accent-foreground' : ''}
                >
                  已邀請 ({invitedCount})
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilter({ category: 'following' })}
                  className={filter.category === 'following' ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Star className="w-4 h-4 mr-2" />
                  關注
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                onClick={() => setShowAppDownload(true)}
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
                          
                          {/* Pending invitation buttons */}
                          {customer.isPendingInvitation && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="default"
                                className="h-6 px-2 text-xs bg-purple-500 hover:bg-purple-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptInvitation(customer.id);
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
                                  handleDeclineInvitation(customer.id);
                                }}
                              >
                                略過
                              </Button>
                            </div>
                          )}
                          
                           {/* Manual approval buttons */}
                           {customer.needsManualApproval && (
                             <div className="flex space-x-1">
                               <Button
                                 size="sm"
                                 variant="default"
                                 className="h-6 px-2 text-xs bg-blue-500 hover:bg-blue-600 text-white"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleManualApproval(customer.id, true);
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
                                   handleManualApproval(customer.id, false);
                                 }}
                               >
                                 略過
                               </Button>
                             </div>
                           )}
                           
                           {/* LINE OA contacts with invitation - show all buttons */}
                           {!customer.isRegisteredUser && customer.lineId && customer.invitationSent && (
                             <div className="flex flex-wrap gap-1">
                               <Button
                                 size="sm"
                                 variant="default"
                                 className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600 text-white"
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
                                 className="h-6 px-1 text-xs bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleIgnoreInvitation(customer.id);
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