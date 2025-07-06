
import React from 'react';
import { UserPlus, MessageSquare, Phone, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

export const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  recommendations,
  onAddRecommendation,
  onToggleFavorite,
  onPhoneClick,
  onLineClick,
  favoriteIds,
  isCollapsed = false,
  onToggleCollapse
}) => {
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
        <div className="p-3 space-y-3">
          {recommendations.map((contact) => (
            <Card key={contact.id} className="shadow-sm bg-white border border-purple-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 flex-shrink-0 border border-purple-300">
                    <AvatarImage src={contact.photo || getRandomProfessionalAvatar(contact.id)} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-sm">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
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
                        
                        {/* 聯絡按鈕 - 根據公開設定顯示 */}
                        {contact.isPublicProfile && contact.allowDirectContact && (
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button 
                              onClick={() => onLineClick(`${contact.name}-line`)} 
                              className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors" 
                              title="開啟 LINE"
                            >
                              <MessageSquare className="w-3 h-3 text-green-600" />
                            </button>
                            <button 
                              onClick={() => onPhoneClick(`09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`)} 
                              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" 
                              title="撥打電話"
                            >
                              <Phone className="w-3 h-3 text-blue-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 truncate mb-1">
                      {contact.company} · {contact.jobTitle}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          {contact.reason}
                        </Badge>
                        {contact.mutualFriends?.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {contact.mutualFriends.length} 位共同朋友
                          </span>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => onAddRecommendation(contact)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-xs h-6 px-2"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        加入
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
