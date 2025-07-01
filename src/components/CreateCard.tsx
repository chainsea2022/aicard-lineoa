
import React, { useState } from 'react';
import { ArrowLeft, Upload, Eye, Save, User, Building, Phone, Mail, Globe, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CreateCardProps {
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

const CreateCard: React.FC<CreateCardProps> = ({ onClose }) => {
  const [step, setStep] = useState<'register' | 'create' | 'preview'>('register');
  const [isRegistered, setIsRegistered] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    companyName: '',
    name: '',
    phone: '',
    email: '',
    website: '',
    line: '',
    facebook: '',
    instagram: '',
    photo: null,
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setStep('create');
    toast({
      title: "註冊成功！",
      description: "現在您可以建立您的電子名片了。",
    });
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('aile-card-data', JSON.stringify(cardData));
    toast({
      title: "名片已儲存！",
      description: "您的電子名片已成功建立並儲存。",
    });
    onClose();
  };

  const renderRegisterForm = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">歡迎加入 AILE</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="register-email">電子信箱</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="輸入您的電子信箱"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="register-phone">手機號碼</Label>
          <Input
            id="register-phone"
            type="tel"
            placeholder="輸入您的手機號碼"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="register-name">姓名</Label>
          <Input
            id="register-name"
            type="text"
            placeholder="輸入您的姓名"
            required
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
          完成註冊
        </Button>
      </form>
    </div>
  );

  const renderCreateForm = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">建立電子名片</h2>
      
      {/* Photo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {cardData.photo ? (
            <img src={cardData.photo} alt="照片" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
            <Upload className="w-4 h-4" />
            <span className="text-sm">上傳照片</span>
          </div>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <Label>公司名稱</Label>
          <Input
            value={cardData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="輸入公司名稱"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>姓名</Label>
          <Input
            value={cardData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="輸入姓名"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>手機號碼</Label>
          <Input
            value={cardData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="輸入手機號碼"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>電子信箱</Label>
          <Input
            value={cardData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="輸入電子信箱"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>公司官網</Label>
          <Input
            value={cardData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.example.com"
            className="mt-1"
          />
        </div>
        
        <div className="space-y-3">
          <Label>社群設置</Label>
          <Input
            value={cardData.line}
            onChange={(e) => handleInputChange('line', e.target.value)}
            placeholder="LINE ID"
            className="mt-1"
          />
          <Input
            value={cardData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            placeholder="Facebook 連結"
            className="mt-1"
          />
          <Input
            value={cardData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder="Instagram 連結"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => setStep('preview')}
          variant="outline"
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          預覽
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          <Save className="w-4 h-4 mr-2" />
          儲存
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-center text-gray-800">名片預覽</h2>
      
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          {cardData.photo && (
            <img
              src={cardData.photo}
              alt="照片"
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          )}
          <div>
            <h3 className="text-xl font-bold">{cardData.name || '姓名'}</h3>
            <p className="text-blue-100">{cardData.companyName || '公司名稱'}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {cardData.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{cardData.phone}</span>
            </div>
          )}
          {cardData.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{cardData.email}</span>
            </div>
          )}
          {cardData.website && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{cardData.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => setStep('create')}
          variant="outline"
          className="flex-1"
        >
          編輯
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          <Save className="w-4 h-4 mr-2" />
          儲存名片
        </Button>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
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
      </div>

      {/* Content */}
      <div className="pb-20">
        {step === 'register' && !isRegistered && renderRegisterForm()}
        {step === 'create' && renderCreateForm()}
        {step === 'preview' && renderPreview()}
      </div>
    </div>
  );
};

export default CreateCard;
