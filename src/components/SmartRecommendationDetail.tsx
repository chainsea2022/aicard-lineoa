import React from 'react';
import { ArrowLeft, X, Users, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Customer } from './MyCustomers/types';
import { getRandomProfessionalAvatar } from './MyCustomers/utils';

interface SmartRecommendationDetailProps {
  customer: Customer;
  onClose: () => void;
  onAddToFolder: (customerId: number) => void;
  onSkip: (customerId: number) => void;
}

export const SmartRecommendationDetail: React.FC<SmartRecommendationDetailProps> = ({
  customer,
  onClose,
  onAddToFolder,
  onSkip
}) => {
  // Mock recommendation reasons data
  const recommendationReasons = [
    {
      type: 'mutual_contacts',
      title: '共同聯絡人',
      description: '您們有 3 位共同聯絡人',
      details: ['李小美', '王大偉', '陳雅婷']
    },
    {
      type: 'meeting_history',
      title: '參與同個聚會',
      description: '曾參與同個商務聚會',
      details: ['2024年科技創新論壇', '台北創業交流會']
    },
    {
      type: 'company_connection',
      title: '產業關聯',
      description: '相關產業背景',
      details: ['同屬科技產業', '類似業務範疇']
    }
  ];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col h-full overflow-hidden" style={{
      maxWidth: '375px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-lg">智能推薦詳情</h2>
        <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <Card className="border-2 border-dashed border-muted-foreground bg-card">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={customer.photo || getRandomProfessionalAvatar(customer.id)}
                    alt={customer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-card-foreground">{customer.name}</h3>
                      {customer.jobTitle && (
                        <p className="text-muted-foreground">{customer.jobTitle}</p>
                      )}
                      {customer.company && (
                        <p className="text-muted-foreground">{customer.company}</p>
                      )}
                      {customer.phone && (
                        <p className="text-sm text-muted-foreground mt-1">{customer.phone}</p>
                      )}
                      {customer.email && (
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      )}
                    </div>
                    <Badge className="bg-recommendation-green text-white" variant="secondary">
                      智能推薦
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation Reasons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-card-foreground">推薦原因</h4>
            
            {recommendationReasons.map((reason, index) => (
              <Card key={index} className="border border-muted bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      {reason.type === 'mutual_contacts' && <Users className="w-5 h-5 text-muted-foreground" />}
                      {reason.type === 'meeting_history' && <Calendar className="w-5 h-5 text-muted-foreground" />}
                      {reason.type === 'company_connection' && <Building className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-card-foreground">{reason.title}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{reason.description}</p>
                      
                      {reason.details && reason.details.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {reason.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              {detail}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border bg-muted/30 flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onSkip(customer.id)}
        >
          略過
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={() => onAddToFolder(customer.id)}
        >
          加入名片夾
        </Button>
      </div>
    </div>
  );
};