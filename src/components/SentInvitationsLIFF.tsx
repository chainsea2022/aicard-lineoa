import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Search, Filter, CheckCircle, Clock, UserPlus, Phone, MessageCircle, Mail, Send, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Customer } from './MyCustomers/types';
import { getRandomProfessionalAvatar } from './MyCustomers/utils';

interface SentInvitationsLIFFProps {
  onClose: () => void;
}

type InvitationStatus = 'pending_registration' | 'pending_approval' | 'completed';

interface SentInvitation extends Customer {
  invitationStatus: InvitationStatus;
  sentDate: string;
  responseDate?: string;
  invitationType: 'line' | 'email' | 'sms';
}

const SentInvitationsLIFF: React.FC<SentInvitationsLIFFProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | InvitationStatus>('all');
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>([]);

  // Initialize mock sent invitations data
  useEffect(() => {
    const mockSentInvitations: SentInvitation[] = [
      // 1. 已發送給未註冊的聯絡人註冊電子名片
      {
        id: 5001,
        name: '張小明',
        phone: '0912345678',
        email: 'zhang@example.com',
        company: '科技公司',
        jobTitle: '工程師',
        photo: getRandomProfessionalAvatar(5001),
        hasCard: false,
        addedDate: new Date().toISOString(),
        notes: '已邀請註冊',
        tags: [],
        relationshipStatus: 'invited',
        isDigitalCard: false,
        isRegisteredUser: false,
        invitationStatus: 'pending_registration',
        sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        invitationType: 'line'
      },
      {
        id: 5002,
        name: '李美華',
        phone: '0987654321',
        email: 'li@example.com',
        company: '設計工作室',
        jobTitle: '設計師',
        photo: getRandomProfessionalAvatar(5002),
        hasCard: false,
        addedDate: new Date().toISOString(),
        notes: '已邀請註冊',
        tags: [],
        relationshipStatus: 'invited',
        isDigitalCard: false,
        isRegisteredUser: false,
        invitationStatus: 'pending_registration',
        sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        invitationType: 'email'
      },
      // 2. 已發送已註冊電子名片的聯絡人，等待對方同意
      {
        id: 5003,
        name: '王志強',
        phone: '0911222333',
        email: 'wang@example.com',
        company: '貿易公司',
        jobTitle: '業務經理',
        photo: getRandomProfessionalAvatar(5003),
        hasCard: true,
        addedDate: new Date().toISOString(),
        notes: '等待同意',
        tags: [],
        relationshipStatus: 'invited',
        isDigitalCard: true,
        isRegisteredUser: true,
        invitationStatus: 'pending_approval',
        sentDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        invitationType: 'line'
      },
      {
        id: 5004,
        name: '陳雅婷',
        phone: '0933444555',
        email: 'chen@example.com',
        company: '顧問公司',
        jobTitle: '顧問',
        photo: getRandomProfessionalAvatar(5004),
        hasCard: true,
        addedDate: new Date().toISOString(),
        notes: '等待同意',
        tags: [],
        relationshipStatus: 'invited',
        isDigitalCard: true,
        isRegisteredUser: true,
        invitationStatus: 'pending_approval',
        sentDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        invitationType: 'email'
      },
      // 3. 對方已註冊電子名片後會移入電子名片夾中
      {
        id: 5005,
        name: '林俊傑',
        phone: '0955666777',
        email: 'lin@example.com',
        company: '媒體公司',
        jobTitle: '編輯',
        photo: getRandomProfessionalAvatar(5005),
        hasCard: true,
        addedDate: new Date().toISOString(),
        notes: '已加入名片夾',
        tags: [],
        relationshipStatus: 'collected',
        isDigitalCard: true,
        isRegisteredUser: true,
        invitationStatus: 'completed',
        sentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        responseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        invitationType: 'line'
      }
    ];
    
    setSentInvitations(mockSentInvitations);
  }, []);

  const getFilteredInvitations = () => {
    return sentInvitations.filter(invitation => {
      // Search filter
      if (searchQuery) {
        const searchRegex = new RegExp(searchQuery, 'i');
        const matchesSearch = searchRegex.test(invitation.name) || 
                             searchRegex.test(invitation.company || '') || 
                             searchRegex.test(invitation.phone || '') || 
                             searchRegex.test(invitation.jobTitle || '');
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filter !== 'all') {
        return invitation.invitationStatus === filter;
      }

      return true;
    }).sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case 'pending_registration':
        return { text: '邀請註冊中', className: 'bg-orange-500 text-white' };
      case 'pending_approval':
        return { text: '等待同意', className: 'bg-blue-500 text-white' };
      case 'completed':
        return { text: '已加入名片夾', className: 'bg-green-500 text-white' };
    }
  };

  const getInvitationTypeIcon = (type: 'line' | 'email' | 'sms') => {
    switch (type) {
      case 'line':
        return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms':
        return <Phone className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleResendInvitation = (invitationId: number) => {
    const invitation = sentInvitations.find(inv => inv.id === invitationId);
    if (invitation) {
      toast({
        title: "邀請已重新發送",
        description: `已向 ${invitation.name} 重新發送邀請`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} 小時前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} 天前`;
    }
  };

  const filteredInvitations = getFilteredInvitations();

  // Count by status
  const pendingRegistrationCount = sentInvitations.filter(inv => inv.invitationStatus === 'pending_registration').length;
  const pendingApprovalCount = sentInvitations.filter(inv => inv.invitationStatus === 'pending_approval').length;
  const completedCount = sentInvitations.filter(inv => inv.invitationStatus === 'completed').length;

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
        <h2 className="font-semibold text-lg">已邀請記錄</h2>
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
            placeholder="搜尋已邀請的聯絡人"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="whitespace-nowrap text-sm px-3 h-8"
          >
            全部 ({sentInvitations.length})
          </Button>
          <Button
            variant={filter === 'pending_registration' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending_registration')}
            className="whitespace-nowrap text-sm px-3 h-8"
          >
            邀請註冊中 ({pendingRegistrationCount})
          </Button>
          <Button
            variant={filter === 'pending_approval' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending_approval')}
            className="whitespace-nowrap text-sm px-3 h-8"
          >
            等待同意 ({pendingApprovalCount})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="whitespace-nowrap text-sm px-3 h-8"
          >
            已完成 ({completedCount})
          </Button>
        </div>
      </div>

      {/* Invitations List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredInvitations.map((invitation) => {
            const statusBadge = getStatusBadge(invitation.invitationStatus);
            
            return (
              <Card key={invitation.id} className="border border-muted bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={invitation.photo || getRandomProfessionalAvatar(invitation.id)}
                        alt={invitation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-card-foreground truncate">{invitation.name}</h3>
                          {invitation.jobTitle && (
                            <p className="text-sm text-muted-foreground truncate">{invitation.jobTitle}</p>
                          )}
                          {invitation.company && (
                            <p className="text-sm text-muted-foreground truncate">{invitation.company}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {getInvitationTypeIcon(invitation.invitationType)}
                            <span className="text-xs text-muted-foreground">
                              發送於 {formatDate(invitation.sentDate)}
                            </span>
                          </div>
                          {invitation.responseDate && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-muted-foreground">
                                回應於 {formatDate(invitation.responseDate)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2 ml-2">
                          <Badge className={statusBadge.className} variant="secondary">
                            {statusBadge.text}
                          </Badge>
                          
                          {/* Action buttons based on status */}
                          {(invitation.invitationStatus === 'pending_registration' || 
                            invitation.invitationStatus === 'pending_approval') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleResendInvitation(invitation.id)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              重新發送
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredInvitations.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">沒有找到符合條件的邀請記錄</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentInvitationsLIFF;