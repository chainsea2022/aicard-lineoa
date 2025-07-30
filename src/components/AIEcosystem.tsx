import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AIEcosystem: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          AI生態圈方案
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Aipower 名片夾 */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Aipower ｜名片夾</h4>
          <p className="text-sm text-gray-600 mb-3">建立個人電子名片，串起你的人脈鏈</p>
          <div className="flex space-x-3">
            <Button size="sm" variant="outline">👉 下載APP</Button>
            <Button size="sm" variant="outline">🔗 了解更多</Button>
          </div>
        </div>

        {/* Aile 商務對話助手 */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Aile｜商務對話助手</h4>
          <p className="text-sm text-gray-600 mb-3">無縫轉接、通路整合，打造專屬商務助手</p>
          <div className="flex space-x-3">
            <Button size="sm" variant="outline">👉 100點兌換試用 1 個月</Button>
            <Button size="sm" variant="outline">🔗 了解更多</Button>
          </div>
        </div>

        {/* Aiwow 集點商城 */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Aiwow｜集點商城</h4>
          <p className="text-sm text-gray-600 mb-3">點點累積、兌換好禮，打造品牌互動與消費循環。</p>
          <div className="flex space-x-3">
            <Button size="sm" variant="outline">👉 前往商城</Button>
            <Button size="sm" variant="outline">🔗 了解更多</Button>
          </div>
        </div>

        {/* 兑點規則 */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">兑點規則</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span>•</span>
              <span>免費獲得點數：2年有效期</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>•</span>
              <span>會員購買點數：永久有效</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>•</span>
              <span>點數不可轉讓給其他用戶</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>•</span>
              <span>已兌換之商品或服務不可退換</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>•</span>
              <span>點數使用與兌換規則依官方公告為準，若有變動以最新公告為依</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEcosystem;