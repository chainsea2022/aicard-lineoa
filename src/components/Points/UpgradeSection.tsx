import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star, Info, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlanCard from './PlanCard';
import GiftPackage from './GiftPackage';

const UpgradeSection: React.FC = () => {
  const plans = [
    {
      type: 'free' as const,
      title: '新手方案',
      price: 'Free',
      features: [
        { name: '智慧人脈記錄', value: '1次免費，30點/張' },
        { name: '名片夾數量', value: '200張' },
        { name: '完整數據分析', value: '50點/次' },
        { name: '新增行程', value: '1次免費，30點/次' },
        { name: '語音記錄', value: '1次免費，50點/次' },
        { name: '發送信件', value: '1次免費，50點/次' }
      ],
      isCurrentPlan: true
    },
    {
      type: 'elite' as const,
      title: '菁英方案',
      price: '$399',
      yearlyPrice: '$4,500',
      features: [
        { name: '智慧人脈記錄', value: '10張' },
        { name: '名片夾數量', value: '500張' },
        { name: '完整數據分析', value: '解鎖' },
        { name: '新增行程', value: '10次' },
        { name: '語音記錄', value: '5次' },
        { name: '發送信件', value: '5次' }
      ]
    },
    {
      type: 'premium' as const,
      title: '首席方案',
      price: '$999',
      yearlyPrice: '$11,000',
      features: [
        { name: '智慧人脈記錄', value: '50張' },
        { name: '名片夾數量', value: '無上限' },
        { name: '完整數據分析', value: '解鎖' },
        { name: '新增行程', value: '30次' },
        { name: '語音記錄', value: '20次' },
        { name: '發送信件', value: '20次' }
      ]
    }
  ];

  const aiEcosystem = [
    {
      title: 'AiCard ｜智慧名片',
      description: '建立個人電子名片，串起你的人脈鏈',
      color: 'blue',
      buttons: ['👉 下載APP', '🔗【了解更多】'],
      features: [
        { name: '無限名片數量', locked: false },
        { name: '個人化主題', locked: true },
        { name: 'AI名片設計', locked: true },
        { name: 'AI人脈行程管理', locked: true },
        { name: '數據分析報告', locked: true },
        { name: '自動備份同步', locked: true }
      ]
    },
    {
      title: 'Aile｜商務對話助手',
      description: '無縫轉接、通路整合，打造專屬商務助手',
      color: 'green',
      buttons: ['👉 100點兌換試用 1 個月', '🔗【了解更多】']
    },
    {
      title: 'Aiwow｜集點商城',
      description: '點點累積、兌換好禮，打造品牌互動與消費循環',
      color: 'purple',
      buttons: ['👉 前往商城', '🔗【了解更多】']
    }
  ];

  return (
    <>
      <GiftPackage />

      {/* 方案卡片 */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          升級方案
        </h2>
        <div className="grid gap-4">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>

      {/* AI生態圈 */}
      <div className="mx-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-blue-600" />
          AI生態圈
        </h2>
        <div className="space-y-3">
          {aiEcosystem.map((item, index) => {
            const colorClasses = {
              blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', button: 'text-blue-600 border-blue-200 hover:bg-blue-50' },
              green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-900', button: 'text-green-600 border-green-200 hover:bg-green-50' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-900', button: 'text-purple-600 border-purple-200 hover:bg-purple-50' }
            };
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            
            return (
              <div key={index} className={`${colors.bg} border ${colors.border} rounded-xl p-4 shadow-sm`}>
                <h4 className={`font-semibold ${colors.text} mb-1 text-sm`}>{item.title}</h4>
                <p className="text-gray-600 mb-3 text-xs leading-relaxed">{item.description}</p>
                
                {/* 功能列表 - 僅 AiCard 顯示 */}
                {item.features && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {item.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          {feature.locked ? (
                            <Lock className="w-3 h-3 text-gray-400" />
                          ) : (
                            <Unlock className="w-3 h-3 text-green-500" />
                          )}
                          <span className={`text-xs ${feature.locked ? 'text-gray-500' : 'text-green-700 font-medium'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-800">升級解鎖更多功能</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        升級至付費方案，解鎖 AI 智慧設計、個人化主題、數據分析等進階功能
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {item.buttons.map((buttonText, btnIndex) => (
                    <Button 
                      key={btnIndex}
                      variant="outline" 
                      size="sm" 
                      className={`${colors.button} text-xs px-3 py-1.5 rounded-lg font-medium`}
                    >
                      {buttonText}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UpgradeSection;