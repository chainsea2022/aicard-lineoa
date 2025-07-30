import React from 'react';
import { Users, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventTypeSelectorProps {
  selectedType: 'meeting' | 'call' | 'email';
  onTypeChange: (type: 'meeting' | 'call' | 'email') => void;
}

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  const eventTypes = [
    {
      type: 'meeting' as const,
      label: '會議',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: '面對面或線上會議'
    },
    {
      type: 'call' as const,
      label: '通話',
      icon: Phone,
      color: 'bg-green-500 hover:bg-green-600',
      description: '電話會議或通話'
    },
    {
      type: 'email' as const,
      label: '信件',
      icon: Mail,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: '電子郵件溝通'
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">活動類型</h3>
      <div className="grid grid-cols-3 gap-2">
        {eventTypes.map((eventType) => {
          const Icon = eventType.icon;
          const isSelected = selectedType === eventType.type;
          
          return (
            <Button
              key={eventType.type}
              onClick={() => onTypeChange(eventType.type)}
              variant={isSelected ? "default" : "outline"}
              className={`h-16 flex flex-col items-center justify-center space-y-1 text-xs ${
                isSelected 
                  ? eventType.color + ' text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{eventType.label}</span>
            </Button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        {eventTypes.find(t => t.type === selectedType)?.description}
      </div>
    </div>
  );
};

export default EventTypeSelector;