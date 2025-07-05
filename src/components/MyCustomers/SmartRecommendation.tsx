
import React from 'react';
import { TrendingUp, Crown, Minimize2, Maximize2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RecommendedContact } from './types';
import { professionalAvatars } from './utils';
import { toast } from '@/hooks/use-toast';

interface SmartRecommendationProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddRecommendedContact: (contactId: number) => void;
  recommendedContacts: RecommendedContact[];
}

export const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  isCollapsed,
  onToggleCollapse,
  onAddRecommendedContact,
  recommendedContacts
}) => {
  const showUpgradePrompt = () => {
    toast({
      title: "升級至 Aile 商務版",
      description: "解鎖專業商務管理功能，享受更多進階服務",
      duration: 3000,
    });
  };

  const renderSmartRecommendationCard = (contact: RecommendedContact, index: number) => {
    if (index >= 10) {
      return (
        <Card key="upgrade" className="w-24 h-16 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-dashed border-purple-300 flex-shrink-0">
          <CardContent className="p-1 h-full">
            <button 
              onClick={showUpgradePrompt}
              className="w-full h-full flex flex-col items-center justify-center space-y-0.5 text-purple-600 hover:text-purple-700"
            >
              <Crown className="w-3 h-3" />
              <span className="text-xs font-medium text-center leading-tight">升級<br />解鎖</span>
            </button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={contact.id} className="w-24 h-16 bg-white border border-orange-200 flex-shrink-0">
        <CardContent className="p-1">
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-1 mb-0.5">
              <Avatar className="w-4 h-4 border border-orange-300 flex-shrink-0">
                <AvatarImage src={contact.photo} alt={contact.name} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold text-xs">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs text-gray-800 truncate">{contact.name}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-600 truncate mb-1">{contact.jobTitle}</p>
            <Button
              onClick={() => onAddRecommendedContact(contact.id)}
              size="sm"
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-100 text-xs h-4 px-1 mt-auto"
            >
              加入
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-t border-orange-200 flex-shrink-0">
      <div className={`transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-2'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">智能推薦</span>
              </div>
              <Button
                onClick={onToggleCollapse}
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6 text-orange-600 hover:bg-orange-100"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {recommendedContacts.concat(Array(10).fill(null)).map((contact, index) => 
                  contact ? renderSmartRecommendationCard(contact, index) : renderSmartRecommendationCard({
                    id: 100 + index,
                    name: `推薦聯絡人 ${index + 5}`,
                    jobTitle: '專業人士',
                    company: '知名企業',
                    photo: professionalAvatars[index % professionalAvatars.length],
                    mutualFriends: [],
                    reason: '系統推薦'
                  }, index + 4)
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">智能推薦</span>
              <div className="flex space-x-1">
                {recommendedContacts.slice(0, 3).map((contact, index) => (
                  <Avatar key={contact.id} className="w-6 h-6 border border-orange-300">
                    <AvatarImage src={contact.photo} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white font-bold text-xs">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-6 h-6 border border-orange-300 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-xs text-orange-600 font-medium">+</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onToggleCollapse}
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6 text-orange-600 hover:bg-orange-100"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
