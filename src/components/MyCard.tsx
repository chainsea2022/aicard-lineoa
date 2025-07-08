import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Share2, QrCode, Award, User, Smartphone, LogOut, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CreateCard from './CreateCard';
import Points from './Points';
import OTPVerification from './OTPVerification';

interface MyCardProps {
  onClose: () => void;
}

const MyCard: React.FC<MyCardProps> = ({ onClose }) => {
  const [cardData, setCardData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [profileSettings, setProfileSettings] = useState({
    isPublicProfile: false,
    allowDirectContact: true
  });
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasExistingAccount, setHasExistingAccount] = useState(false);

  useEffect(() => {
    const savedCardData = localStorage.getItem('aile-card-data');
    const savedUserData = localStorage.getItem('aile-user-data');
    
    // 檢查是否有曾經註冊過的記錄
    const registrationHistory = localStorage.getItem('aile-registration-history');
    if (registrationHistory) {
      setHasExistingAccount(true);
    }
    
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setCardData(cardInfo);
      
      // 自動生成QR Code資料
      const qrInfo = `名片資訊
姓名: ${cardInfo.name || ''}
公司: ${cardInfo.companyName || ''}
電話: ${cardInfo.phone || ''}
Email: ${cardInfo.email || ''}
LINE: ${cardInfo.line || ''}
網站: ${cardInfo.website || ''}`;
      
      setQrCodeData(qrInfo);
      console.log('生成QR Code:', qrInfo);
    }
    
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }

    const savedSettings = localStorage.getItem('aile-profile-settings');
    if (savedSettings) {
      setProfileSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleVerificationComplete = (phone: string) => {
    // 手機驗證完成後創建用戶資料
    const phoneUser = {
      phone: phone,
      displayName: '',
      pictureUrl: null,
      loginMethod: 'phone',
      registeredAt: new Date(),
      isVerified: true
    };

    // 儲存用戶登入資訊和註冊歷史
    localStorage.setItem('aile-user-data', JSON.stringify(phoneUser));
    localStorage.setItem('aile-registration-history', JSON.stringify({ registeredAt: new Date(), method: 'phone' }));
    setUserData(phoneUser);
    setHasExistingAccount(true);
    
    // 創建預設名片資料（只包含手機號碼）
    const defaultCardData = {
      companyName: '',
      name: '',
      phone: phone,
      email: '',
      website: '',
      line: '',
      facebook: '',
      instagram: '',
      photo: null
    };
    
    // 儲存預設名片資料
    localStorage.setItem('aile-card-data', JSON.stringify(defaultCardData));
    setCardData(defaultCardData);
    
    // 生成QR Code資料
    const qrInfo = `名片資訊
姓名: ${defaultCardData.name || ''}
公司: ${defaultCardData.companyName || ''}
電話: ${defaultCardData.phone || ''}
Email: ${defaultCardData.email || ''}
LINE: ${defaultCardData.line || ''}
網站: ${defaultCardData.website || ''}`;
    
    setQrCodeData(qrInfo);
    
    // 標記為新用戶並關閉驗證界面
    setIsNewUser(true);
    setShowOTPVerification(false);
  };

  const handleLineLogin = () => {
    // 模擬 LINE 登入 - 生成模擬的 LINE 用戶資料
    const mockLineUser = {
      lineId: `line_${Math.random().toString(36).substr(2, 8)}`,
      displayName: '王小明',
      pictureUrl: null,
      loginMethod: 'line',
      registeredAt: new Date(),
      isVerified: true
    };

    // 儲存用戶登入資訊
    localStorage.setItem('aile-user-data', JSON.stringify(mockLineUser));
    setUserData(mockLineUser);
    
    // 檢查是否有現有名片資料
    const existingCardData = localStorage.getItem('aile-card-data');
    let cardInfo;
    
    if (existingCardData) {
      // 如果有現有名片資料，保留並更新LINE相關資訊
      cardInfo = JSON.parse(existingCardData);
      cardInfo.line = mockLineUser.lineId;
      if (!cardInfo.name && mockLineUser.displayName) {
        cardInfo.name = mockLineUser.displayName;
      }
      if (!cardInfo.photo && mockLineUser.pictureUrl) {
        cardInfo.photo = mockLineUser.pictureUrl;
      }
    } else {
      // 創建新的名片資料
      cardInfo = {
        companyName: '',
        name: mockLineUser.displayName,
        phone: '',
        email: '',
        website: '',
        line: mockLineUser.lineId,
        facebook: '',
        instagram: '',
        photo: mockLineUser.pictureUrl
      };
    }
    
    // 儲存名片資料
    localStorage.setItem('aile-card-data', JSON.stringify(cardInfo));
    setCardData(cardInfo);
    
    // 生成QR Code資料
    const qrInfo = `名片資訊
姓名: ${cardInfo.name || ''}
公司: ${cardInfo.companyName || ''}
電話: ${cardInfo.phone || ''}
Email: ${cardInfo.email || ''}
LINE: ${cardInfo.line || ''}
網站: ${cardInfo.website || ''}`;
    
    setQrCodeData(qrInfo);
  };

  const handleCardCreated = () => {
    setShowCreateCard(false);
    setIsNewUser(false);
    // 重新載入名片資料
    const savedCardData = localStorage.getItem('aile-card-data');
    if (savedCardData) {
      const cardInfo = JSON.parse(savedCardData);
      setCardData(cardInfo);
      
      // 重新生成QR Code資料
      const qrInfo = `名片資訊
姓名: ${cardInfo.name || ''}
公司: ${cardInfo.companyName || ''}
電話: ${cardInfo.phone || ''}
Email: ${cardInfo.email || ''}
LINE: ${cardInfo.line || ''}
網站: ${cardInfo.website || ''}`;
      
      setQrCodeData(qrInfo);
      console.log('生成QR Code:', qrInfo);
    }
  };

  const handleLogout = () => {
    // 清除所有用戶相關資料，但保留註冊歷史
    localStorage.removeItem('aile-card-data');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aile-profile-settings');
    
    // 重置狀態
    setCardData(null);
    setUserData(null);
    setQrCodeData('');
    setShowCreateCard(false);
    setShowPoints(false);
    setShowOTPVerification(false);
    setIsNewUser(false);
    setProfileSettings({
      isPublicProfile: false,
      allowDirectContact: true
    });
  };

  const generateQRCode = (data: string) => {
    // 創建簡單的QR Code視覺化
    const size = 8; // 8x8的簡化QR Code
    const squares = [];
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const isBlack = (i + j + data.length) % 3 === 0;
        squares.push(
          <div
            key={`${i}-${j}`}
            className={`w-3 h-3 ${isBlack ? 'bg-black' : 'bg-white'}`}
          />
        );
      }
    }
    
    return (
      <div className="grid grid-cols-8 gap-0 p-4 bg-white border-2 border-gray-300 rounded-lg">
        {squares}
      </div>
    );
  };

  if (showOTPVerification) {
    return <OTPVerification onClose={() => setShowOTPVerification(false)} onVerificationComplete={handleVerificationComplete} />;
  }

  if (showCreateCard) {
    return <CreateCard onClose={() => setShowCreateCard(false)} onRegistrationComplete={handleCardCreated} userData={userData} />;
  }

  if (showPoints) {
    return <Points onClose={() => setShowPoints(false)} />;
  }

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">
              {userData && cardData ? '我的電子名片' : hasExistingAccount ? '登入電子名片' : '快速註冊登入'}
            </h1>
          </div>
          {userData && cardData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-1" />
              登出
            </Button>
          )}
        </div>
      </div>

      {/* 如果沒有用戶資料或名片資料，顯示登入/註冊介面 */}
      {(!userData || !cardData) && (
        <div className="p-4">
          {/* 歡迎區塊 */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {hasExistingAccount ? '歡迎回來' : '歡迎使用電子名片'}
            </h2>
            <p className="text-gray-600 text-sm px-2">
              {hasExistingAccount ? '請選擇登入方式' : '建立您的專屬電子名片，輕鬆分享聯絡資訊'}
            </p>
          </div>

          {/* 登入/註冊選項 */}
          <div className="space-y-3 mb-6">
            {/* 首次註冊時只顯示手機註冊 */}
            {!hasExistingAccount && (
              <Card 
                className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setShowOTPVerification(true)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">手機號碼註冊</h3>
                      <p className="text-xs text-gray-600">使用手機號碼快速註冊，安全可靠</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 有帳號後顯示登入選項 */}
            {hasExistingAccount && (
              <>
                <Card 
                  className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => setShowOTPVerification(true)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">手機號碼登入</h3>
                        <p className="text-xs text-gray-600">使用註冊的手機號碼登入</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer"
                  onClick={handleLineLogin}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">LINE 登入</h3>
                        <p className="text-xs text-gray-600">使用LINE帳號快速登入</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* 註冊/登入按鈕 */}
          <div className="space-y-3">
            {!hasExistingAccount ? (
              <Button 
                onClick={() => setShowOTPVerification(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base font-medium shadow-lg"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                開始手機註冊
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setShowOTPVerification(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-base font-medium shadow-lg"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  手機號碼登入
                </Button>

                <Button 
                  onClick={handleLineLogin}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-base font-medium shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.2-.032.211 0 .391.089.513.25l2.441 3.315V8.108c0-.345.282-.63.63-.63.346 0 .627.285.627.63v4.771z"/>
                  </svg>
                  LINE 登入
                </Button>
              </>
            )}
          </div>

          {/* 功能說明 */}
          <Card className="mt-6 bg-blue-50 border border-blue-200">
            <CardContent className="p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">
                {hasExistingAccount ? '登入後您可以：' : '註冊後您可以：'}
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center">
                  <QrCode className="w-3 h-3 mr-2 flex-shrink-0" />
                  {hasExistingAccount ? '管理您的電子名片' : '建立專屬電子名片'}
                </li>
                <li className="flex items-center">
                  <Share2 className="w-3 h-3 mr-2 flex-shrink-0" />
                  快速分享聯絡資訊
                </li>
                <li className="flex items-center">
                  <Award className="w-3 h-3 mr-2 flex-shrink-0" />
                  {hasExistingAccount ? '查看會員點數' : '獲得會員點數獎勵'}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 服務條款 */}
          <div className="mt-4 text-center px-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              {hasExistingAccount ? '登入' : '註冊'}即表示您同意我們的
              <span className="text-blue-500 underline cursor-pointer mx-1">服務條款</span>
              和
              <span className="text-blue-500 underline cursor-pointer mx-1">隱私政策</span>
            </p>
          </div>
        </div>
      )}

      {/* 已登入用戶的名片管理介面 */}
      {userData && cardData && (
        <div className="p-4">
          {/* 新用戶提示 */}
          {isNewUser && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                🎉 註冊成功！您的電子名片已建立，點擊「編輯名片」完善您的資訊
              </p>
            </div>
          )}

          {/* 公開狀態顯示 */}
          <div className="mb-4">
            <Badge 
              variant={profileSettings.isPublicProfile ? "default" : "secondary"}
              className={`${
                profileSettings.isPublicProfile 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {profileSettings.isPublicProfile ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  公開名片
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  私人名片
                </>
              )}
            </Badge>
          </div>

          {/* 名片預覽 */}
          <Card className="mb-4 shadow-lg border-2 border-green-200">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-4 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  {cardData.photo && (
                    <Avatar className="w-12 h-12 border-2 border-white">
                      <AvatarImage src={cardData.photo} alt="照片" />
                      <AvatarFallback className="bg-white text-green-600 font-bold text-sm">
                        {cardData.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{cardData.name || '請編輯名片完善資訊'}</h2>
                    <p className="text-green-100 text-sm">{cardData.companyName || '尚未設定公司'}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  {cardData.phone && <div>📱 {cardData.phone}</div>}
                  {cardData.email && <div>✉️ {cardData.email}</div>}
                  {cardData.website && <div>🌐 {cardData.website}</div>}
                  {cardData.line && <div>💬 LINE: {cardData.line}</div>}
                  {!cardData.phone && !cardData.email && !cardData.website && !cardData.line && (
                    <div className="text-green-100 text-xs">請編輯名片新增聯絡資訊</div>
                  )}
                </div>

                {/* 社群資訊 */}
                {(cardData.facebook || cardData.instagram) && (
                  <div className="mt-3 pt-3 border-t border-green-300/50">
                    <div className="flex flex-wrap gap-2">
                      {cardData.facebook && (
                        <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                          <span className="mr-1">📘</span>
                          <span>FB: {cardData.facebook}</span>
                        </div>
                      )}
                      {cardData.instagram && (
                        <div className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                          <span className="mr-1">📷</span>
                          <span>IG: {cardData.instagram}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 自動展開的QR Code區塊 */}
          {qrCodeData && (
            <Card className="mb-4 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
                    <QrCode className="w-4 h-4 mr-2" />
                    我的名片 QR Code
                  </h3>
                  <div className="flex justify-center mb-3">
                    {generateQRCode(qrCodeData)}
                  </div>
                  <p className="text-xs text-gray-600">
                    掃描此QR Code即可獲得我的聯絡資訊
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 操作按鈕 */}
          <div className="space-y-3">
            <Button 
              onClick={() => setShowCreateCard(true)}
              className={`w-full text-white ${
                isNewUser 
                  ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isNewUser ? '完善名片資訊' : '編輯名片'}
            </Button>

            <Button 
              onClick={() => setShowPoints(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Award className="w-4 h-4 mr-2" />
              會員點數
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="border-gray-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300"
              >
                <QrCode className="w-4 h-4 mr-2" />
                下載 QR Code
              </Button>
            </div>
          </div>

          {/* 設定說明 */}
          <Card className="mt-6 bg-blue-50 border border-blue-200">
            <CardContent className="p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">名片公開說明</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 公開名片：其他用戶可以在智能推薦中找到您</li>
                <li>• 私人名片：僅限您主動分享的人可以查看</li>
                <li>• 可隨時在預覽模式中調整公開設定</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyCard;
