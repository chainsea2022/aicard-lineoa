import React from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

interface FAQProps {
  onClose: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onClose }) => {
  const faqData = [
    {
      question: '如何建立我的電子名片？',
      answer: '點擊「註冊」按鈕，填寫基本資料即可建立您的專屬電子名片。完成後可隨時透過「我的名片」查看和編輯。'
    },
    {
      question: '如何與他人交換名片？',
      answer: '您可以透過掃描對方的 QR Code，或是直接分享您的名片連結給對方。雙方都會自動加入彼此的名片夾中。'
    },
    {
      question: '什麼是 AiPoint 點數？',
      answer: 'AiPoint 是我們的獎勵點數系統。您可以透過使用各項功能獲得點數，並用來兌換會員升級或其他優惠。'
    },
    {
      question: '如何管理我的名片夾？',
      answer: '進入「名片夾」可以查看所有收藏的名片，您可以為聯絡人新增備註、設定提醒，或是查看互動記錄。'
    },
    {
      question: '名片資料會保存多久？',
      answer: '您的名片資料會永久保存在我們的安全伺服器中。您隨時可以編輯或刪除您的資料。'
    },
    {
      question: '如何聯絡客服？',
      answer: '如有任何問題，請透過以下方式聯絡我們：\n• LINE: @aicard\n• Email: support@aicard.com\n• 客服電話: 02-1234-5678'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">常見問題</h1>
            <p className="text-sm text-gray-500">FAQ</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="w-8 h-8 rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-teal-600" />
            需要更多協助？
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
              LINE: @aicard
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-blue-500" />
              Email: support@aicard.com
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              客服電話: 02-1234-5678
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              客服時間：週一至週五 9:00-18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;