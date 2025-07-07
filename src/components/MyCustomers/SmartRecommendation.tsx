
import React, { useState } from 'react';
import { UserPlus, MessageSquare, Phone, Star, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RecommendedContact } from './types';
import { getRandomProfessionalAvatar } from './utils';
import { RecommendationDetailView } from './RecommendationDetailView';

interface SmartRecommendationProps {
  recommendations: RecommendedContact[];
  onAddRecommendation: (contact: RecommendedContact) => void;
  onToggleFavorite: (contactId: number) => void;
  onPhoneClick: (phoneNumber: string) => void;
  onLineClick: (lineId: string) => void;
  favoriteIds: number[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  addedCount?: number;
}

export const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  recommendations,
  onAddRecommendation,
  onToggleFavorite,
  onPhoneClick,
  onLineClick,
  favoriteIds,
  isCollapsed = false,
  onToggleCollapse,
  addedCount = 0
}) => {
  const [selectedContact, setSelectedContact] = useState<RecommendedContact | null>(null);
  const [skippedContactIds, setSkippedContactIds] = useState<number[]>([]);
  
  const showUpgradePrompt = addedCount >= 5;
  const filteredRecommendations = recommendations.filter(contact => !skippedContactIds.includes(contact.id));

  const handleViewContact = (contact: RecommendedContact) => {
    setSelectedContact(contact);
  };

  const handleSkipContact = async (contactId: number) => {
    setSkippedContactIds(prev => [...prev, contactId]);
  };

  if (filteredRecommendations.length === 0 && !showUpgradePrompt) {
    return null;
  }

  // Show detail view if a contact is selected
  if (selectedContact) {
    return (
      <RecommendationDetailView
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onAddContact={onAddRecommendation}
        onSkipContact={handleSkipContact}
        onToggleFavorite={onToggleFavorite}
        isFavorite={favoriteIds.includes(selectedContact.id)}
      />
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* 標題列 */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">智能推薦</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5">
              {filteredRecommendations.length}
            </Badge>
          </div>
          {onToggleCollapse && (
            <Button
              onClick={onToggleCollapse}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          )}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="px-3 py-2">
          {/* 橫向滑動推薦區域 */}
          <div className="relative">
            <Carousel className="w-full" opts={{ align: "start", dragFree: true }}>
              <CarouselContent className="-ml-1">
                {filteredRecommendations.slice(0, 5).map((contact, index) => (
                  <CarouselItem key={contact.id} className="pl-1 basis-[160px] flex-shrink-0">
                    <Card className="shadow-sm bg-white border border-purple-200 h-16">
                      <CardContent className="p-2">
                        <div className="flex items-center space-x-2 h-full">
                          {/* 頭像 */}
                          <Avatar className="w-6 h-6 flex-shrink-0 border border-purple-300">
                            <AvatarImage src={contact.photo || getRandomProfessionalAvatar(contact.id)} alt={contact.name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-xs">
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* 基本資訊 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h3 className="font-medium text-xs text-gray-800 truncate">{contact.name}</h3>
                              
                              {/* 星號關注按鈕 */}
                              <button
                                onClick={() => onToggleFavorite(contact.id)}
                                className={`p-0.5 rounded-full transition-colors flex-shrink-0 ${
                                  favoriteIds.includes(contact.id) 
                                    ? 'bg-yellow-100 hover:bg-yellow-200' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                title={favoriteIds.includes(contact.id) ? '取消關注' : '關注'}
                              >
                                <Star 
                                  className={`w-2 h-2 ${
                                    favoriteIds.includes(contact.id) 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              </button>
                            </div>
                            
                            <div className="text-xs text-gray-500 truncate mb-0.5">
                              {contact.company}
                            </div>

                            {/* 推薦原因和查看按鈕 */}
                            <div className="flex items-center justify-between space-x-1">
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 px-1 py-0 flex-shrink-0">
                                {contact.reason}
                              </Badge>
                              
                              <Button
                                onClick={() => handleViewContact(contact)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-xs h-4 px-1.5 flex-shrink-0"
                                disabled={showUpgradePrompt && index >= 4}
                              >
                                <Eye className="w-2 h-2 mr-0.5" />
                                查看
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
                
                {/* 升級提示卡片 - 當滑到第5張時顯示 */}
                {showUpgradePrompt && (
                  <CarouselItem className="pl-1 basis-[160px] flex-shrink-0">
                    <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 h-16">
                      <CardContent className="p-2 flex items-center justify-center text-center h-full">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-bold text-purple-800 truncate">升級至 Aile Pro</h3>
                            <p className="text-xs text-purple-600 truncate">解鎖無限制功能</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-3 w-6 h-6" />
              <CarouselNext className="hidden md:flex -right-3 w-6 h-6" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};
