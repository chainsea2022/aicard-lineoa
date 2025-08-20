import React, { useState } from 'react';
import { ArrowLeft, X, User, Coins, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardManagement from './CardManagement';
import Points from './Points';
import { ProfileSettings } from './MyCustomers/ProfileSettings';

interface MemberInterfaceProps {
  onClose: () => void;
}

const MemberInterface: React.FC<MemberInterfaceProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('card-management');

  const handleLogout = () => {
    // 清除用戶資料
    localStorage.removeItem('aile-card-data');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aile-profile-settings');
    localStorage.removeItem('aile-user-points');
    
    // 發送登出事件，讓應用回到註冊流程
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col h-full overflow-hidden">{/* 改為absolute避免與ChatRoom衝突 */}
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">會員</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white border-b border-gray-200 rounded-none h-auto">
            <TabsTrigger 
              value="card-management" 
              className="py-3 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <User className="w-4 h-4 mr-2" />
              名片管理
            </TabsTrigger>
            <TabsTrigger 
              value="points" 
              className="py-3 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <Coins className="w-4 h-4 mr-2" />
              點數優惠
            </TabsTrigger>
            <TabsTrigger 
              value="profile-settings" 
              className="py-3 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              資料設定
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="card-management" className="mt-0 h-full">
              <div className="h-full relative">
                <CardManagement onClose={() => setActiveTab('card-management')} />
              </div>
            </TabsContent>

            <TabsContent value="points" className="mt-0 h-full">
              <div className="h-full relative">
                <Points onClose={() => setActiveTab('points')} />
              </div>
            </TabsContent>

            <TabsContent value="profile-settings" className="mt-0 h-full">
              <div className="h-full relative">
                <ProfileSettings onClose={() => setActiveTab('profile-settings')} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberInterface;