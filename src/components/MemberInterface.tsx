import React, { useState } from 'react';
import { X, User, CreditCard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardManagement from './CardManagement';
import Points from './Points';
import MemberPoints from './MemberPoints';

interface MemberInterfaceProps {
  onClose: () => void;
}

const MemberInterface: React.FC<MemberInterfaceProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">我的</h1>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="w-8 h-8 rounded-full hover:bg-gray-100 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger value="cards" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>名片管理</span>
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center space-x-2">
              <span className="text-yellow-500">🎁</span>
              <span>點數優惠</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>資料設定</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="cards" className="h-full mt-0">
              <CardManagement onClose={() => {}} />
            </TabsContent>

            <TabsContent value="points" className="h-full mt-0">
              <div className="h-full">
                <MemberPoints onClose={() => {}} />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="h-full mt-0">
              <div className="p-4 text-center text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">資料設定</h3>
                <p className="text-sm">個人資料設定功能即將推出</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberInterface;