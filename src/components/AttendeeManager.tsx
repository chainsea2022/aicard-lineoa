import React, { useState } from 'react';
import { Users, X, Plus, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  relationship?: string;
  cardId?: string;
}

interface AttendeeManagerProps {
  attendees: Attendee[];
  onAttendeesChange: (attendees: Attendee[]) => void;
}

const AttendeeManager: React.FC<AttendeeManagerProps> = ({ attendees, onAttendeesChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  // Mock customer data - in real app this would come from MyCustomers
  const mockCustomers = [
    { id: '1', name: '張小明', email: 'zhang@example.com', phone: '0912345678', company: 'ABC公司' },
    { id: '2', name: '李小華', email: 'li@example.com', phone: '0987654321', company: 'XYZ企業' },
    { id: '3', name: '王大成', email: 'wang@example.com', phone: '0956789123', company: '123科技' }
  ];

  const addAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      const attendee: Attendee = {
        id: Date.now().toString(),
        ...newAttendee
      };
      onAttendeesChange([...attendees, attendee]);
      setNewAttendee({ name: '', email: '', phone: '', company: '' });
      setShowAddForm(false);
    }
  };

  const removeAttendee = (id: string) => {
    onAttendeesChange(attendees.filter(a => a.id !== id));
  };

  const addCustomerAsAttendee = (customer: any) => {
    const attendee: Attendee = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      cardId: customer.id,
      relationship: '客戶'
    };
    onAttendeesChange([...attendees, attendee]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          參與人員 ({attendees.length})
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Existing Attendees */}
      <div className="space-y-2">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-800">{attendee.name}</div>
              <div className="text-sm text-gray-600">{attendee.email}</div>
              {attendee.company && (
                <div className="text-xs text-gray-500">{attendee.company}</div>
              )}
            </div>
            <div className="flex space-x-1">
              {attendee.cardId && (
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Users className="w-3 h-3" />
                </Button>
              )}
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Mail className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600"
                onClick={() => removeAttendee(attendee.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Attendee Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h5 className="font-medium text-gray-800">新增參與者</h5>
          
          {/* Quick Add from Customers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              從客戶名單選擇
            </label>
            <div className="space-y-1">
              {mockCustomers.filter(c => !attendees.find(a => a.id === c.id)).map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => addCustomerAsAttendee(customer)}
                  className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded text-sm"
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-gray-600">{customer.company}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              或手動新增
            </label>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                placeholder="姓名"
                value={newAttendee.name}
                onChange={(e) => setNewAttendee(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="email"
                placeholder="電子郵件"
                value={newAttendee.email}
                onChange={(e) => setNewAttendee(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="電話 (選填)"
                value={newAttendee.phone}
                onChange={(e) => setNewAttendee(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                placeholder="公司 (選填)"
                value={newAttendee.company}
                onChange={(e) => setNewAttendee(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" onClick={addAttendee} disabled={!newAttendee.name || !newAttendee.email}>
                新增
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeManager;
