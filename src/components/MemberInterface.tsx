import React, { useState } from 'react';
import { X, Users, Coins, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardManagement from './CardManagement';
import Points from './Points';

interface MemberInterfaceProps {
  onClose: () => void;
}

const ProfileSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">資料設定</h3>
        <p className="text-sm text-gray-600">管理您的個人資料和帳戶設定</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">個人資料</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div>姓名：陳先生</div>
            <div>電話：0912-345-678</div>
            <div>Email：example@email.com</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">帳戶設定</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div>會員等級：一般會員</div>
            <div>註冊日期：2024-01-15</div>
            <div>最後登入：2024-01-20</div>
          </div>
        </div>

        <Button className="w-full" variant="outline">
          編輯個人資料
        </Button>
      </div>
    </div>
  );
};

const MemberInterface: React.FC<MemberInterfaceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-800">會員</h1>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="w-8 h-8 rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="card-management" className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 m-4 rounded-lg">
            <TabsTrigger value="card-management" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              名片管理
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              點數優惠
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              資料設定
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card-management" className="h-full mt-0 p-0">
            <div className="h-full overflow-auto">
              <CardManagement onClose={onClose} />
            </div>
          </TabsContent>

          <TabsContent value="points" className="h-full mt-0 p-0">
            <div className="h-full overflow-auto">
              <Points onClose={onClose} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="h-full mt-0 p-0">
            <div className="h-full overflow-auto">
              <ProfileSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberInterface;