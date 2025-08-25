import React from 'react';
import { ArrowLeft, X, MessageSquare, Send, Instagram, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpandedCard } from './ExpandedCard';
import { Customer } from './types';

interface CustomerDetailPageProps {
  customer: Customer;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  onAddFollower: (id: number) => void;
  onPhoneClick: (phone: string) => void;
  onLineClick: (lineId: string) => void;
  onSendInvitation: (id: number, type: 'sms' | 'email') => void;
  onSaveCustomer: (customerId: number, updates: Partial<Customer>) => void;
  onDeleteCustomer: (id: number) => void;
  activeSection: 'cards' | 'contacts';
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer,
  onClose,
  onToggleFavorite,
  onAddFollower,
  onPhoneClick,
  onLineClick,
  onSendInvitation,
  onSaveCustomer,
  onDeleteCustomer,
  activeSection
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LIFF style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">名片詳情</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Invitation Section */}
        {!customer.isRegisteredUser && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 space-y-3 bg-white mb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-800">邀請聯絡人</h4>
              <Badge className="bg-orange-500 text-white text-xs">
                未註冊
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600">
              透過以下方式邀請 {customer.name} 註冊電子名片
            </p>
            
            {/* Invitation Action Buttons - Row Layout (excluding SMS and Email) */}
            <div className="flex justify-center space-x-4">
              {/* LINE */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                  onClick={() => console.log('LINE invitation')}
                >
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </Button>
              </div>
              
              {/* Messenger */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                  onClick={() => console.log('Messenger invitation')}
                >
                  <Send className="w-8 h-8 text-blue-500" />
                </Button>
              </div>
              
              {/* Instagram */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                  onClick={() => console.log('Instagram invitation')}
                >
                  <Instagram className="w-8 h-8 text-pink-600" />
                </Button>
              </div>
              
              {/* Copy Link */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-12 h-12 p-0 flex items-center justify-center hover:bg-white rounded-full"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://example.com/invite?id=${customer.id}`);
                    console.log('Link copied');
                  }}
                >
                  <Copy className="w-8 h-8 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <ExpandedCard
          customer={customer}
          activeSection={activeSection}
          onToggleFavorite={onToggleFavorite}
          onAddFollower={onAddFollower}
          onIgnoreFollower={() => {}}
          onPhoneClick={onPhoneClick}
          onLineClick={onLineClick}
          onSendInvitation={onSendInvitation}
          onAddTag={(id, tag) => {
            console.log('onAddTag callback called', { id, tag, currentTags: customer.tags });
            
            // Check if tag already exists to prevent duplicates
            if (customer.tags?.includes(tag)) {
              console.log('Tag already exists, skipping addition:', tag);
              return;
            }
            
            const updatedTags = [...(customer.tags || []), tag];
            console.log('Adding new tag, updated tags array:', updatedTags);
            onSaveCustomer(id, { tags: updatedTags });
          }}
          onRemoveTag={(id, tag) => {
            console.log('onRemoveTag callback called', { id, tag, currentTags: customer.tags });
            const updatedTags = (customer.tags || []).filter(t => t !== tag);
            console.log('Updated tags array after removal:', updatedTags);
            onSaveCustomer(id, { tags: updatedTags });
          }}
          onSaveCustomer={(id, updates) => {
            console.log('CustomerDetailPage onSaveCustomer called', { id, updates });
            onSaveCustomer(id, updates);
          }}
          onDeleteCustomer={onDeleteCustomer}
          onCollapse={onClose}
        />
      </div>
    </div>
  );
};