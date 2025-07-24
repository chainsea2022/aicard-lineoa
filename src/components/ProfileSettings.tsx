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

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: false,
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
      description: "您的電子名片設定已更新。"
    });
    onClose();
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // 即時保存設定並顯示提示訊息
    const newSettings = {
      ...settings,
      [key]: value
    };
    localStorage.setItem('aile-profile-settings', JSON.stringify(newSettings));

    // 根據設定顯示相應的提示訊息
    if (key === 'receiveNotifications') {
      toast({
        title: value ? "已開啟通知" : "已關閉通知",
        description: value ? "當有用戶加入您的名片時，將在Aipower聊天室中彈跳通知提醒。" : "將不再接收用戶加入名片的通知提醒。"
      });
    } else {
      toast({
        title: "設定已儲存",
        description: "您的電子名片設定已更新。"
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 shadow-lg">
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
            <h1 className="font-bold text-lg">資料設定</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 公開設定 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Eye className="w-5 h-5 mr-2 text-green-600" />
              公開設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">公開電子名片</Label>
                <p className="text-xs text-gray-600">
                  您的名片將可被其他用戶在智能推薦中搜尋與發現
                </p>
              </div>
              <Switch
                checked={settings.isPublicProfile}
                onCheckedChange={(checked) => handleSettingChange('isPublicProfile', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">允許直接加入</Label>
                <p className="text-xs text-gray-600">
                  啟用後，其他用戶可以直接把您的電子名片存到他們的名片夾。未啟用時，對方必須等您同意後，才能收到您的電子名片
                </p>
              </div>
              <Switch
                checked={settings.allowDirectContact}
                onCheckedChange={(checked) => handleSettingChange('allowDirectContact', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 通知設定 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="w-5 h-5 mr-2 text-orange-600" />
              通知設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">接收通知</Label>
                <p className="text-xs text-gray-600">
                  您會收到所有關於電子名片、人脈互動、活動邀請和點數變動的系統通知
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
              <li>• 允許直接加入：控制其他用戶是否可以直接加入您的名片</li>
              <li>• 通知設定：管理您希望接收的通知類型，包含聊天室彈跳通知</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;