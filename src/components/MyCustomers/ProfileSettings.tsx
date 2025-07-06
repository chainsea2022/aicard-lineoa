
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: true,
    showPhoneNumber: true,
    showLineId: true,
    showEmail: true,
    receiveNotifications: true
  });

  useEffect(() => {
    // 載入現有設定
    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('aile-profile-settings', JSON.stringify(settings));
    toast({
      title: "設定已儲存",
      description: "您的電子名片公開設定已更新。"
    });
    onClose();
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
            <h1 className="font-bold text-lg">電子名片公開設定</h1>
          </div>
          <Button
            onClick={handleSaveSettings}
            className="bg-white/20 hover:bg-white/30 text-white"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            儲存
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 公開設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Eye className="w-5 h-5 mr-2" />
              公開設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">公開電子名片</Label>
                <p className="text-xs text-gray-600">
                  開啟後，其他人可以在智能推薦中找到您的名片
                </p>
              </div>
              <Switch
                checked={settings.isPublicProfile}
                onCheckedChange={(checked) => handleSettingChange('isPublicProfile', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">允許直接聯繫</Label>
                <p className="text-xs text-gray-600">
                  關閉後，需要您同意才能與您聯繫
                </p>
              </div>
              <Switch
                checked={settings.allowDirectContact}
                onCheckedChange={(checked) => handleSettingChange('allowDirectContact', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 聯絡資訊顯示 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="w-5 h-5 mr-2" />
              聯絡資訊顯示
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">顯示電話號碼</Label>
              <Switch
                checked={settings.showPhoneNumber}
                onCheckedChange={(checked) => handleSettingChange('showPhoneNumber', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">顯示 LINE ID</Label>
              <Switch
                checked={settings.showLineId}
                onCheckedChange={(checked) => handleSettingChange('showLineId', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">顯示 Email</Label>
              <Switch
                checked={settings.showEmail}
                onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 通知設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="w-5 h-5 mr-2" />
              通知設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">接收加入通知</Label>
                <p className="text-xs text-gray-600">
                  當有人加入您的名片時接收通知
                </p>
              </div>
              <Switch
                checked={settings.receiveNotifications}
                onCheckedChange={(checked) => handleSettingChange('receiveNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 說明區塊 */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">設定說明</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 公開電子名片：開啟後其他用戶可以在智能推薦中找到您</li>
              <li>• 允許直接聯繫：關閉後需要您的同意才能聯繫</li>
              <li>• 聯絡資訊顯示：控制哪些聯絡方式對其他人可見</li>
              <li>• 通知設定：管理您希望接收的通知類型</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
