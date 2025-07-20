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
      <Card className="w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-2xl transform transition-all">
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

        <CardContent className="px-6 pb-6 pt-0">
          {/* 頭像和基本資訊 */}
          <div className="text-center mb-4">
            <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white shadow-lg">
              <AvatarImage src={cardData?.avatar} alt={cardData?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                {cardData?.name ? cardData.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {cardData?.name || '未設定姓名'}
            </h3>
            
            {cardData?.jobTitle && (
              <p className="text-sm text-gray-600 mb-1">{cardData.jobTitle}</p>
            )}
            
            {cardData?.companyName && (
              <p className="text-sm text-gray-500 mb-3">{cardData.companyName}</p>
            )}
          </div>

          {/* 聯絡資訊 */}
          <div className="space-y-2 mb-4">
            {cardData?.phone && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-12 text-gray-400">電話:</span>
                <span>{cardData.phone}</span>
              </div>
            )}
            
            {cardData?.email && (
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-12 text-gray-400">Email:</span>
                <span className="truncate">{cardData.email}</span>
              </div>
            )}
          </div>

          {/* 其他按鈕 */}
          <Button
            onClick={onShowFullCard}
            variant="outline"
            className="w-full mb-4 text-sm"
          >
            其他
          </Button>

          {/* 操作按鈕 */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleAddToLineOA}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white text-xs py-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              加入LINE
            </Button>
            
            <Button
              onClick={handleSaveCard}
              size="sm"
              variant="outline"
              className="text-xs py-2"
            >
              <Save className="w-3 h-3 mr-1" />
              儲存
            </Button>
            
            <Button
              onClick={handleShareCard}
              size="sm"
              variant="outline"
              className="text-xs py-2"
            >
              <Share2 className="w-3 h-3 mr-1" />
              分享
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiniCardPreview;