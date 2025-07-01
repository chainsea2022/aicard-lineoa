
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MyCardProps {
  onClose: () => void;
}

interface CardData {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  line: string;
  facebook: string;
  instagram: string;
  photo: string | null;
}

const MyCard: React.FC<MyCardProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('aile-card-data');
    if (savedData) {
      setCardData(JSON.parse(savedData));
    }
  }, []);

  const handleShare = () => {
    toast({
      title: "分享成功！",
      description: "您的電子名片已準備好分享。",
    });
  };

  const generateQRCode = () => {
    setShowQR(true);
    toast({
      title: "QR Code 已生成！",
      description: "其他人可以掃描此 QR Code 來獲取您的名片。",
    });
  };

  if (!cardData) {
    return (
      <div className="absolute inset-0 bg-white z-50">
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
            <h1 className="font-bold text-lg">我的電子名片</h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="text-gray-400 mb-4">
            <QrCode className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">尚未建立名片</h2>
          <p className="text-gray-600 mb-6">請先建立您的電子名片，才能在此查看和分享。</p>
          <Button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600"
          >
            返回建立名片
          </Button>
        </div>
      </div>
    );
  }

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
          <h1 className="font-bold text-lg">我的電子名片</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Digital Business Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center space-x-4 mb-4">
            {cardData.photo && (
              <img
                src={cardData.photo}
                alt="照片"
                className="w-20 h-20 rounded-full object-cover border-3 border-white"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold">{cardData.name}</h3>
              <p className="text-blue-100 text-lg">{cardData.companyName}</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            {cardData.phone && (
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>{cardData.phone}</span>
              </div>
            )}
            {cardData.email && (
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>{cardData.email}</span>
              </div>
            )}
            {cardData.website && (
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>{cardData.website}</span>
              </div>
            )}
          </div>

          {/* Social Media Links */}
          {(cardData.line || cardData.facebook || cardData.instagram) && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-blue-100 mb-2">社群媒體</p>
              <div className="space-y-1 text-sm">
                {cardData.line && <div>LINE: {cardData.line}</div>}
                {cardData.facebook && <div>Facebook: {cardData.facebook}</div>}
                {cardData.instagram && <div>Instagram: {cardData.instagram}</div>}
              </div>
            </div>
          )}
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">我的 QR Code</h3>
            <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">掃描此 QR Code 獲取我的名片</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={generateQRCode}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <QrCode className="w-5 h-5 mr-2" />
            生成 QR Code
          </Button>
          
          <Button
            onClick={handleShare}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享名片
          </Button>
        </div>

        {/* Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-blue-800 mb-2">💡 建議</h4>
          <p className="text-sm text-blue-700 mb-2">
            請加入 AIWOW 名片簿，享受更多便利功能！
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-100"
          >
            加入 AIWOW LINE OA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
