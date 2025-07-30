
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Users, 
  Building, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Lightbulb,
  ArrowLeft,
  Clock,
  Globe,
  User,
  Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Customer } from './types';

interface SmartRelationshipAnalysisProps {
  customer: Customer;
  onClose: () => void;
}

export const SmartRelationshipAnalysis: React.FC<SmartRelationshipAnalysisProps> = ({
  customer,
  onClose
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const generateAnalysis = () => {
    setIsAnalyzing(true);
    
    // 模擬分析過程
    setTimeout(() => {
      const mockAnalysis = {
        relationshipSummary: {
          type: '業務合作夥伴',
          strength: '中度',
          mutualConnections: ['張經理', '李總監'],
          businessInteractions: ['產品討論', '合約洽談'],
          socialInteractions: ['LinkedIn互動', '產業活動']
        },
        backgroundContext: {
          companyInfo: {
            name: customer.company || '未知公司',
            industry: '科技業',
            size: '中型企業 (100-500人)',
            recentNews: ['獲得新一輪融資', '推出新產品線']
          },
          personalProfile: {
            role: customer.jobTitle || '業務經理',
            experience: '5-8年相關經驗',
            interests: ['數位轉型', '企業解決方案'],
            recentActivity: ['參與產業論壇', '發表專業文章']
          }
        },
        interactionHistory: [
          {
            date: '2024-01-15',
            type: '會議',
            topic: '產品需求討論',
            outcome: '初步合作意向'
          },
          {
            date: '2024-01-08',
            type: '訊息',
            topic: '技術問題諮詢',
            outcome: '提供解決方案'
          },
          {
            date: '2023-12-20',
            type: '活動',
            topic: '產業展覽會面',
            outcome: '交換名片'
          }
        ],
        nextMeetingTopics: [
          {
            category: '產業新聞',
            topic: 'AI技術在企業應用的最新趋勢',
            relevance: '高度相關'
          },
          {
            category: '公司動態',
            topic: '貴公司新產品線的市場反響',
            relevance: '直接相關'
          },
          {
            category: '上次互動',
            topic: '之前討論的技術方案實施進度',
            relevance: '延續話題'
          }
        ],
        conversationStarters: [
          '聽說貴公司最近在AI領域有新的突破，能分享一些見解嗎？',
          '上次您提到的數位轉型計畫，現在進展如何？',
          '張經理最近也在關注這個話題，你們有機會可以交流',
          '看到您在LinkedIn上分享的文章很有見地'
        ]
      };
      
      setAnalysisData(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  // 組件掛載時自動開始分析
  useEffect(() => {
    generateAnalysis();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button onClick={onClose} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="font-semibold text-base text-gray-800">智慧人脈分析</h3>
            <p className="text-sm text-gray-600">{customer.name}</p>
          </div>
        </div>
        <Brain className="w-6 h-6 text-purple-600" />
      </div>

      {isAnalyzing && (
        <Card className="border-2 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <h4 className="font-semibold text-gray-800 mb-2">智慧分析進行中</h4>
            <p className="text-sm text-gray-600">
              正在分析您與 {customer.name} 的關係脈絡...
            </p>
          </CardContent>
        </Card>
      )}

      {analysisData && (
        <div className="space-y-4">
          {/* 關係摘要 */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <Handshake className="w-4 h-4 mr-2 text-blue-600" />
                關係摘要
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">關係類型：</span>
                  <Badge variant="secondary">{analysisData.relationshipSummary.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">關係強度：</span>
                  <Badge variant="outline">{analysisData.relationshipSummary.strength}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">共同聯絡人：</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {analysisData.relationshipSummary.mutualConnections.map((connection: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {connection}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 背景脈絡 */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <Building className="w-4 h-4 mr-2 text-green-600" />
                背景脈絡
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">公司資訊</h5>
                  <div className="bg-gray-50 rounded p-2 space-y-1">
                    <div>{analysisData.backgroundContext.companyInfo.name} · {analysisData.backgroundContext.companyInfo.industry}</div>
                    <div className="text-gray-600">{analysisData.backgroundContext.companyInfo.size}</div>
                    <div className="text-xs text-blue-600">
                      最新動態: {analysisData.backgroundContext.companyInfo.recentNews.join('、')}
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-1">個人資訊</h5>
                  <div className="bg-gray-50 rounded p-2 space-y-1">
                    <div>{analysisData.backgroundContext.personalProfile.role} · {analysisData.backgroundContext.personalProfile.experience}</div>
                    <div className="text-xs text-green-600">
                      專業興趣: {analysisData.backgroundContext.personalProfile.interests.join('、')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 互動紀錄 */}
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-orange-600" />
                互動紀錄
              </h4>
              <div className="space-y-2">
                {analysisData.interactionHistory.map((interaction: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{interaction.topic}</span>
                      <span className="text-xs text-gray-500">{formatDate(interaction.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Badge variant="outline" className="text-xs">{interaction.type}</Badge>
                      <span>{interaction.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 下次見面話題建議 */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
                話題建議
              </h4>
              <div className="space-y-2">
                {analysisData.nextMeetingTopics.map((topic: any, index: number) => (
                  <div key={index} className="bg-purple-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{topic.topic}</span>
                      <Badge variant="secondary" className="text-xs">{topic.category}</Badge>
                    </div>
                    <div className="text-xs text-purple-600">{topic.relevance}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 開場白建議 */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                開場白建議
              </h4>
              <div className="space-y-2">
                {analysisData.conversationStarters.map((starter: string, index: number) => (
                  <div key={index} className="bg-yellow-50 rounded p-3 text-sm border border-yellow-200">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{starter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 操作按鈕 */}
          <div className="flex space-x-2">
            <Button 
              onClick={generateAnalysis}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Brain className="w-3 h-3 mr-1" />
              重新分析
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Calendar className="w-3 h-3 mr-1" />
              安排會面
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
