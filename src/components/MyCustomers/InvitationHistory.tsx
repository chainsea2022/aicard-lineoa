import React from 'react';
import { X, Mail, Smartphone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Customer } from './types';

interface InvitationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  invitationHistory: {[key: number]: Array<{type: 'sms' | 'email', date: string, status: 'sent' | 'joined'}>};
}

export const InvitationHistory: React.FC<InvitationHistoryProps> = ({
  isOpen,
  onClose,
  customers,
  invitationHistory
}) => {
  const getCustomersWithHistory = () => {
    return customers.filter(customer => {
      const hasInvitations = customer.invitationSent || customer.emailInvitationSent;
      const hasHistory = invitationHistory[customer.id] && invitationHistory[customer.id].length > 0;
      return hasInvitations || hasHistory;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const customersWithHistory = getCustomersWithHistory();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg font-semibold">邀請發送紀錄</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {customersWithHistory.length > 0 ? (
            customersWithHistory.map(customer => (
              <div key={customer.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{customer.name}</h4>
                    <p className="text-xs text-gray-500 truncate">
                      {customer.company && customer.jobTitle 
                        ? `${customer.company} · ${customer.jobTitle}` 
                        : customer.company || customer.jobTitle || '無公司資訊'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {/* Current invitation status */}
                  <div className="flex flex-wrap gap-2">
                    {customer.invitationSent && (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        簡訊已發送
                        {customer.invitationDate && (
                          <span className="text-gray-500">
                            · {formatDate(customer.invitationDate)}
                          </span>
                        )}
                      </Badge>
                    )}
                    {customer.emailInvitationSent && (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email已發送
                        {customer.emailInvitationDate && (
                          <span className="text-gray-500">
                            · {formatDate(customer.emailInvitationDate)}
                          </span>
                        )}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Historical records */}
                  {invitationHistory[customer.id] && invitationHistory[customer.id].length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-1">歷史紀錄:</p>
                      <div className="space-y-1">
                        {invitationHistory[customer.id].map((record, index) => (
                          <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                            <div className="flex items-center gap-2">
                              {record.type === 'sms' ? (
                                <Smartphone className="w-3 h-3 text-blue-600" />
                              ) : (
                                <Mail className="w-3 h-3 text-green-600" />
                              )}
                              <span>{record.type === 'sms' ? '簡訊' : 'Email'}</span>
                              <Badge 
                                variant={record.status === 'joined' ? 'default' : 'secondary'} 
                                className="text-xs px-1 py-0"
                              >
                                {record.status === 'sent' ? '已發送' : '已加入'}
                              </Badge>
                            </div>
                            <span className="text-gray-500">{formatDate(record.date)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">尚無邀請發送紀錄</p>
              <p className="text-gray-400 text-xs mt-1">發送邀請後會在此顯示記錄</p>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 pt-3">
          <Button onClick={onClose} className="w-full">
            關閉
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};