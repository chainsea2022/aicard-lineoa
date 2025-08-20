import React, { useState } from 'react';
import { ArrowLeft, X, CreditCard, Coins, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardManagement from './CardManagement';
import MemberPoints from './MemberPoints';
import { ProfileSettings } from './MyCustomers/ProfileSettings';

interface MemberInterfaceProps {
  onClose: () => void;
}

const MemberInterface: React.FC<MemberInterfaceProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'card-management' | 'points' | 'settings'>('card-management');
  const [showSubComponent, setShowSubComponent] = useState(false);

  const handleTabChange = (tab: 'card-management' | 'points' | 'settings') => {
    setActiveTab(tab);
    setShowSubComponent(true);
  };

  const handleBackToTabs = () => {
    setShowSubComponent(false);
  };

  // If showing a sub-component, render it directly
  if (showSubComponent) {
    if (activeTab === 'card-management') {
      return <CardManagement onClose={handleBackToTabs} />;
    }
    if (activeTab === 'points') {
      return <MemberPoints onClose={handleBackToTabs} />;
    }
    if (activeTab === 'settings') {
      return <ProfileSettings onClose={handleBackToTabs} />;
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">會員</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 m-0 rounded-none border-b">
            <TabsTrigger 
              value="card-management" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <CreditCard className="w-4 h-4" />
              <span>名片管理</span>
            </TabsTrigger>
            <TabsTrigger 
              value="points" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <Coins className="w-4 h-4" />
              <span>點數優惠</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <Settings className="w-4 h-4" />
              <span>資料設定</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="card-management" className="mt-0 h-full">
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">名片管理</h3>
                <p className="text-gray-600 mb-6">管理您的電子名片，新增、編輯或分享名片</p>
                <Button 
                  onClick={() => handleTabChange('card-management')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                >
                  進入名片管理
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="points" className="mt-0 h-full">
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">點數優惠</h3>
                <p className="text-gray-600 mb-6">查看您的點數餘額、獲得點數方式和兌換優惠</p>
                <Button 
                  onClick={() => handleTabChange('points')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
                >
                  查看點數優惠
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0 h-full">
              <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">資料設定</h3>
                <p className="text-gray-600 mb-6">管理您的個人資料、隱私設定和通知偏好</p>
                <Button 
                  onClick={() => handleTabChange('settings')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                >
                  進入資料設定
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberInterface;