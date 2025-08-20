import React, { useState } from 'react';
import { ArrowLeft, X, User, Coins, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmbeddedCardManagement from './EmbeddedCardManagement';
import EmbeddedPoints from './EmbeddedPoints';
import MyCustomers from './MyCustomers';

interface MemberInterfaceProps {
  onClose: () => void;
}

const MemberInterface: React.FC<MemberInterfaceProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('cards');

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-full overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">會員中心</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50 m-0 rounded-none border-b">
          <TabsTrigger value="cards" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>名片管理</span>
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center space-x-2">
            <Coins className="w-4 h-4" />
            <span>點數優惠</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>資料設定</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="cards" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-6">
              <EmbeddedCardManagement />
            </div>
          </TabsContent>
          
          <TabsContent value="points" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-6">
              <EmbeddedPoints />
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-0">
            <div className="h-full overflow-y-auto p-6">
              <MyCustomers onClose={() => {}} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MemberInterface;