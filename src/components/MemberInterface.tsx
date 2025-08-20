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

          <div className="flex-1 overflow-hidden">
            <TabsContent value="card-management" className="mt-0 h-full">
              <CardManagement onClose={onClose} />
            </TabsContent>

            <TabsContent value="points" className="mt-0 h-full">
              <MemberPoints onClose={onClose} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 h-full">
              <ProfileSettings onClose={onClose} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberInterface;