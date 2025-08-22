import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, CheckCircle, XCircle, User, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Customer } from './MyCustomers/types';
import { getRandomProfessionalAvatar } from './MyCustomers/utils';

interface InvitationHistoryLIFFProps {
  onClose: () => void;
}

const InvitationHistoryLIFF: React.FC<InvitationHistoryLIFFProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState<Customer[]>([]);
  const [declinedInvitations, setDeclinedInvitations] = useState<Customer[]>([]);

  // Initialize mock data
  useEffect(() => {
    // Mock pending invitations
    const mockPendingInvitations = Array.from({ length: 3 }, (_, i) => ({
      id: 5000 + i,
      name: ['李小華', '王建國', '陳美玲'][i],
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `invitation${i}@example.com`,
      company: ['新創公司', '設計工作室', '科技公司'][i],
      jobTitle: ['產品經理', '設計師', '工程師'][i],
      photo: getRandomProfessionalAvatar(5000 + i),
      hasCard: true,
      addedDate: new Date(Date.now() - i * 86400000).toISOString(), // Different days
      notes: '邀請加入名片夾',
      tags: [],
      relationshipStatus: 'invited' as const,
      isDigitalCard: true,
      isRegisteredUser: true,
      isPendingInvitation: true
    }));

    // Mock declined invitations
    const mockDeclinedInvitations = Array.from({ length: 2 }, (_, i) => ({
      id: 6000 + i,
      name: ['張志偉', '劉雅芳'][i],
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `declined${i}@example.com`,
      company: ['顧問公司', '媒體公司'][i],
      jobTitle: ['顧問', '編輯'][i],
      photo: getRandomProfessionalAvatar(6000 + i),
      hasCard: true,
      addedDate: new Date(Date.now() - (i + 5) * 86400000).toISOString(),
      notes: '邀請已略過',
      tags: [],
      relationshipStatus: 'ignored' as const,
      isDigitalCard: true,
      isRegisteredUser: true,
      isDeclined: true
    }));

    setPendingInvitations(mockPendingInvitations);
    setDeclinedInvitations(mockDeclinedInvitations);
  }, []);

  // Handle accepting invitation
  const handleAcceptInvitation = (customerId: number) => {
    const invitation = pendingInvitations.find(inv => inv.id === customerId);
    if (invitation) {
      setPendingInvitations(prev => prev.filter(inv => inv.id !== customerId));
      
      toast({
        title: "已接受邀請",
        description: `${invitation.name} 已加入您的名片夾`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Handle declining invitation
  const handleDeclineInvitation = (customerId: number) => {
    const invitation = pendingInvitations.find(inv => inv.id === customerId);
    if (invitation) {
      const declinedInvitation = { ...invitation, isDeclined: true, relationshipStatus: 'ignored' as const };
      setDeclinedInvitations(prev => [...prev, declinedInvitation]);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== customerId));
      
      toast({
        title: "已略過邀請",
        description: `已略過 ${invitation.name} 的邀請`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Handle restoring declined invitation
  const handleRestoreInvitation = (customerId: number) => {
    const declined = declinedInvitations.find(inv => inv.id === customerId);
    if (declined) {
      const restoredInvitation = { ...declined, isDeclined: false, isPendingInvitation: true, relationshipStatus: 'invited' as const };
      setPendingInvitations(prev => [...prev, restoredInvitation]);
      setDeclinedInvitations(prev => prev.filter(inv => inv.id !== customerId));
      
      toast({
        title: "邀請已恢復",
        description: `${declined.name} 的邀請已恢復到待處理`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Handle permanently deleting declined invitation
  const handleDeleteInvitation = (customerId: number) => {
    const declined = declinedInvitations.find(inv => inv.id === customerId);
    if (declined) {
      setDeclinedInvitations(prev => prev.filter(inv => inv.id !== customerId));
      
      toast({
        title: "邀請已刪除",
        description: `${declined.name} 的邀請紀錄已永久刪除`,
        className: "max-w-[280px] mx-auto"
      });
    }
  };

  // Filter invitations based on search
  const filteredPendingInvitations = pendingInvitations.filter(invitation => {
    if (!searchQuery) return true;
    const searchRegex = new RegExp(searchQuery, 'i');
    return searchRegex.test(invitation.name) || 
           searchRegex.test(invitation.company || '') || 
           searchRegex.test(invitation.jobTitle || '');
  });

  const filteredDeclinedInvitations = declinedInvitations.filter(invitation => {
    if (!searchQuery) return true;
    const searchRegex = new RegExp(searchQuery, 'i');
    return searchRegex.test(invitation.name) || 
           searchRegex.test(invitation.company || '') || 
           searchRegex.test(invitation.jobTitle || '');
  });

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
        <h2 className="font-semibold text-lg">被邀請紀錄</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <Input
          type="search"
          placeholder="搜尋邀請紀錄..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-full"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Pending Invitations Section */}
        {filteredPendingInvitations.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-orange-500" />
              <h3 className="font-medium text-foreground">待處理邀請 ({filteredPendingInvitations.length})</h3>
            </div>
            <div className="space-y-3">
              {filteredPendingInvitations.map((invitation) => (
                <Card key={invitation.id} className="border-2 border-orange-300 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={invitation.photo || getRandomProfessionalAvatar(invitation.id)}
                        alt={invitation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-card-foreground truncate">{invitation.name}</h4>
                            {invitation.jobTitle && (
                              <p className="text-sm text-muted-foreground truncate">{invitation.jobTitle}</p>
                            )}
                            {invitation.company && (
                              <p className="text-sm text-muted-foreground truncate">{invitation.company}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(invitation.addedDate).toLocaleDateString('zh-TW')} 邀請加入
                            </p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="h-8 px-3 text-xs bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleAcceptInvitation(invitation.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              接受
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs"
                              onClick={() => handleDeclineInvitation(invitation.id)}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              略過
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Declined Invitations Section */}
        {filteredDeclinedInvitations.length > 0 && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-gray-500" />
              <h3 className="font-medium text-foreground">已略過邀請 ({filteredDeclinedInvitations.length})</h3>
            </div>
            <div className="space-y-3">
              {filteredDeclinedInvitations.map((invitation) => (
                <Card key={invitation.id} className="border border-gray-300 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={invitation.photo || getRandomProfessionalAvatar(invitation.id)}
                        alt={invitation.name}
                        className="w-12 h-12 rounded-full object-cover opacity-60"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-muted-foreground truncate">{invitation.name}</h4>
                            {invitation.jobTitle && (
                              <p className="text-sm text-muted-foreground truncate">{invitation.jobTitle}</p>
                            )}
                            {invitation.company && (
                              <p className="text-sm text-muted-foreground truncate">{invitation.company}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-gray-500 text-white text-xs">已略過</Badge>
                              <p className="text-xs text-muted-foreground">
                                {new Date(invitation.addedDate).toLocaleDateString('zh-TW')}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleRestoreInvitation(invitation.id)}
                            >
                              恢復
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteInvitation(invitation.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPendingInvitations.length === 0 && filteredDeclinedInvitations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <User className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">沒有邀請紀錄</h3>
            <p className="text-muted-foreground text-center">
              {searchQuery ? '沒有找到符合搜尋條件的邀請紀錄' : '目前沒有任何被邀請的紀錄'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationHistoryLIFF;