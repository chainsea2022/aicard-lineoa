
import React from 'react';
import ChatRoom from '@/components/ChatRoom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0">
      <div className="w-full h-screen flex items-center justify-center" style={{ maxWidth: '375px' }}>
        <ChatRoom />
      </div>
    </div>
  );
};

export default Index;
