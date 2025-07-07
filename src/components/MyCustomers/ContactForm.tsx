
import React, { useState } from 'react';
import { X, Save, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Customer } from './types';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  editingCustomer?: Customer | null;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCustomer
}) => {
  const [formData, setFormData] = useState({
    name: editingCustomer?.name || '',
    phone: editingCustomer?.phone || '',
    email: editingCustomer?.email || '',
    company: editingCustomer?.company || '',
    jobTitle: editingCustomer?.jobTitle || '',
    website: editingCustomer?.website || '',
    line: editingCustomer?.line || '',
    facebook: editingCustomer?.facebook || '',
    instagram: editingCustomer?.instagram || '',
    notes: editingCustomer?.notes || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "請輸入姓名",
        description: "姓名為必填欄位",
        variant: "destructive"
      });
      return;
    }

    const newCustomer: Customer = {
      id: editingCustomer?.id || Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company,
      jobTitle: formData.jobTitle,
      website: formData.website,
      line: formData.line,
      facebook: formData.facebook,
      instagram: formData.instagram,
      photo: editingCustomer?.photo || '',
      hasCard: false,
      addedDate: editingCustomer?.addedDate || new Date().toISOString(),
      notes: formData.notes,
      tags: editingCustomer?.tags || ['手動建立'],
      relationshipStatus: editingCustomer?.relationshipStatus || 'collected',
      isDigitalCard: false, // Paper contact
      invitationSent: editingCustomer?.invitationSent || false,
      emailInvitationSent: editingCustomer?.emailInvitationSent || false
    };

    onSave(newCustomer);
    onClose();
    
    toast({
      title: editingCustomer ? "聯絡人已更新" : "聯絡人已建立",
      description: `${formData.name} 已${editingCustomer ? '更新' : '加入'}到您的聯絡人列表`
    });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      let importedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 2 && values[0]) {
          const customer: Customer = {
            id: Date.now() + i,
            name: values[0] || '',
            phone: values[1] || '',
            email: values[2] || '',
            company: values[3] || '',
            jobTitle: values[4] || '',
            website: '',
            line: '',
            facebook: '',
            instagram: '',
            photo: '',
            hasCard: false,
            addedDate: new Date().toISOString(),
            notes: '從 CSV 匯入',
            tags: ['CSV匯入'],
            relationshipStatus: 'collected',
            isDigitalCard: false,
            invitationSent: false,
            emailInvitationSent: false
          };
          
          onSave(customer);
          importedCount++;
        }
      }
      
      toast({
        title: "匯入完成",
        description: `成功匯入 ${importedCount} 個聯絡人`
      });
      
      onClose();
    };
    
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {editingCustomer ? '編輯聯絡人' : '新增聯絡人'}
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="請輸入姓名"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">電話</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="請輸入電話號碼"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="請輸入電子郵件"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">公司</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="請輸入公司名稱"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">職稱</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="請輸入職稱"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">網站</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="請輸入網站網址"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="line">LINE ID</Label>
            <Input
              id="line"
              value={formData.line}
              onChange={(e) => handleInputChange('line', e.target.value)}
              placeholder="請輸入 LINE ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="請輸入 Facebook"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="請輸入 Instagram"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">備註</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="請輸入備註"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {editingCustomer ? '更新' : '儲存'}
            </Button>
            
            {!editingCustomer && (
              <div className="relative">
                <Button type="button" variant="outline" className="px-3">
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="匯入 CSV 檔案"
                />
              </div>
            )}
          </div>

          {!editingCustomer && (
            <div className="text-xs text-gray-500 border-t pt-2">
              <p className="mb-1">CSV 匯入格式：姓名,電話,電子郵件,公司,職稱</p>
              <p>第一行為標題，從第二行開始匯入資料</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
