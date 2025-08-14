import React from 'react';
import { X, MessageSquare, Phone, Mail, Send, Share, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface InvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  onInvitationSent?: () => void;
}

const InvitationDialog: React.FC<InvitationDialogProps> = ({ isOpen, onClose, customerName, onInvitationSent }) => {
  const invitationLink = "https://aicard.app/invite?ref=abc123";
  const invitationMessage = `嗨！我想邀請你加入我的電子名片夾，請點擊以下連結完成註冊：${invitationLink}`;

  const handleSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(invitationMessage)}`;
    window.open(smsUrl, '_blank');
    onInvitationSent?.();
    toast({
      title: "已開啟簡訊",
      description: "簡訊應用程式已開啟",
      className: "max-w-[280px] mx-auto"
    });
  };

  const handleEmail = () => {
    const subject = "邀請加入電子名片夾";
    const body = `親愛的 ${customerName}，\n\n${invitationMessage}\n\n謝謝！`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
    onInvitationSent?.();
    toast({
      title: "已開啟郵件",
      description: "電子郵件應用程式已開啟",
      className: "max-w-[280px] mx-auto"
    });
  };

  const handleLINE = () => {
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(invitationMessage)}`;
    window.open(lineUrl, '_blank');
    onInvitationSent?.();
    toast({
      title: "已開啟 LINE",
      description: "LINE 應用程式已開啟",
      className: "max-w-[280px] mx-auto"
    });
  };

  const handleMessenger = () => {
    const messengerUrl = `fb-messenger://share?text=${encodeURIComponent(invitationMessage)}`;
    window.open(messengerUrl, '_blank');
    onInvitationSent?.();
    toast({
      title: "已開啟 Messenger",
      description: "Messenger 應用程式已開啟",
      className: "max-w-[280px] mx-auto"
    });
  };

  const handleInstagram = () => {
    navigator.clipboard.writeText(invitationLink);
    onInvitationSent?.();
    toast({
      title: "連結已複製",
      description: "請貼至 Instagram 限時動態、貼文或私訊",
      className: "max-w-[280px] mx-auto"
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    onInvitationSent?.();
    toast({
      title: "連結已複製",
      description: "邀請連結已複製到剪貼簿",
      className: "max-w-[280px] mx-auto"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">邀請 {customerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button
            variant="outline"
            className="w-full justify-start space-x-3"
            onClick={handleSMS}
          >
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span>簡訊（SMS）</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start space-x-3"
            onClick={handleEmail}
          >
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Email</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start space-x-3"
            onClick={handleLINE}
          >
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span>LINE</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start space-x-3"
            onClick={handleMessenger}
          >
            <Send className="w-5 h-5 text-blue-500" />
            <span>Messenger</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start space-x-3"
            onClick={handleInstagram}
          >
            <Share className="w-5 h-5 text-pink-500" />
            <span>Instagram</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start space-x-3"
            onClick={handleCopyLink}
          >
            <Copy className="w-5 h-5 text-gray-600" />
            <span>複製連結</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationDialog;