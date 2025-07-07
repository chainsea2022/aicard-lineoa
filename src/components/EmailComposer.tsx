import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface Recipient {
  id: string;
  name: string;
  email: string;
  company?: string;
  relationship?: string;
  source: 'customer' | 'contact' | 'manual';
}

interface EmailComposerProps {
  onClose: () => void;
  selectedRecipients?: Recipient[];
}

const EmailComposer: React.FC<EmailComposerProps> = ({ onClose, selectedRecipients = [] }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
    attachments: [] as File[]
  });

  const [showCc, setShowCc] = useState(false);

  // 自動填入選取的收件人電子信箱
  useEffect(() => {
    if (selectedRecipients.length > 0) {
      const primaryRecipient = selectedRecipients[0].email;
      const ccRecipients = selectedRecipients.slice(1).map(r => r.email).join(', ');
      
      setEmailData(prev => ({
        ...prev,
        to: primaryRecipient,
        cc: ccRecipients
      }));
      
      if (ccRecipients) {
        setShowCc(true);
      }
    }
  }, [selectedRecipients]);

  const handleSendEmail = () => {
    if (!emailData.to || !emailData.subject || !emailData.body) {
      toast({
        title: "請填寫必要資訊",
        description: "收件人、主旨和內容為必填項目。"
      });
      return;
    }

    // 模擬發送郵件
    toast({
      title: "郵件已發送！",
      description: `郵件已成功發送給 ${emailData.to}。`
    });

    // 重置表單
    setEmailData({
      to: '',
      cc: '',
      subject: '',
      body: '',
      attachments: []
    });
    
    onClose();
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEmailData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 shadow-lg">
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
            <h1 className="font-bold text-lg">發送信件</h1>
          </div>
          <Button
            onClick={handleSendEmail}
            className="bg-white/20 hover:bg-white/30 text-white"
            size="sm"
          >
            <Send className="w-4 h-4 mr-2" />
            發送
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 顯示已選取的收件人 */}
        {selectedRecipients.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>已選取收件人 ({selectedRecipients.length})</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedRecipients.map((recipient) => (
                <div key={recipient.id} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span>{recipient.name}</span>
                  <span className="text-xs text-purple-500">({recipient.email})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Templates */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-3 flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>快速範本</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailData(prev => ({
                ...prev,
                subject: '產品介紹 - AILE 電子名片',
                body: '您好，\n\n很高興與您認識，我想向您介紹我們的 AILE 電子名片服務...\n\n最佳祝福'
              }))}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              產品介紹
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailData(prev => ({
                ...prev,
                subject: '會議跟進',
                body: '您好，\n\n感謝您今天參與我們的會議，以下是會議要點總結...\n\n期待您的回覆'
              }))}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              會議跟進
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailData(prev => ({
                ...prev,
                subject: '感謝信件',
                body: '親愛的客戶，\n\n非常感謝您選擇我們的服務，您的信任對我們來說非常重要...\n\n謝謝您'
              }))}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              感謝信件
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailData(prev => ({
                ...prev,
                subject: '約會確認',
                body: '您好，\n\n這是關於我們下次會面的確認信件...\n\n期待與您見面'
              }))}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              約會確認
            </Button>
          </div>
        </div>

        {/* Email Form */}
        <div className="space-y-4">
          {/* Recipients */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="to">收件人 *</Label>
              <Input
                id="to"
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                placeholder="輸入收件人信箱"
              />
            </div>

            {/* CC Toggle */}
            {!showCc && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCc(true)}
                className="text-gray-500 hover:text-gray-700 p-0 h-auto"
              >
                + 新增副本收件人
              </Button>
            )}

            {showCc && (
              <div>
                <Label htmlFor="cc">副本收件人</Label>
                <Input
                  id="cc"
                  type="email"
                  value={emailData.cc}
                  onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                  placeholder="輸入副本收件人信箱"
                />
              </div>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">主旨 *</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="輸入郵件主旨"
            />
          </div>

          {/* Body */}
          <div>
            <Label htmlFor="body">內容 *</Label>
            <Textarea
              id="body"
              value={emailData.body}
              onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="輸入郵件內容..."
              rows={12}
              className="resize-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <Label>附件</Label>
            <div className="space-y-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileAttachment}
                  className="hidden"
                />
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Paperclip className="w-4 h-4 mr-2" />
                    選擇檔案
                  </span>
                </Button>
              </label>

              {emailData.attachments.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">已選擇的檔案：</p>
                  {emailData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 p-1 h-auto"
                      >
                        移除
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSendEmail}
            className="flex-1 bg-purple-500 hover:bg-purple-600"
          >
            <Send className="w-4 h-4 mr-2" />
            發送信件
          </Button>
        </div>

        {/* Email Statistics */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-3">本月信件統計</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">45</div>
              <div className="text-xs text-gray-600">已發送</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">38</div>
              <div className="text-xs text-gray-600">已讀取</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-xs text-gray-600">已回覆</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
