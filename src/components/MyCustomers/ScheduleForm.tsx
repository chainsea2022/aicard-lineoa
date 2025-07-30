import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  X, 
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Customer } from './types';

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

interface ScheduleItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: string[];
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  isOpen,
  onClose,
  customer
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    attendees: [customer.name]
  });

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.time) {
      toast({
        title: "請填寫必要資訊",
        description: "標題、日期和時間為必填項目",
        className: "max-w-[280px] mx-auto"
      });
      return;
    }

    const newSchedule: ScheduleItem = {
      id: Date.now(),
      ...formData
    };

    // 儲存到本地存儲
    const existingSchedules = JSON.parse(localStorage.getItem('aile-schedules') || '[]');
    const updatedSchedules = [...existingSchedules, newSchedule];
    localStorage.setItem('aile-schedules', JSON.stringify(updatedSchedules));

    toast({
      title: "行程已新增",
      description: `已為 ${customer.name} 新增行程「${formData.title}」`,
      className: "max-w-[280px] mx-auto"
    });

    // 重置表單並關閉
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      attendees: [customer.name]
    });
    onClose();
  };

  const removeAttendee = (attendeeToRemove: string) => {
    if (attendeeToRemove === customer.name) return; // 不能移除主要聯絡人
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendeeToRemove)
    }));
  };

  const addAttendee = (attendee: string) => {
    if (attendee.trim() && !formData.attendees.includes(attendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendee.trim()]
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">新增行程</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 標題 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              行程標題 *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="輸入行程標題"
              className="text-sm"
            />
          </div>

          {/* 日期和時間 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                日期 *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                時間 *
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>

          {/* 地點 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              地點
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="輸入會面地點"
                className="pl-10 text-sm"
              />
            </div>
          </div>

          {/* 參與者 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              參與者
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.attendees.map((attendee, index) => (
                <Badge
                  key={index}
                  variant={attendee === customer.name ? "default" : "secondary"}
                  className="text-xs"
                >
                  <User className="w-3 h-3 mr-1" />
                  {attendee}
                  {attendee !== customer.name && (
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                      onClick={() => removeAttendee(attendee)}
                    />
                  )}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="添加其他參與者"
                className="text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addAttendee(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="添加其他參與者"]') as HTMLInputElement;
                  if (input) {
                    addAttendee(input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              行程描述
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="輸入行程詳細描述..."
              rows={3}
              className="text-sm"
            />
          </div>

          {/* 操作按鈕 */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              新增行程
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};