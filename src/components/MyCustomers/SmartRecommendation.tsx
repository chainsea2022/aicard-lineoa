
import React from 'react';
import { UserPlus, MessageSquare, Phone, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RecommendedContact } from './types';
import { getRandomProfessionalAvatar } from './utils';

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
  const showUpgradePrompt = addedCount >= 5; // 改為第5張後顯示升級提示

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">暫無推薦聯絡人</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      {onToggleCollapse && (
        <div className="p-3 border-b border-gray-100">
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <span>智能推薦聯絡人</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                {recommendations.length}
              </Badge>
            </div>
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      )}
      
      {!isCollapsed && (
        <div className="p-3">
          {/* 預設展開的橫向滑動推薦區域 */}
          <div className="relative">
            <Carousel className="w-full" opts={{ align: "start", dragFree: true }}>
              <CarouselContent className="-ml-2">
                {recommendations.map((contact, index) => (
                  <CarouselItem key={contact.id} className="pl-2 basis-[260px] flex-shrink-0">
                    {/* 如果是第5張名片之後，顯示升級提示 */}
                    {index === 4 && showUpgradePrompt ? (
                      <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 h-full">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                          <div className="mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                              <UserPlus className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-purple-800 mb-1">升級至 Aile Pro</h3>
                          <p className="text-xs text-purple-600 mb-3 leading-relaxed">
                            解鎖商務全功能<br />
                            無限制加入名片
                          </p>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs px-4 py-2"
                          >
                            立即升級
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="shadow-sm bg-white border border-purple-200 h-full">
                        <CardContent className="p-3">
                          <div className="flex flex-col space-y-3">
                            {/* 頭像和基本資訊 */}
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12 flex-shrink-0 border border-purple-300">
                                <AvatarImage src={contact.photo || getRandomProfessionalAvatar(contact.id)} alt={contact.name} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm">
                                  {contact.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-bold text-sm text-gray-800 truncate">{contact.name}</h3>
                                  
                                  {/* 星號關注按鈕 */}
                                  <button
                                    onClick={() => onToggleFavorite(contact.id)}
                                    className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                                      favoriteIds.includes(contact.id) 
                                        ? 'bg-yellow-100 hover:bg-yellow-200' 
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    title={favoriteIds.includes(contact.id) ? '取消關注' : '關注'}
                                  >
                                    <Star 
                                      className={`w-3 h-3 ${
                                        favoriteIds.includes(contact.id) 
                                          ? 'text-yellow-500 fill-current' 
                                          : 'text-gray-400'
                                      }`} 
                                    />
                                  </button>
                                </div>
                                
                                <div className="text-xs text-gray-600 truncate">
                                  {contact.company} · {contact.jobTitle}
                                </div>
                              </div>
                            </div>

                            {/* 推薦原因和互動按鈕 */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                  {contact.reason}
                                </Badge>
                                {contact.mutualFriends?.length > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {contact.mutualFriends.length} 位共同朋友
                                  </span>
                                )}
                              </div>

                              {/* 聯絡按鈕 - 根據公開設定顯示 */}
                              {contact.isPublicProfile && contact.allowDirectContact && (
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => onLineClick(`${contact.name}-line`)} 
                                    className="flex-1 p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors flex items-center justify-center" 
                                    title="開啟 LINE"
                                  >
                                    <MessageSquare className="w-3 h-3 text-green-600 mr-1" />
                                    <span className="text-xs text-green-600">LINE</span>
                                  </button>
                                  <button 
                                    onClick={() => onPhoneClick(`09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`)} 
                                    className="flex-1 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center" 
                                    title="撥打電話"
                                  >
                                    <Phone className="w-3 h-3 text-blue-600 mr-1" />
                                    <span className="text-xs text-blue-600">電話</span>
                                  </button>
                                </div>
                              )}
                              
                              {/* 加入按鈕 */}
                              <Button
                                onClick={() => onAddRecommendation(contact)}
                                size="sm"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-xs h-8"
                                disabled={showUpgradePrompt && index >= 4}
                              >
                                <UserPlus className="w-3 h-3 mr-1" />
                                加入聯絡人
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};
