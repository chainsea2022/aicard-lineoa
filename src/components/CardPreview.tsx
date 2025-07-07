
import React, { useState } from 'react';
import { ArrowLeft, Edit, Share2, Download, QrCode, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CardPreviewProps {
  cardData: {
    companyName: string;
    name: string;
    phone: string;
    email: string;
    website: string;
    line: string;
    facebook: string;
    instagram: string;
    photo: string | null;
  };
  onClose: () => void;
  onEdit: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData, onClose, onEdit }) => {
  const [showQRCode, setShowQRCode] = useState(true); // 預設展開

  const generateQRCode = (data: string) => {
    // 創建簡單的QR Code視覺化
    const size = 8; // 8x8的簡化QR Code
    const squares = [];
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const isBlack = (i + j + data.length) % 3 === 0;
        squares.push(
          <div
            key={`${i}-${j}`}
            className={`w-3 h-3 ${isBlack ? 'bg-black' : 'bg-white'}`}
          />
        );
      }
    }
    
    return (
      <div className="grid grid-cols-8 gap-0 p-4 bg-white border-2 border-gray-300 rounded-lg">
        {squares}
      </div>
    );
  };

  const handleGenerateQRCode = () => {
    // 模擬生成QR Code
    const cardInfo = `名片資訊\n姓名: ${cardData.name}\n公司: ${cardData.companyName}\n電話: ${cardData.phone}\nEmail: ${cardData.email}`;
    console.log('生成QR Code:', cardInfo);
  };

  const shareCard = () => {
    if (navigator.share) {
      navigator.share({
        title: `${cardData.name}的電子名片`,
        text: `${cardData.companyName} - ${cardData.name}`,
        url: window.location.href,
      });
    } else {
      // 復制到剪貼板
      navigator.clipboard.writeText(`${cardData.name}的電子名片 - ${cardData.companyName}`);
    }
  };

  const downloadCard = () => {
    // 模擬下載名片
    console.log('下載名片');
  };

  // 生成QR Code資料
  const qrCodeData = `名片資訊
姓名: ${cardData.name || ''}
公司: ${cardData.companyName || ''}
電話: ${cardData.phone || ''}
Email: ${cardData.email || ''}
LINE: ${cardData.line || ''}
網站: ${cardData.website || ''}`;

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">名片預覽</h1>
        </div>
      </div>

      <div className="p-6">
        {/* 名片預覽 */}
        <Card className="mb-6 shadow-xl border-2 border-green-200">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-4">
                {cardData.photo && (
                  <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                    <AvatarImage src={cardData.photo} alt="照片" />
                    <AvatarFallback className="bg-white text-green-600 font-bold text-xl">
                      {cardData.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{cardData.name}</h2>
                  {cardData.companyName && (
                    <p className="text-green-100 text-lg">{cardData.companyName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {cardData.phone && (
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <span>{cardData.phone}</span>
                  </div>
                )}
                {cardData.email && (
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>{cardData.email}</span>
                  </div>
                )}
                {cardData.website && (
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <span>{cardData.website}</span>
                  </div>
                )}
              </div>

              {/* 社群資訊 */}
              {(cardData.line || cardData.facebook || cardData.instagram) && (
                <div className="mt-4 pt-4 border-t border-green-300/50">
                  <div className="flex flex-wrap gap-3">
                    {cardData.line && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">💬</span>
                        <span>LINE: {cardData.line}</span>
                      </div>
                    )}
                    {cardData.facebook && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📘</span>
                        <span>FB: {cardData.facebook}</span>
                      </div>
                    )}
                    {cardData.instagram && (
                      <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                        <span className="mr-1">📷</span>
                        <span>IG: {cardData.instagram}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code 區塊 - 預設展開 */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={() => setShowQRCode(!showQRCode)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                <span className="font-semibold text-gray-800">我的名片 QR Code</span>
              </div>
              {showQRCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showQRCode && (
              <div className="mt-3 text-center">
                <div className="flex justify-center mb-3">
                  {generateQRCode(qrCodeData)}
                </div>
                <p className="text-xs text-gray-600">
                  掃描此QR Code即可獲得我的聯絡資訊
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 操作按鈕 */}
        <div className="space-y-3">
          <Button
            onClick={onEdit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            編輯名片
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGenerateQRCode}
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button
              onClick={shareCard}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>

          <Button
            onClick={downloadCard}
            variant="outline"
            className="w-full border-gray-500 text-gray-600 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            下載名片
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
