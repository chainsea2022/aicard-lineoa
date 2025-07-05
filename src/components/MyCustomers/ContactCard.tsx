
import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Customer } from './types';

interface ContactCardProps {
  customer: Customer;
  onClick: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  customer,
  onClick
}) => (
  <Card 
    className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
    onClick={onClick}
  >
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
            {customer.isFavorite && (
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            )}
          </div>
          
          <div className="text-xs text-gray-600 truncate">
            {customer.company && customer.jobTitle 
              ? `${customer.company} · ${customer.jobTitle}`
              : customer.company || customer.jobTitle || (customer.phone || customer.email || '無聯絡資訊')
            }
          </div>
          
          {customer.tags && customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {customer.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {customer.tags.length > 2 && (
                <span className="text-xs text-gray-400">+{customer.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {(customer.invitationSent || customer.emailInvitationSent) && (
            <span className="text-xs text-green-600 font-medium">已邀請</span>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </CardContent>
  </Card>
);
