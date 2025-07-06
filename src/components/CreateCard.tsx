import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

interface CreateCardProps {
  onClose: () => void;
  onRegistrationComplete?: () => void;
}

const CreateCard: React.FC<CreateCardProps> = ({ onClose, onRegistrationComplete }) => {
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [line, setLine] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      title: "電子名片註冊成功！",
      description: "您的名片已經建立完成，獲得 100 點數獎勵！",
      className: "max-w-xs"
    });

    // Call registration complete callback
    if (onRegistrationComplete) {
      onRegistrationComplete();
    } else {
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
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

      {/* Form */}
      <div className="p-6">
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
            <Label htmlFor="name">姓名</Label>
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
            <Label htmlFor="phone">電話</Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="請輸入電話"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入Email"
            />
          </div>
          <div>
            <Label htmlFor="website">網站</Label>
            <Input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="請輸入網站"
            />
          </div>
          <div>
            <Label htmlFor="line">Line</Label>
            <Input
              type="text"
              id="line"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="請輸入Line"
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              type="text"
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="請輸入Facebook"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              type="text"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="請輸入Instagram"
            />
          </div>
          <div>
            <Label htmlFor="photo">照片</Label>
            <Input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photo && (
              <img
                src={photo}
                alt="Preview"
                className="mt-2 rounded-md w-32 h-32 object-cover"
              />
            )}
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            建立名片
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;
