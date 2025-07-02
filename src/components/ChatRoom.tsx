import React, { useState, useEffect } from 'react';
import { Plus, X, User, Zap, Scan, Users, BarChart3, Calendar } from 'lucide-react';
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
  const [messages, setMessages] = useState([
    { id: 1, text: '歡迎使用 AILE！請點選下方圖文選單開始使用各項功能。', isBot: true, timestamp: new Date() }
  ]);
  const [customers, setCustomers] = useState<any[]>([]);

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
    <div className="flex flex-col h-screen w-full max-w-sm mx-auto bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="font-bold text-lg">AILE</h1>
            <p className="text-green-100 text-sm">智能名片助手</p>
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
            {/* Chat Messages - Takes remaining space above menu */}
            <div className="flex-1 p-4 overflow-y-auto pb-0 min-h-0">
              {!isMenuOpen && messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                      message.isBot
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('zh-TW', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar - Only show when menu is closed */}
            {!isMenuOpen && (
              <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="輸入訊息..."
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Menu Grid - Fixed at bottom like LINE */}
        {isMenuOpen && !activeView && (
          <div className="bg-white border-t border-gray-200 animate-fade-in flex-shrink-0">
            {/* + Button positioned at top-left of menu area */}
            <div className="relative p-4">
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="absolute -top-2 left-4 w-8 h-8 rounded-full bg-gray-500 hover:bg-gray-600 rotate-45 z-10 shadow-lg"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* Menu Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className="flex flex-col items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 bg-white border border-gray-100"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <item.icon className="w-6 h-6 text-white" />
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

        {/* Floating + Button - Show when menu is closed or view is active */}
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
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
              size="sm"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
