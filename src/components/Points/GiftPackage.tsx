import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GiftPackage: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-br from-orange-100 to-pink-100 border-2 border-orange-300 rounded-xl shadow-lg">
      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <Gift className="w-6 h-6 text-orange-600 mr-2" />
          <h3 className="font-bold text-xl text-orange-800">專屬大禮</h3>
          <div className="ml-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            限時
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <h4 className="font-bold text-lg text-orange-700 mb-2">超值群募解鎖包</h4>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-orange-600">$7,200</span>
            <span className="text-lg text-orange-600">/年</span>
          </div>
          <p className="text-orange-600 text-sm mb-3">🎉 一年不限次數全功能解鎖 🎉</p>
          
          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2">
            立即搶購
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftPackage;