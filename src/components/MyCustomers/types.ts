
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
  tags?: string[];
  isFavorite?: boolean;
  isMyFriend?: boolean;
  isFollowingMe?: boolean;
  hasPendingInvitation?: boolean;
  relationshipStatus?: 'collected' | 'addedMe';
  isNewAddition?: boolean;
}

export interface RecommendedContact {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  photo: string;
  mutualFriends: string[];
  reason: string;
}

export interface MyCustomersProps {
  onClose: () => void;
  customers: any[];
  onCustomersUpdate: (customers: any[]) => void;
}
