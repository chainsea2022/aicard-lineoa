
import React, { useState } from 'react';
import { X, UserPlus, Users, Building, MapPin, MessageSquare, Star, UserX } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecommendedContact } from './types';
import { getRandomProfessionalAvatar } from './utils';

interface RecommendationDetailViewProps {
  contact: RecommendedContact;
  onClose: () => void;
  onAddContact: (contact: RecommendedContact) => void;
  onSkipContact: (contactId: number) => void;
  onToggleFavorite: (contactId: number) => void;
  isFavorite: boolean;
}

export const RecommendationDetailView: React.FC<RecommendationDetailViewProps> = ({
  contact,
  onClose,
  onAddContact,
  onSkipContact,
  onToggleFavorite,
  isFavorite
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const handleAddContact = async () => {
    setIsAdding(true);
    try {
      await onAddContact(contact);
      onClose();
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSkipContact = async () => {
    setIsSkipping(true);
    try {
      await onSkipContact(contact.id);
      onClose();
    } catch (error) {
      console.error('Error skipping contact:', error);
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm">
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">推薦聯絡人</h2>
        <Button
          onClick={() => onToggleFavorite(contact.id)}
          variant="ghost"
          size="sm"
          className={isFavorite ? 'text-yellow-500' : 'text-gray-400'}
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-purple-200">
            <AvatarImage 
              src={contact.photo || getRandomProfessionalAvatar(contact.id)} 
              alt={contact.name} 
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-2xl">
              {contact.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-bold text-gray-800 mb-1">{contact.name}</h3>
          
          {contact.jobTitle && (
            <p className="text-gray-600 mb-2">{contact.jobTitle}</p>
          )}
          
          {contact.company && (
            <div className="flex items-center justify-center text-gray-500 mb-2">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">{contact.company}</span>
            </div>
          )}
        </div>

        {/* Recommendation Reason */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-purple-800 mb-2">推薦原因</h4>
          <Badge className="bg-purple-100 text-purple-700 mb-3">
            {contact.reason}
          </Badge>
          
          <div className="space-y-2 text-sm text-purple-700">
            {contact.reason === '共同朋友' && (
              <div>
                <p className="font-medium mb-1">共同朋友：</p>
                <div className="flex flex-wrap gap-1">
                  {contact.mutualFriends?.map((friend, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-purple-300">
                      {friend}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {contact.reason === '同行業' && (
              <p>您們都在相關產業工作，可能有合作機會或專業交流的空間。</p>
            )}
            
            {contact.reason === '附近地區' && (
              <p>您們位於相同或鄰近的地區，方便面對面交流與合作。</p>
            )}
            
            {contact.reason === '相似興趣' && (
              <p>根據公開資訊分析，您們可能有相似的興趣愛好或專業關注領域。</p>
            )}
            
            {contact.reason === '專業推薦' && (
              <p>基於您的專業背景和人脈網絡，系統推薦此聯絡人可能對您有價值。</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">聯絡資訊</h4>
          
          {contact.isPublicProfile ? (
            <div className="space-y-2">
              <div className="flex items-center text-green-600 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>公開個人檔案</span>
              </div>
              
              {contact.allowDirectContact && (
                <div className="flex items-center text-blue-600 text-sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>允許直接聯絡</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              <p>此聯絡人的詳細資訊將在加入後顯示</p>
            </div>
          )}
        </div>

        {/* Interaction Suggestions */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-3">建議互動方式</h4>
          <div className="space-y-2 text-sm text-blue-700">
            {contact.mutualFriends && contact.mutualFriends.length > 0 && (
              <p>• 可透過共同朋友 {contact.mutualFriends[0]} 介紹認識</p>
            )}
            <p>• 先發送連結邀請，建立初步聯繫</p>
            <p>• 在專業場合或活動中自然交流</p>
            {contact.allowDirectContact && (
              <p>• 可直接發送訊息表達合作或交流意願</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <Button
            onClick={handleSkipContact}
            variant="outline"
            className="flex-1 text-gray-600 border-gray-300"
            disabled={isSkipping || isAdding}
          >
            {isSkipping ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                略過中...
              </div>
            ) : (
              <>
                <UserX className="w-4 h-4 mr-2" />
                略過
              </>
            )}
          </Button>
          
          <Button
            onClick={handleAddContact}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isAdding || isSkipping}
          >
            {isAdding ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                加入中...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                加入我的名片夾
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
