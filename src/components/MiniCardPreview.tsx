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
      <Card className="w-full max-w-sm bg-background rounded-2xl overflow-hidden shadow-2xl transform transition-all" style={{ maxHeight: '75vh' }}>
        {/* 關閉按鈕 */}
        <div className="flex justify-end p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Hero Section - 大頭照區域 */}
        <div className="px-6 pb-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={cardData?.avatar} alt={cardData?.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-semibold">
                {cardData?.name ? cardData.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Body Section - 基本資料區 */}
        <CardContent className="px-6 pb-4 space-y-3">
          {/* 公司名稱 */}
          {cardData?.companyName && (
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground truncate" title={cardData.companyName}>
                {cardData.companyName.length > 20 ? `${cardData.companyName.substring(0, 20)}...` : cardData.companyName}
              </p>
            </div>
          )}

          {/* 職稱 */}
          {cardData?.jobTitle && (
            <div className="text-center">
              <p className="text-base font-medium text-foreground">{cardData.jobTitle}</p>
            </div>
          )}

          {/* 姓名 */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">
              {cardData?.name || '未設定姓名'}
            </h3>
          </div>

          {/* 聯絡資訊 */}
          <div className="space-y-2">
            {cardData?.phone && (
              <a 
                href={`tel:${cardData.phone}`}
                className="flex items-center text-sm text-foreground hover:text-primary transition-colors"
              >
                <span className="w-12 text-muted-foreground">電話:</span>
                <span className="underline">{cardData.phone}</span>
              </a>
            )}
            
            {cardData?.email && (
              <a 
                href={`mailto:${cardData.email}`}
                className="flex items-center text-sm text-foreground hover:text-primary transition-colors"
              >
                <span className="w-12 text-muted-foreground">Email:</span>
                <span className="truncate underline">{cardData.email}</span>
              </a>
            )}
          </div>

          {/* 其他按鈕 */}
          <Button
            onClick={onShowFullCard}
            variant="outline"
            className="w-full"
          >
            🔘 其他
          </Button>
        </CardContent>

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
      </Card>
    </div>
  );
};

export default MiniCardPreview;