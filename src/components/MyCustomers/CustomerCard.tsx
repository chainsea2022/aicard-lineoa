
import React from 'react';
import { ChevronRight, MessageSquare, Phone, Bell, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Customer } from './types';
import { getRandomProfessionalAvatar, getRelationshipStatusDisplay } from './utils';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
  onAddFollower: (customerId: number) => void;
  onPhoneClick: (phoneNumber: string) => void;
  onLineClick: (lineId: string) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onClick,
  onAddFollower,
  onPhoneClick,
  onLineClick
}) => {
  const statusDisplay = getRelationshipStatusDisplay(customer.relationshipStatus);

  return (
    <Card className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md bg-white border border-gray-200" onClick={onClick}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10 flex-shrink-0 border border-blue-300">
              <AvatarImage src={customer.photo || getRandomProfessionalAvatar(customer.id)} alt={customer.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                {customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {customer.isNewAddition && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
                
                {/* Show favorite star before expansion */}
                {customer.isFavorite && (
                  <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                )}
                
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {customer.line && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onLineClick(customer.line!);
                      }} 
                      className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                      title="開啟 LINE"
                    >
                      <MessageSquare className="w-3 h-3 text-green-600" />
                    </button>
                  )}
                  {customer.phone && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onPhoneClick(customer.phone);
                      }} 
                      className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" 
                      title="撥打電話"
                    >
                      <Phone className="w-3 h-3 text-blue-600" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 flex-shrink-0">
                {customer.relationshipStatus === 'addedMe' && <Bell className="w-3 h-3 text-red-500" />}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-xs text-gray-600 truncate mb-1">
              {customer.company && customer.jobTitle 
                ? `${customer.company} · ${customer.jobTitle}` 
                : customer.company || customer.jobTitle || '無公司資訊'
              }
            </div>
            
            <div className="flex items-center justify-between">
              {customer.relationshipStatus === 'addedMe' && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFollower(customer.id);
                  }} 
                  size="sm" 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700 text-xs h-6 px-2"
                >
                  +
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
