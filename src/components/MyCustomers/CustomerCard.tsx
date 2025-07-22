import React from 'react';
import { ChevronRight, MessageSquare, Phone, Bell, Star, Globe, Send } from 'lucide-react';
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
  onToggleFavorite?: (customerId: number) => void;
  onShowInvitation?: (customerId: number) => void;
}
export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onClick,
  onAddFollower,
  onPhoneClick,
  onLineClick,
  onToggleFavorite,
  onShowInvitation
}) => {
  const statusDisplay = getRelationshipStatusDisplay(customer.relationshipStatus);
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(customer.id);
    }
  };
  const handleAddFollower = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddFollower(customer.id);
  };

  const handleShowInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShowInvitation) {
      onShowInvitation(customer.id);
    }
  };
  return <Card className="mb-2 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md bg-white border border-gray-200" onClick={onClick}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10 flex-shrink-0 border border-blue-300">
              <AvatarImage src={customer.photo || getRandomProfessionalAvatar(customer.id)} alt={customer.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                {customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {customer.isNewAddition && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold leading-none" style={{
              fontSize: '8px'
            }}>N</span>
              </div>}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 truncate">{customer.name}</h3>
                
                {/* 星號關注按鈕 - 所有電子名片都顯示 */}
                {onToggleFavorite && <button onClick={handleToggleFavorite} className={`p-1 rounded-full transition-colors flex-shrink-0 ${customer.isFavorite ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-100 hover:bg-gray-200'}`} title={customer.isFavorite ? '取消關注' : '關注'}>
                    <Star className={`w-3 h-3 ${customer.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </button>}
                
                {/* 聯絡方式按鈕 - 根據註冊狀態顯示不同按鈕 */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {/* 已註冊電子名片用戶：顯示關注、LINE、電話 */}
                  {customer.isDigitalCard && customer.isRegisteredUser !== false && (
                    <>
                      {/* 官網按鈕 */}
                      {customer.website && (
                        <button onClick={e => {
                          e.stopPropagation();
                          window.open(customer.website, '_blank');
                        }} className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" title="開啟官網">
                          <Globe className="w-3 h-3 text-purple-600" />
                        </button>
                      )}
                      {/* LINE 按鈕 */}
                      {customer.line && (
                        <button onClick={e => {
                          e.stopPropagation();
                          onLineClick(customer.line!);
                        }} className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors" title="開啟 LINE">
                          <MessageSquare className="w-3 h-3 text-green-600" />
                        </button>
                      )}
                      {/* 電話按鈕 */}
                      {customer.phone && (
                        <button onClick={e => {
                          e.stopPropagation();
                          onPhoneClick(customer.phone);
                        }} className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" title="撥打電話">
                          <Phone className="w-3 h-3 text-blue-600" />
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* 未註冊電子名片用戶：顯示關注、邀請、LINE */}
                  {customer.isDigitalCard && customer.isRegisteredUser === false && (
                    <>
                      {/* 調試信息 */}
                      {console.log(`Customer ${customer.name}: isDigitalCard=${customer.isDigitalCard}, isRegisteredUser=${customer.isRegisteredUser}, showing invitation button`)}
                      
                      {/* 邀請按鈕 */}
                      {onShowInvitation && (
                        <button onClick={handleShowInvitation} className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors" title="發送邀請">
                          <Send className="w-3 h-3 text-orange-600" />
                        </button>
                      )}
                      {/* LINE 按鈕 - 使用 lineId 或 line */}
                      {(customer.lineId || customer.line) && (
                        <button onClick={e => {
                          e.stopPropagation();
                          onLineClick(customer.lineId || customer.line!);
                        }} className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors" title="開啟 LINE">
                          <MessageSquare className="w-3 h-3 text-green-600" />
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* 紙本名片：保持原有按鈕 */}
                  {!customer.isDigitalCard && (
                    <>
                      {/* 官網按鈕 */}
                      {customer.website && (
                        <button onClick={e => {
                          e.stopPropagation();
                          window.open(customer.website, '_blank');
                        }} className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors" title="開啟官網">
                          <Globe className="w-3 h-3 text-purple-600" />
                        </button>
                      )}
                      {/* LINE 按鈕 */}
                      {customer.line && (
                        <button onClick={e => {
                          e.stopPropagation();
                          onLineClick(customer.line!);
                        }} className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors" title="開啟 LINE">
                          <MessageSquare className="w-3 h-3 text-green-600" />
                        </button>
                      )}
                      {/* 電話按鈕 */}
                      {customer.phone && (
                        <button onClick={e => {
                          e.stopPropagation();
                          onPhoneClick(customer.phone);
                        }} className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors" title="撥打電話">
                          <Phone className="w-3 h-3 text-blue-600" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 flex-shrink-0">
                {customer.relationshipStatus === 'addedMe' && <Bell className="w-3 h-3 text-red-500" />}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="text-xs text-gray-600 truncate mb-1">
              {/* 已註冊電子名片用戶：顯示公司、職稱 */}
              {customer.isDigitalCard && customer.isRegisteredUser !== false && (
                customer.company && customer.jobTitle ? `${customer.company} · ${customer.jobTitle}` : customer.company || customer.jobTitle || '無公司資訊'
              )}
              
              {/* 未註冊電子名片用戶：顯示 LINE ID */}
              {customer.isDigitalCard && customer.isRegisteredUser === false && customer.lineId && (
                `LINE ID: ${customer.lineId}`
              )}
              
              {/* 紙本名片：保持原有顯示 */}
              {!customer.isDigitalCard && (
                customer.company && customer.jobTitle ? `${customer.company} · ${customer.jobTitle}` : customer.company || customer.jobTitle || '無公司資訊'
              )}
            </div>
            
            <div className="flex items-center justify-between">
              {customer.relationshipStatus === 'addedMe' && <Button onClick={handleAddFollower} size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-xs h-6 px-2">
                  + 加入
                </Button>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};