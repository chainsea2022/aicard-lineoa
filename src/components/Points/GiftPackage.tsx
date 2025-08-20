import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GiftPackage: React.FC = () => {
  return (
    <div className="mb-6 mx-4 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
      <div className="text-center">
        <div className="inline-flex items-center bg-orange-100 px-3 py-1 rounded-full mb-4">
          <Gift className="w-4 h-4 text-orange-600 mr-1" />
          <span className="text-sm font-medium text-orange-800">限時優惠</span>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-lg text-gray-900 mb-2">超值群募解鎖包</h4>
          <div className="flex items-baseline justify-center space-x-2 mb-2">
            <span className="text-3xl font-bold text-orange-600">$7,200</span>
            <span className="text-gray-500">/年</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">一年不限次數全功能解鎖</p>
          
          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 rounded-xl shadow-sm">
            立即搶購
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftPackage;