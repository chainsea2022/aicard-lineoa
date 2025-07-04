
import React from 'react';
import { ArrowLeft, Users, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FollowingPageProps {
  onBack: () => void;
  followingCount: number;
  customers: any[];
}

const FollowingPage: React.FC<FollowingPageProps> = ({ onBack, followingCount, customers }) => {
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

  const handlePhoneClick = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="text-white hover:bg-white/20 p-1.5 h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-bold text-base">我的關注</h1>
        </div>
      </div>

      <div className="p-3 bg-purple-50 border-b border-purple-200 flex-shrink-0">
        <div className="flex items-center justify-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-purple-700">共關注 {followingCount} 位好友</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {customers.length > 0 ? (
            <div className="space-y-2">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage 
                        src={customer.photo || getRandomProfessionalAvatar(customer.id)} 
                        alt={customer.name} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                        {customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      
                      {customer.company && (
                        <p className="text-xs text-gray-600 truncate">{customer.company}</p>
                      )}
                      
                      {customer.jobTitle && (
                        <p className="text-xs text-gray-500 truncate">{customer.jobTitle}</p>
                      )}
                      
                      {customer.phone && (
                        <button
                          onClick={() => handlePhoneClick(customer.phone)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors mt-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{customer.phone}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">還沒有關注任何人</p>
              <p className="text-gray-400 text-xs mt-1">開始關注感興趣的聯絡人吧</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FollowingPage;
