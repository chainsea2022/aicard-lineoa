import React from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X, MessageCircle, Phone, Mail, HelpCircle, Download, Smartphone } from 'lucide-react';

interface FAQProps {
  onClose: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onClose }) => {
  const faqCategories = [
    {
      title: "註冊與登入",
      questions: [
        {
          question: "Q1. 如何註冊 AiCard APP？",
          answer: "開啟 APP 或 LINE OA，點擊「立即註冊」，依指示完成 LINE 登入與手機 OTP 驗證，即可完成註冊並建立您的第一張電子名片。"
        },
        {
          question: "Q2. 如果忘記密碼或更換手機號碼，該怎麼辦？",
          answer: "AiCard 採 LINE 授權登入、手機 OTP 驗證 及 Email 驗證 機制，無需設定或重設密碼。 忘記密碼：直接使用相同 LINE 帳號登入，完成手機 OTP 及 Email 驗證即可。   更換手機號碼：請至「設定 > 資料設定」更新手機號碼，並重新進行 OTP 驗證；完成後，系統會自動同步驗證您原有的 Email 資料。   更換 Email：若需變更 Email，請在「設定 > 資料設定」中輸入新郵箱並完成 Double Opt-In（點擊驗證信中的連結）流程。"
        },
        {
          question: "Q3. 我需要下載 APP 才能註冊嗎？",
          answer: "不一定。首次可直接透過 LINE OA 完成註冊，但若要使用完整功能（如數據分析、行程管理進階功能），建議下載 APP 以獲得完整體驗。"
        }
      ]
    },
    {
      title: "電子名片管理",
      questions: [
        {
          question: "Q4. 我可以建立多張電子名片嗎？",
          answer: "可以，AiCard 支援多張名片管理。第一張為主卡片不可刪除，其餘卡片可自由新增、編輯與刪除。"
        },
        {
          question: "Q5. 如何分享我的電子名片？",
          answer: "您可透過 LINE Flex Message 分享 QR Code，或於 APP 首頁點擊「分享名片」按鈕，快速生成分享連結或下載 PNG 檔案。"
        },
        {
          question: "Q6. 可以自訂電子名片的背景風格嗎？",
          answer: "可以。在「設定 > 我的名片」內選擇「背景樣式」，可套用系統預設主題或自訂圖片，並自動同步至分享版面與下載 QR Code 圖檔。"
        }
      ]
    },
    {
      title: "名片夾與聯絡人",
      questions: [
        {
          question: "Q7. 如何將新朋友加入我的名片夾？",
          answer: "透過掃描 QR Code、NFC 感應、Flex Message 點擊或邀請註冊連結即可。對方同意後，名片將同步新增至「我的名片夾」列表。"
        },
        {
          question: "Q8. 我的名片夾顯示「尚未成為會員」，代表什麼意思？",
          answer: "這表示該聯絡人尚未完成電子名片註冊，您可以透過 LINE 邀請訊息提醒對方完成註冊。"
        },
        {
          question: "Q9. 如何使用標籤整理名片？",
          answer: "在名片詳細頁面新增或刪除標籤，標籤將同步顯示於篩選區，方便快速搜尋與分類。"
        }
      ]
    },
    {
      title: "名片識別與整合",
      questions: [
        {
          question: "Q10. 如何掃描紙本名片？",
          answer: "進入「名片識別」頁面拍照掃描，AI 會自動辨識內容。若與雲端資料相似度 ≥90%，系統會自動匹配更新，並儲存到「我的名片夾」。"
        },
        {
          question: "Q11. 匯入大量名片資料時有什麼限制？",
          answer: "AiCard 支援 CSV/XLS/XLSX 批次匯入，首次匯入會啟動欄位對應導引，並提供標準格式範本下載，確保資料正確匯入。"
        }
      ]
    },
    {
      title: "行程與互動",
      questions: [
        {
          question: "Q12. 行程管理功能有哪些？",
          answer: "行程管理包含提醒、快速新增、行程日曆檢視及郵件通知，並支援語音或手動輸入，讓您快速安排會議或拜訪行程。"
        },
        {
          question: "Q13. 如何將行程與聯絡人連結？",
          answer: "在新增行程時，選擇參與者即可自動帶出該聯絡人的電子名片，並記錄互動歷程。"
        },
        {
          question: "Q14. AiCard 會自動提供行程建議嗎？",
          answer: "會的。系統會根據您的互動記錄與行程歷史，提供標題、參與者與時間的智能建議。"
        }
      ]
    },
    {
      title: "會員點數與升級",
      questions: [
        {
          question: "Q15. 如何累積點數？",
          answer: "完成註冊、交換名片、邀請好友等行為可獲得點數，點數可用於升級方案或兌換 Ai 生態圈服務。"
        },
        {
          question: "Q16. 點數可以兌換哪些服務？",
          answer: "點數可兌換 AiCard PRO 商務名片試用、Aile 商務版、Aile PRO 企業版試用，以及 Aiwow 點數商城的優惠活動。"
        },
        {
          question: "Q17. 如何查看點數使用紀錄？",
          answer: "進入「設定 > 會員點數」，可查看總覽、升級方案與累積使用紀錄，並支援歷程統計圖表。"
        }
      ]
    },
    {
      title: "資料安全與隱私",
      questions: [
        {
          question: "Q18. AiCard 如何保障我的資料安全？",
          answer: "所有資料均加密儲存，手機號碼採 OTP 驗證，Email 採雙重驗證 (Double Opt-In)，確保安全與隱私。"
        },
        {
          question: "Q19. 是否可以關閉我的名片公開狀態？",
          answer: "可以，於「設定 > 隱私與通知」內關閉公開選項，即可隱藏您的電子名片資訊，僅保留基本聯絡功能。"
        },
        {
          question: "Q20. 如果不想被其他用戶直接加入名片夾，該怎麼設置？",
          answer: "在「隱私與通知」中關閉「允許直接加入」，他人需經您同意才能完成加入請求。"
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* App Download Section - Top Priority */}
      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4 shadow-md">
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-500/20 px-3 py-1 rounded-full mb-3">
              <Smartphone className="w-4 h-4 text-blue-700 mr-1" />
              <span className="text-xs font-medium text-blue-700">完整功能體驗</span>
            </div>
            
            <h3 className="text-lg font-bold text-blue-800 mb-1">下載 AiCard APP</h3>
            <p className="text-blue-700 text-xs mb-4">
              享受數據分析、行程管理等進階功能
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-gray-800/90 hover:bg-gray-800 text-white font-medium py-2 px-3 rounded-xl shadow-md backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-left">
                  <div className="text-xs font-semibold">App Store</div>
                </div>
              </Button>
              <Button className="bg-green-600/90 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-xl shadow-md backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-left">
                  <div className="text-xs font-semibold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

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
        {/* FAQ Accordion */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {faqCategories.map((category, categoryIndex) => (
              <AccordionItem 
                key={categoryIndex} 
                value={`category-${categoryIndex}`}
                className="bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="font-medium text-gray-800 text-left">{category.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 pt-2">
                    {category.questions.map((item, questionIndex) => (
                      <div key={questionIndex} className="border-l-2 border-teal-100 pl-4">
                        <h4 className="font-medium text-gray-800 mb-2">{item.question}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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