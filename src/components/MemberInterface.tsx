import React, { useState } from 'react';
import { ArrowLeft, X, User, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardManagement from './CardManagement';
import Points from './Points';

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
            <h1 className="font-bold text-lg">會員</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-white">
          <TabsTrigger value="cards" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>名片管理</span>
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>點數優惠</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>資料設定</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="cards" className="h-full m-0">
            <CardManagement onClose={() => setActiveTab('cards')} />
          </TabsContent>
          
          <TabsContent value="points" className="h-full m-0">
            <Points onClose={() => setActiveTab('points')} />
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-4">
            <div className="text-center py-8">
              <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">資料設定</h3>
              <p className="text-gray-500">個人資料設定功能即將推出</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MemberInterface;