import React from 'react';
import MultiCardManager from '@/components/MultiCardManager';

const MultiCardManagerPage = () => {
  const handleClose = () => {
    // 在LIFF環境中關閉視窗回到聊天室
    if (window.liff) {
      window.liff.closeWindow();
    } else {
      // 開發環境或非LIFF環境時的處理
      window.history.back();
    }
  };

  return <MultiCardManager onClose={handleClose} />;
};

export default MultiCardManagerPage;