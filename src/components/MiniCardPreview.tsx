import React from 'react';
import { X, Plus, Save, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface MiniCardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onShowFullCard: () => void;
  cardData?: any;
}

const MiniCardPreview: React.FC<MiniCardPreviewProps> = ({ 
  isOpen, 
  onClose, 
  onShowFullCard,
  cardData 
}) => {
  if (!isOpen) return null;

  const handleAddToLineOA = () => {
    toast({
      title: "加入成功",
      description: "已成功加入LINE官方帳號"
    });
  };

  const handleSaveCard = () => {
    toast({
      title: "儲存成功",
      description: "名片已儲存至聯絡人"
    });
  };

  const handleShareCard = async () => {
    const shareData = {
      title: `${cardData?.name || ''}的電子名片`,
      text: `${cardData?.name || ''} - ${cardData?.jobTitle || ''}\n${cardData?.companyName || ''}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 備用方案：複製到剪貼簿
        const textToShare = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToShare);
        toast({
          title: "已複製到剪貼簿",
          description: "名片資訊已複製，可分享給他人"
        });
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* 使用與 Flex Message 相同的樣式 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden max-w-sm w-full">
        {/* 關閉按鈕 */}
        <div className="flex justify-end p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 頭部資訊 */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-4 mb-4 rounded-xl">
          <div className="flex items-center space-x-3">
            {cardData?.photo && (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <img src={cardData.photo} alt="頭像" className="w-14 h-14 rounded-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              {cardData?.companyName && (
                <p className="text-blue-100 text-sm">{cardData.companyName}</p>
              )}
              <h3 className="text-white text-lg font-semibold mb-1">
                {cardData?.name || '未設定姓名'}
              </h3>
              {cardData?.jobTitle && (
                <p className="text-blue-100 text-sm">{cardData.jobTitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* 聯絡資訊 */}
        <div className="px-4 pb-4 space-y-3">
          {/* 電話 */}
          {cardData?.phone && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">📱</span>
              <div>
                <p className="text-xs font-medium text-gray-700">電話</p>
                <p className="text-sm text-gray-800">{cardData.phone}</p>
              </div>
            </div>
          )}

          {/* Email */}
          {cardData?.email && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">✉️</span>
              <div>
                <p className="text-xs font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-800">{cardData.email}</p>
              </div>
            </div>
          )}

          {/* 查看更多按鈕 */}
          <Button
            onClick={onShowFullCard}
            variant="outline"
            className="w-full"
          >
            查看更多
          </Button>
        </div>

        {/* Footer Section - 操作按鈕區 */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleAddToLineOA}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white text-xs py-2 flex-col h-auto"
            >
              <Plus className="w-4 h-4 mb-1" />
              <span>加入LINE OA</span>
            </Button>
            
            <Button
              onClick={handleSaveCard}
              size="sm"
              variant="outline"
              className="text-xs py-2 flex-col h-auto"
            >
              <Save className="w-4 h-4 mb-1" />
              <span>儲存名片</span>
            </Button>
            
            <Button
              onClick={handleShareCard}
              size="sm"
              variant="outline"
              className="text-xs py-2 flex-col h-auto"
            >
              <Share2 className="w-4 h-4 mb-1" />
              <span>分享</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCardPreview;