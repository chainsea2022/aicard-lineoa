
import React, { useState, useEffect } from 'react';
import { Plus, X, User, Zap, Scan, Users, BarChart3, Calendar, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateCard from './CreateCard';
import MyCard from './MyCard';
import Scanner from './Scanner';
import MyCustomers from './MyCustomers';
import Analytics from './Analytics';
import Schedule from './Schedule';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const menuItems: MenuItem[] = [
  { id: 'create-card', title: '建立電子名片', icon: User, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { id: 'my-card', title: '我的電子名片', icon: Zap, color: 'bg-gradient-to-br from-green-500 to-green-600' },
  { id: 'scanner', title: '掃描', icon: Scan, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { id: 'customers', title: '我的客戶', icon: Users, color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { id: 'analytics', title: '數據分析', icon: BarChart3, color: 'bg-gradient-to-br from-red-500 to-red-600' },
  { id: 'schedule', title: '行程管理', icon: Calendar, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
];

const ChatRoom = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '歡迎使用 AILE！請點選下方圖文選單開始使用各項功能。', isBot: true, timestamp: new Date() }
  ]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // 監聽客戶加入事件
    const handleCustomerAdded = (event: CustomEvent) => {
      const newCustomer = event.detail;
      
      // 添加新客戶到列表
      setCustomers(prev => [...prev, newCustomer]);
      
      // 添加聊天通知
      const customerTypeText = newCustomer.isAileUser ? 
        `${newCustomer.name} (Aile 用戶) 已加入您的客戶列表！` : 
        `${newCustomer.name} 已加入您的客戶列表！`;
      
      const newMessage = {
        id: Date.now(),
        text: `🎉 ${customerTypeText}`,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
    };

    window.addEventListener('customerScannedCard', handleCustomerAdded as EventListener);
    
    return () => {
      window.removeEventListener('customerScannedCard', handleCustomerAdded as EventListener);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputText,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      
      // 模擬機器人回應
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: '收到您的訊息！如需使用功能請點選下方選單。',
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveView(itemId);
    setIsMenuOpen(false);
  };

  const handleCloseView = () => {
    setActiveView(null);
    setIsMenuOpen(true);
  };

  const handleCustomerAdded = (customer: any) => {
    setCustomers(prev => [...prev, customer]);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'create-card':
        return <CreateCard onClose={handleCloseView} />;
      case 'my-card':
        return <MyCard onClose={handleCloseView} onCustomerAdded={handleCustomerAdded} />;
      case 'scanner':
        return <Scanner onClose={handleCloseView} />;
      case 'customers':
        return <MyCustomers onClose={handleCloseView} customers={customers} onCustomersUpdate={setCustomers} />;
      case 'analytics':
        return <Analytics onClose={handleCloseView} />;
      case 'schedule':
        return <Schedule onClose={handleCloseView} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white relative overflow-hidden" style={{ maxWidth: '375px', margin: '0 auto' }}>
      {/* Header - LINE style */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h1 className="font-bold text-base">Aipower</h1>
            <p className="text-green-100 text-xs">名片人脈圈</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full min-h-0">
        {activeView ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {renderActiveView()}
          </div>
        ) : (
          <>
            {/* Chat Messages Area - LINE style background */}
            <div className="flex-1 overflow-y-auto px-3 py-2 bg-gray-50" style={{ 
              backgroundImage: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}>
              <div className="space-y-3 pb-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="flex items-end space-x-1 max-w-[85%]">
                      {message.isBot && (
                        <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mb-1 flex-shrink-0">
                          <Zap className="w-3 h-3 text-gray-600" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div
                          className={`px-3 py-2 rounded-2xl shadow-sm max-w-full ${
                            message.isBot
                              ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                              : 'bg-green-500 text-white rounded-br-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{message.text}</p>
                        </div>
                        <p className={`text-xs mt-1 px-1 ${message.isBot ? 'text-gray-500' : 'text-gray-500 text-right'}`}>
                          {message.timestamp.toLocaleTimeString('zh-TW', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Bar - LINE style */}
            {!isMenuOpen && !activeView && (
              <div className="bg-white border-t border-gray-200 px-3 py-2 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 border border-gray-200">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="請輸入訊息..."
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed p-0 flex-shrink-0"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Menu Grid - LINE style bottom menu */}
        {isMenuOpen && !activeView && (
          <div className="bg-white border-t border-gray-200 flex-shrink-0">
            <div className="px-3 py-3">
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="w-6 h-6 rounded-full bg-gray-400 hover:bg-gray-500 rotate-45 mb-3 ml-1"
                size="sm"
              >
                <X className="w-3 h-3" />
              </Button>
              
              {/* Menu Grid - 3x2 layout for mobile */}
              <div className="grid grid-cols-3 gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className="flex flex-col items-center p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                  >
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium text-center leading-tight">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating + Button - LINE style */}
        {(!isMenuOpen || activeView) && (
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              onClick={() => {
                if (activeView) {
                  handleCloseView();
                } else {
                  setIsMenuOpen(true);
                }
              }}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg active:scale-95 transition-transform"
              size="sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
