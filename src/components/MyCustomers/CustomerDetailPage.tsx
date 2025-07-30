import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  onScheduleManagement: (id: number) => void;
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
  onScheduleManagement,
  activeSection
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LIFF style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">聯絡人詳情</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ExpandedCard
          customer={customer}
          activeSection={activeSection}
          onToggleFavorite={onToggleFavorite}
          onAddFollower={onAddFollower}
          onIgnoreFollower={() => {}}
          onPhoneClick={onPhoneClick}
          onLineClick={onLineClick}
          onSendInvitation={onSendInvitation}
          onAddTag={() => {}}
          onRemoveTag={() => {}}
          onSaveCustomer={onSaveCustomer}
          onDeleteCustomer={onDeleteCustomer}
          onScheduleManagement={onScheduleManagement}
          onCollapse={onClose}
        />
      </div>
    </div>
  );
};