import React from 'react';
import { ArrowLeft, X, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Customer } from './types';

interface InvitationDialogProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
  onSendInvitation: () => void;
  onShareLine: () => void;
}

export const InvitationDialog: React.FC<InvitationDialogProps> = ({
  customer,
  open,
  onClose,
  onSendInvitation,
  onShareLine
}) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[375px] mx-auto h-full max-h-screen border-0 rounded-none">
        <div className="flex flex-col h-full bg-white">
          {/* Header - LIFF style */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-semibold text-lg">邀請建立電子名片</h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="p-1">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-6 space-y-6">
            {/* Invitation Message */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-orange-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-800">
                  您收到甲的電子名片註冊邀請！
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  立即加入 Aipower 名片人脈圈，<br />
                  開始建立人脈關係！
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">L</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{customer.name}</p>
                  {customer.lineId && (
                    <p className="text-sm text-gray-600">LINE ID: {customer.lineId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-auto">
              <Button 
                onClick={onSendInvitation}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base font-semibold"
              >
                立即建立電子名片
              </Button>
              
              <Button 
                onClick={onShareLine}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 py-3 text-base font-semibold"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享給 LINE 好友
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};