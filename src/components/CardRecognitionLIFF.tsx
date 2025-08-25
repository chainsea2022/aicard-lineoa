import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, CheckCircle, QrCode, FileImage, RefreshCw, Eye, Plus, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

// LIFF type declaration
declare global {
  interface Window {
    liff: any;
  }
}

interface CardRecognitionLIFFProps {
  onClose: () => void;
}

interface CardData {
  id?: number;
  name: string;
  phone: string;
  email: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  photo?: string;
  isDigitalCard?: boolean;
  confidence?: number;
}

interface RecognitionResult {
  type: 'electronic' | 'paper' | 'duplicate';
  data: CardData;
  similarity?: number;
  changes?: Array<{ field: string; oldValue: string; newValue: string; label: string }>;
  existingCard?: CardData;
}

const CardRecognitionLIFF: React.FC<CardRecognitionLIFFProps> = ({ onClose }) => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [scanMode, setScanMode] = useState<'electronic' | 'paper'>('electronic');
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        if (typeof window !== 'undefined' && window.liff) {
          await window.liff.init({
            liffId: 'your-liff-id'
          });
          setIsLiffReady(true);
        }
      } catch (error) {
        console.error('LIFF initialization failed:', error);
        setIsLiffReady(true);
      }
    };
    initializeLiff();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (cameraRef.current) {
        cameraRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      toast({
        title: "相機權限錯誤",
        description: "請允許使用相機功能",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const simulateRecognition = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      setScanProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Mock recognition results based on scan mode
    if (scanMode === 'electronic') {
      // Electronic card recognition
      const mockResult: RecognitionResult = {
        type: 'electronic',
        data: {
          name: '陳志明',
          phone: '0912-345-678',
          email: 'chen@example.com',
          company: 'AI科技股份有限公司',
          jobTitle: '技術總監',
          website: 'www.aitech.com',
          line: '@aitech',
          facebook: 'AITechOfficial',
          instagram: 'ai_tech_official',
          photo: '/placeholder.svg',
          isDigitalCard: true,
          confidence: 96
        }
      };
      setRecognitionResult(mockResult);
    } else {
      // Paper card recognition - simulate duplicate detection
      const existingCard = {
        id: 1,
        name: '林美玲',
        phone: '0923-456-789',
        email: 'lin@company.com',
        company: '創新設計有限公司',
        jobTitle: '設計師',
        isDigitalCard: false
      };

      const updatedCard = {
        ...existingCard,
        jobTitle: '資深設計師',
        phone: '0923-456-888'
      };

      const mockResult: RecognitionResult = {
        type: 'duplicate',
        data: updatedCard,
        similarity: 95,
        existingCard,
        changes: [
          { field: 'jobTitle', oldValue: '設計師', newValue: '資深設計師', label: '職稱' },
          { field: 'phone', oldValue: '0923-456-789', newValue: '0923-456-888', label: '電話' }
        ]
      };
      setRecognitionResult(mockResult);
    }

    setIsScanning(false);
    stopCamera();
  };

  const handleSaveCard = (storageLocation: 'digital' | 'contact') => {
    if (!recognitionResult) return;

    const customers = JSON.parse(localStorage.getItem('aile-customers') || '[]');
    const currentDate = new Date().toISOString();

    if (recognitionResult.type === 'duplicate' && recognitionResult.similarity! >= 90) {
      // Auto-apply cloud version for high similarity
      const existingIndex = customers.findIndex(c => c.id === recognitionResult.existingCard?.id);
      if (existingIndex !== -1) {
        customers[existingIndex] = {
          ...customers[existingIndex],
          ...recognitionResult.data,
          addedDate: customers[existingIndex].addedDate,
          notes: `${customers[existingIndex].notes || ''}\n${new Date().toLocaleDateString('zh-TW')} 自動同步雲端版本 (相似度: ${recognitionResult.similarity}%)`
        };
        
        toast({
          title: "自動同步完成",
          description: `相似度 ${recognitionResult.similarity}% ≥ 90%，已自動套用雲端版本`,
          duration: 4000
        });
      }
    } else {
      // Create new card
      const newCard = {
        id: Date.now(),
        ...recognitionResult.data,
        hasCard: recognitionResult.data.isDigitalCard,
        addedDate: currentDate,
        notes: storageLocation === 'digital' ? '電子名片掃描' : '紙本名片掃描',
        isDigitalCard: storageLocation === 'digital',
        relationshipStatus: 'collected' as const
      };
      customers.push(newCard);
    }

    localStorage.setItem('aile-customers', JSON.stringify(customers));
    
    // Trigger notification
    window.dispatchEvent(new CustomEvent('customerAddedNotification', {
      detail: {
        customerName: recognitionResult.data.name,
        action: storageLocation === 'digital' ? 'digital_card_scanned' : 'paper_card_scanned',
        isDigitalCard: storageLocation === 'digital',
        customer: recognitionResult.data
      }
    }));

    setShowSuccessScreen(true);
  };

  const handleOneClickSync = () => {
    if (!recognitionResult || recognitionResult.type !== 'duplicate') return;
    
    toast({
      title: "同步中...",
      description: "正在從雲端獲取最新資料",
      duration: 2000
    });

    setTimeout(() => {
      handleSaveCard(recognitionResult.data.isDigitalCard ? 'digital' : 'contact');
    }, 2000);
  };

  if (!isLiffReady) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">載入中...</p>
        </div>
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-recommendation-green mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">儲存成功！</h2>
            <p className="text-muted-foreground text-sm">
              {recognitionResult?.data.name} 已加入您的{recognitionResult?.data.isDigitalCard ? '電子名片夾' : '聯絡人清單'}
            </p>
          </div>
          
          <div className="bg-accent rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-medium text-accent-foreground mb-2">💡 儲存位置：</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-recommendation-green rounded-full"></div>
              <span className="text-sm text-accent-foreground">
                名片夾 → {recognitionResult?.data.isDigitalCard ? '電子名片' : '聯絡人'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={onClose} className="w-full">
              前往名片夾
            </Button>
            <Button 
              onClick={() => {
                setShowSuccessScreen(false);
                setRecognitionResult(null);
                setScanProgress(0);
              }} 
              variant="outline" 
              className="w-full"
            >
              繼續辨識
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-recommendation-green to-recommendation-green/80 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-2 h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-bold text-lg">名片辨識</h1>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            AI 識別
          </Badge>
        </div>
      </div>

      {/* Scan Mode Toggle */}
      <div className="p-4 bg-muted/30 border-b">
        <div className="flex space-x-2">
          <Button
            variant={scanMode === 'electronic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScanMode('electronic')}
            className="flex-1"
          >
            <QrCode className="w-4 h-4 mr-2" />
            電子名片
          </Button>
          <Button
            variant={scanMode === 'paper' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScanMode('paper')}
            className="flex-1"
          >
            <FileImage className="w-4 h-4 mr-2" />
            紙本名片
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!recognitionResult && !isScanning && (
          <>
            {/* Camera Preview */}
            <div className="bg-muted rounded-lg aspect-[4/3] flex items-center justify-center relative overflow-hidden">
              {stream ? (
                <video
                  ref={cameraRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-3">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground text-sm">
                    {scanMode === 'electronic' ? '對準 QR Code 或數位名片' : '對準紙本名片拍照'}
                  </p>
                </div>
              )}
              
              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recommendation-green mx-auto"></div>
                    <p className="text-sm font-medium">辨識中...</p>
                    <Progress value={scanProgress} className="w-32" />
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              {!stream ? (
                <Button onClick={startCamera} className="w-full h-12">
                  <Camera className="w-5 h-5 mr-2" />
                  開啟相機
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={simulateRecognition} 
                    className="w-full h-12 bg-recommendation-green hover:bg-recommendation-green/90"
                    disabled={isScanning}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {isScanning ? '辨識中...' : '開始辨識'}
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="w-full">
                    關閉相機
                  </Button>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-accent rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-accent-foreground">💡 辨識提示：</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 電子名片：掃描 QR Code 可獲得完整資訊</li>
                <li>• 紙本名片：請確保光線充足，名片內容清晰</li>
                <li>• 相似度 ≥ 90% 將自動同步雲端版本</li>
              </ul>
            </div>
          </>
        )}

        {/* Recognition Results */}
        {recognitionResult && !isScanning && (
          <div className="space-y-4">
            {/* Result Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">辨識結果</h3>
              {recognitionResult.data.confidence && (
                <Badge variant="secondary" className="bg-recommendation-green/10 text-recommendation-green">
                  信心度 {recognitionResult.data.confidence}%
                </Badge>
              )}
            </div>

            {/* Card Preview */}
            <div className="bg-card border rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  {recognitionResult.data.photo ? (
                    <img src={recognitionResult.data.photo} alt="頭像" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium text-muted-foreground">
                      {recognitionResult.data.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{recognitionResult.data.name}</h4>
                  <p className="text-sm text-muted-foreground">{recognitionResult.data.company}</p>
                  <p className="text-sm text-muted-foreground">{recognitionResult.data.jobTitle}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                {recognitionResult.data.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">電話：</span>
                    <span className="text-foreground">{recognitionResult.data.phone}</span>
                  </div>
                )}
                {recognitionResult.data.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">信箱：</span>
                    <span className="text-foreground">{recognitionResult.data.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Duplicate Detection */}
            {recognitionResult.type === 'duplicate' && (
              <div className="bg-unregistered-orange/10 border border-unregistered-orange/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-unregistered-orange" />
                  <h4 className="font-medium text-foreground">發現資料異動</h4>
                  <Badge variant="secondary" className="bg-unregistered-orange/10 text-unregistered-orange">
                    相似度 {recognitionResult.similarity}%
                  </Badge>
                </div>
                
                {recognitionResult.changes && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">變更項目：</p>
                    {recognitionResult.changes.map((change, index) => (
                      <div key={index} className="bg-background rounded p-2 text-sm">
                        <span className="font-medium">{change.label}：</span>
                        <span className="text-muted-foreground line-through">{change.oldValue}</span>
                        <span className="mx-2">→</span>
                        <span className="text-recommendation-green font-medium">{change.newValue}</span>
                      </div>
                    ))}
                  </div>
                )}

                {recognitionResult.similarity! >= 90 && (
                  <div className="bg-recommendation-green/10 border border-recommendation-green/20 rounded p-3">
                    <p className="text-sm text-recommendation-green font-medium">
                      🎯 相似度 ≥ 90%，建議自動套用雲端版本
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {recognitionResult.type === 'duplicate' && recognitionResult.similarity! >= 90 ? (
                <Button onClick={handleOneClickSync} className="w-full h-12 bg-recommendation-green hover:bg-recommendation-green/90">
                  <Zap className="w-5 h-5 mr-2" />
                  一鍵同步更新
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleSaveCard('digital')} 
                    variant="outline"
                    className="h-12"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    電子名片夾
                  </Button>
                  <Button 
                    onClick={() => handleSaveCard('contact')} 
                    className="h-12"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    聯絡人
                  </Button>
                </div>
              )}
              
              <Button 
                onClick={() => {
                  setRecognitionResult(null);
                  startCamera();
                }} 
                variant="ghost" 
                className="w-full"
              >
                重新辨識
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardRecognitionLIFF;