
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CardPreview from './CardPreview';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete?: () => void;
  userData?: any; // 改為接收完整的用戶資料
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose, onRegistrationComplete, userData }) => {
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [line, setLine] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // 根據登入方式自動填入資料
  useEffect(() => {
    if (userData) {
      if (userData.phone) {
        setPhone(userData.phone);
      }
      if (userData.lineId) {
        setLine(userData.lineId);
      }
      if (userData.displayName) {
        setName(userData.displayName);
      }
      if (userData.pictureUrl) {
        setPhoto(userData.pictureUrl);
      }
    }
  }, [userData]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const cardData = {
    companyName,
    name,
    phone,
    email,
    website,
    line,
    facebook,
    instagram,
    photo
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "請輸入姓名",
        description: "姓名為必填欄位",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    
    // Award registration points if this is first time registration
    const existingPoints = localStorage.getItem('aile-user-points');
    if (!existingPoints) {
      const registrationTransaction = {
        id: Date.now(),
        type: 'earn',
        points: 100,
        description: '註冊電子名片',
        date: new Date()
      };
      
      localStorage.setItem('aile-user-points', '100');
      localStorage.setItem('aile-points-history', JSON.stringify([registrationTransaction]));
    }
    
    toast({
      title: "電子名片建立成功！",
      description: "您的名片已經建立完成，獲得 100 點數獎勵！",
    });

    if (onRegistrationComplete) {
      onRegistrationComplete();
    } else {
      onClose();
    }
  };

  if (showPreview) {
    return (
      <CardPreview
        cardData={cardData}
        onClose={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">建立電子名片</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="text-white hover:bg-white/20"
          >
            <Eye className="w-4 h-4 mr-1" />
            預覽
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        {/* 登入資訊提示 */}
        {userData && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {userData.loginMethod === 'line' 
                ? `✅ 已使用 LINE 登入，LINE ID 已自動填入`
                : `✅ 已使用手機號碼登入，手機號碼已自動填入`
              }
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">公司名稱</Label>
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="請輸入公司名稱"
            />
          </div>
          
          <div>
            <Label htmlFor="name">姓名 *</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">手機號碼</Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="請輸入手機號碼"
              readOnly={!!(userData?.phone)}
              className={userData?.phone ? 'bg-gray-100' : ''}
            />
            {userData?.phone && (
              <p className="text-xs text-gray-500 mt-1">已從登入資訊自動填入</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">電子信箱</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入電子信箱"
            />
          </div>
          
          <div>
            <Label htmlFor="website">公司官網</Label>
            <Input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="請輸入公司官網"
            />
          </div>

          {/* 社群設置區塊 */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-800 mb-3">社群設置</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="line">LINE ID</Label>
                <Input
                  type="text"
                  id="line"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  placeholder="請輸入LINE ID"
                  readOnly={!!(userData?.lineId)}
                  className={userData?.lineId ? 'bg-gray-100' : ''}
                />
                {userData?.lineId && (
                  <p className="text-xs text-gray-500 mt-1">已從 LINE 登入資訊自動填入</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  type="text"
                  id="facebook"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="請輸入Facebook帳號或網址"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  type="text"
                  id="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="請輸入Instagram帳號"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="photo">上傳照片</Label>
            <Input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photo && (
              <img
                src={photo}
                alt="預覽"
                className="mt-2 rounded-md w-32 h-32 object-cover border"
              />
            )}
            {userData?.pictureUrl && photo === userData.pictureUrl && (
              <p className="text-xs text-gray-500 mt-1">已從 LINE 登入資訊自動填入頭像</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              預覽名片
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              建立名片
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;
