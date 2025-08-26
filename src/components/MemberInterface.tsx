import React from 'react';
import { ArrowLeft, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileSettings } from './MyCustomers/ProfileSettings';
interface MemberInterfaceProps {
  onClose: () => void;
}
const MemberInterface: React.FC<MemberInterfaceProps> = ({
  onClose
}) => {
  const handleLogout = () => {
    // 清除所有用戶相關資料
    localStorage.removeItem('aicard-user-registered');
    localStorage.removeItem('aile-card-data');
    localStorage.removeItem('aile-user-data');
    localStorage.removeItem('aicard-user-started-registration');

    // 觸發 Rich Menu 更新事件
    window.dispatchEvent(new CustomEvent('userLogout'));

    // 回到聊天室
    onClose();
  };
  return <div className="absolute inset-0 bg-white z-50 flex flex-col h-full overflow-hidden">{/* 改為absolute避免與ChatRoom衝突 */}
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg">資料設定</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20" title="登出">
              <LogOut className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Settings Content */}
      <div className="flex-1 overflow-hidden">
        <ProfileSettings onClose={onClose} />
      </div>
    </div>;
};
export default MemberInterface;