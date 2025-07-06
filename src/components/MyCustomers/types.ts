
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

export interface MyCustomersProps {
  onClose: () => void;
  customers: any[];
  onCustomersUpdate: (customers: any[]) => void;
}
