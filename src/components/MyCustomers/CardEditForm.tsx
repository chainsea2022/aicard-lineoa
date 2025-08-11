import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Customer } from './types';
import { toast } from '@/hooks/use-toast';

interface CardEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onSave: (updates: Partial<Customer>) => void;
}

export const CardEditForm: React.FC<CardEditFormProps> = ({
  isOpen,
  onClose,
  customer,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: customer.name || '',
    company: customer.company || '',
    jobTitle: customer.jobTitle || '',
    phone: customer.phone || '',
    email: customer.email || '',
    website: customer.website || '',
    line: customer.line || '',
    facebook: customer.facebook || '',
    instagram: customer.instagram || '',
    notes: customer.notes || ''
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const processFieldData = (field: keyof typeof formData, value: string): string => {
    // LINE 欄位允許完整 URL
    if (field === 'line') {
      if (value && validateUrl(value)) {
        return value; // 保持完整 URL
      }
      return value; // 非 URL 格式也允許儲存
    }
    
    // 其他欄位移除 URL 屬性，只保留純文字
    if (validateUrl(value)) {
      // 如果是 URL，提取 domain 或顯示文字部分
      try {
        const url = new URL(value);
        return url.hostname || value;
      } catch {
        return value;
      }
    }
    
    return value;
  };

  const handleSave = () => {
    // 處理各欄位數據
    const processedData: Partial<Customer> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) {
        const processedValue = processFieldData(key as keyof typeof formData, value.trim());
        (processedData as any)[key] = processedValue;
      }
    });

    onSave(processedData);
    toast({
      title: "儲存成功",
      description: "名片資料已更新",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            編輯名片資料
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本資料 */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-800">基本資料</h4>
            
            <div className="space-y-1">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="請輸入姓名"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="company">公司</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="請輸入公司名稱"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="jobTitle">職稱</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="請輸入職稱"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>
          </div>

          {/* 聯絡資訊 */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-800">聯絡資訊</h4>
            
            <div className="space-y-1">
              <Label htmlFor="phone">手機</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="請輸入手機號碼"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="請輸入電子信箱"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="website">網站</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="請輸入網站"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="line">LINE</Label>
              <Input
                id="line"
                value={formData.line}
                onChange={(e) => handleInputChange('line', e.target.value)}
                placeholder="請輸入 LINE ID 或完整連結"
              />
              <p className="text-xs text-green-600">僅支援貼上完整 LINE 加入連結</p>
            </div>
          </div>

          {/* 社群媒體 */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-800">社群媒體</h4>
            
            <div className="space-y-1">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                placeholder="請輸入 Facebook"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="請輸入 Instagram"
              />
              <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
            </div>
          </div>

          {/* 備註 */}
          <div className="space-y-1">
            <Label htmlFor="notes">備註</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="請輸入備註"
              rows={3}
            />
            <p className="text-xs text-gray-500">本欄位僅支援純文字輸入</p>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              儲存變更
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};