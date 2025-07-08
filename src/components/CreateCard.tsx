import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete: () => void;
  userData: any;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose, onRegistrationComplete, userData }) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [line, setLine] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // 從 localStorage 載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setName(cardInfo.name || '');
      setCompanyName(cardInfo.companyName || '');
      setJobTitle(cardInfo.jobTitle || '');
      setPhone(cardInfo.phone || '');
      setEmail(cardInfo.email || '');
      setWebsite(cardInfo.website || '');
      setAddress(cardInfo.address || '');
      setBirthday(cardInfo.birthday || '');
      setLine(cardInfo.line || '');
      setFacebook(cardInfo.facebook || '');
      setInstagram(cardInfo.instagram || '');
      setPhoto(cardInfo.photo || null);
    }
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const handleSave = () => {
    // 儲存名片資料到 localStorage
    const cardData = {
      name,
      companyName,
      jobTitle,
      phone,
      email,
      website,
      address,
      birthday,
      line,
      facebook,
      instagram,
      photo
    };
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    toast({
      title: "名片已儲存",
      description: "您的電子名片已成功儲存。"
    });
    onRegistrationComplete();
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">編輯電子名片</h1>
        </div>
      </div>

      <div className="p-6">
        {/* 編輯表單 */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">基本資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 照片上傳 */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                {photo ? (
                  <AvatarImage src={photo} alt="照片" />
                ) : (
                  <AvatarFallback className="bg-gray-300 text-gray-600 font-bold text-xl">
                    {name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <Label htmlFor="photo-upload" className="text-sm font-medium text-gray-700">
                  更換照片
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                {photo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    移除
                  </Button>
                )}
              </div>
            </div>

            {/* 姓名 */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                姓名
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 公司名稱 */}
            <div>
              <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                公司名稱
              </Label>
              <Input
                id="company-name"
                type="text"
                placeholder="您的公司名稱"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* 職稱 */}
            <div>
              <Label htmlFor="job-title" className="text-sm font-medium text-gray-700">
                職稱
              </Label>
              <Input
                id="job-title"
                type="text"
                placeholder="您的職稱"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            {/* 電話 */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                電話
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="您的電話號碼"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="您的Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 網站 */}
            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                網站
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="您的網站"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {/* 地址 */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                地址
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="您的地址"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* 生日 */}
            <div>
              <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
                生日
              </Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            {/* LINE */}
            <div>
              <Label htmlFor="line" className="text-sm font-medium text-gray-700">
                LINE
              </Label>
              <Input
                id="line"
                type="text"
                placeholder="您的LINE ID"
                value={line}
                onChange={(e) => setLine(e.target.value)}
              />
            </div>

            {/* Facebook */}
            <div>
              <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">
                Facebook
              </Label>
              <Input
                id="facebook"
                type="text"
                placeholder="您的Facebook連結"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>

            {/* Instagram */}
            <div>
              <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                Instagram
              </Label>
              <Input
                id="instagram"
                type="text"
                placeholder="您的Instagram連結"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 名片預覽 */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">名片預覽</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-6 text-white">
              <div className="flex items-center space-x-4 mb-4">
                {photo && (
                  <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                    <AvatarImage src={photo} alt="照片" />
                    <AvatarFallback className="bg-white text-green-600 font-bold text-xl">
                      {name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{name || '您的姓名'}</h2>
                  {jobTitle && (
                    <p className="text-green-100 text-sm mb-1">{jobTitle}</p>
                  )}
                  {companyName && (
                    <p className="text-green-100 text-lg">{companyName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {phone && (
                  <div className="flex items-center">
                    <span className="mr-2">📱</span>
                    <span>{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span>{email}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center">
                    <span className="mr-2">🌐</span>
                    <span>{website}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 儲存按鈕 */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 text-lg font-semibold shadow-lg"
        >
          <Save className="w-5 h-5 mr-2" />
          儲存電子名片
        </Button>
      </div>
    </div>
  );
};

export default CreateCard;
