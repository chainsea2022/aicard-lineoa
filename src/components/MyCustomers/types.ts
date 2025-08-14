
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  photo?: string;
  hasCard: boolean;
  addedDate: string;
  notes: string;
  isInvited?: boolean;
  invitationSent?: boolean;
  emailInvitationSent?: boolean;
  invitationDate?: string;
  emailInvitationDate?: string;
  tags?: string[];
  isFavorite?: boolean;
  isMyFriend?: boolean;
  isFollowingMe?: boolean;
  hasPendingInvitation?: boolean;
  relationshipStatus?: 'collected' | 'addedMe' | 'ignored' | 'archived';
  isNewAddition?: boolean;
  isPublicProfile?: boolean;
  allowDirectContact?: boolean;
  isDigitalCard?: boolean; // true for digital cards, false for paper cards
  isRegisteredUser?: boolean; // true for registered digital card users, false for unregistered
  lineId?: string; // for unregistered users who only have LINE ID
  isRecommendation?: boolean; // true for smart recommendations
}

export type CustomerRelationshipStatus = 'collected' | 'addedMe' | 'ignored' | 'archived';

export interface RecommendedContact {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  photo: string;
  mutualFriends: string[];
  reason: string;
  isPublicProfile?: boolean;
  allowDirectContact?: boolean;
}

export interface InvitationRecord {
  type: 'sms' | 'email';
  date: string;
  status: 'sent' | 'joined';
}

export interface ScheduleRecord {
  id: number;
  customerId: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'meeting' | 'call' | 'event' | 'other';
  createdAt: string;
}

export interface MyCustomersProps {
  onClose: () => void;
  customers: any[];
  onCustomersUpdate: (customers: any[]) => void;
}
