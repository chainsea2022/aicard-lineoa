
import { Customer } from './types';

export const professionalAvatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face'
];

export const getRandomProfessionalAvatar = (customerId: number) => {
  return professionalAvatars[customerId % professionalAvatars.length];
};

export const getDefaultCustomers = (): Customer[] => [
  {
    id: 1001,
    name: '王小明',
    phone: '0912-345-678',
    email: 'wang@example.com',
    company: '科技創新公司',
    jobTitle: '產品經理',
    line: 'wang_xiaoming',
    hasCard: true,
    addedDate: new Date().toISOString(),
    notes: '已掃描加入的電子名片',
    relationshipStatus: 'collected' as const,
    isMyFriend: true,
    isFollowingMe: false,
    tags: ['工作', '朋友']
  },
  {
    id: 1002,
    name: '李雅婷',
    phone: '0923-456-789',
    email: 'li@example.com',
    company: '設計工作室',
    jobTitle: '創意總監',
    line: 'li_yating',
    hasCard: true,
    addedDate: new Date().toISOString(),
    notes: '設計合作夥伴',
    relationshipStatus: 'collected' as const,
    isMyFriend: true,
    isFollowingMe: false,
    tags: ['工作']
  },
  {
    id: 1003,
    name: '張志豪',
    phone: '0934-567-890',
    email: 'zhang@example.com',
    company: '行銷顧問公司',
    jobTitle: '行銷總監',
    line: 'zhang_zhihao',
    hasCard: true,
    addedDate: new Date().toISOString(),
    notes: '行銷合作夥伴',
    relationshipStatus: 'collected' as const,
    isMyFriend: true,
    isFollowingMe: false,
    isFavorite: true,
    tags: ['合作夥伴']
  },
  {
    id: 1004,
    name: '陳建志',
    phone: '0945-678-901',
    email: 'chen@example.com',
    company: '軟體開發公司',
    jobTitle: '技術總監',
    line: 'chen_jianzhi',
    hasCard: true,
    addedDate: new Date().toISOString(),
    notes: '已掃描加入的技術顧問',
    relationshipStatus: 'collected' as const,
    isMyFriend: true,
    isFollowingMe: false,
    tags: ['客戶']
  },
  {
    id: 1005,
    name: '林美慧',
    phone: '0956-789-012',
    email: 'lin@example.com',
    company: '財務顧問公司',
    jobTitle: '財務顧問',
    line: 'lin_meihui',
    hasCard: true,
    addedDate: new Date().toISOString(),
    notes: '已收藏的聯絡人',
    relationshipStatus: 'collected' as const,
    isMyFriend: true,
    isFollowingMe: false,
    tags: ['潛在客戶']
  },
  {
    id: 2001,
    name: '吳雅芳',
    phone: '0978-901-234',
    email: 'wu@example.com',
    company: '廣告公司',
    jobTitle: '創意總監',
    line: 'wu_yafang',
    hasCard: true,
    addedDate: new Date(Date.now() - 3600000).toISOString(),
    notes: '對方已加我，等待我回應',
    relationshipStatus: 'addedMe' as const,
    isMyFriend: false,
    isFollowingMe: true,
    hasPendingInvitation: true,
    isNewAddition: true,
    tags: ['合作夥伴']
  },
  {
    id: 2002,
    name: '劉志明',
    phone: '0989-012-345',
    email: 'liu@example.com',
    company: '科技新創',
    jobTitle: '執行長',
    line: 'liu_zhiming',
    hasCard: true,
    addedDate: new Date(Date.now() - 7200000).toISOString(),
    notes: '新創公司執行長',
    relationshipStatus: 'addedMe' as const,
    isMyFriend: false,
    isFollowingMe: true,
    hasPendingInvitation: true,
    isNewAddition: true,
    tags: ['潛在客戶']
  },
  {
    id: 2003,
    name: '許文華',
    phone: '0990-123-456',
    email: 'xu@example.com',
    company: '媒體公司',
    jobTitle: '記者',
    line: 'xu_wenhua',
    hasCard: true,
    addedDate: new Date(Date.now() - 10800000).toISOString(),
    notes: '媒體記者聯絡人',
    relationshipStatus: 'addedMe' as const,
    isMyFriend: false,
    isFollowingMe: true,
    hasPendingInvitation: true,
    isNewAddition: true,
    isFavorite: true,
    tags: ['媒體']
  },
  {
    id: 2004,
    name: '黃志成',
    phone: '0901-234-567',
    email: 'huang@example.com',
    company: '建築事務所',
    jobTitle: '建築師',
    line: 'huang_zhicheng',
    hasCard: true,
    addedDate: new Date(Date.now() - 14400000).toISOString(),
    notes: '建築專案合作',
    relationshipStatus: 'addedMe' as const,
    isMyFriend: false,
    isFollowingMe: true,
    hasPendingInvitation: true,
    isNewAddition: false,
    tags: ['工作']
  },
  {
    id: 2005,
    name: '蔡雅玲',
    phone: '0912-345-678',
    email: 'cai@example.com',
    company: '行銷公司',
    jobTitle: '行銷經理',
    line: 'cai_yaling',
    hasCard: true,
    addedDate: new Date(Date.now() - 18000000).toISOString(),
    notes: '行銷活動合作',
    relationshipStatus: 'addedMe' as const,
    isMyFriend: false,
    isFollowingMe: true,
    hasPendingInvitation: true,
    isNewAddition: false,
    tags: ['行銷']
  }
].map(customer => ({
  ...customer,
  tags: customer.tags || []
}));

export const getRelationshipStatusDisplay = (status?: 'collected' | 'addedMe') => {
  switch (status) {
    case 'collected':
      return { text: '+ 已收藏', className: 'text-blue-600 bg-blue-50' };
    case 'addedMe':
      return { text: '⚠️ 被加入', className: 'text-orange-600 bg-orange-50' };
    default:
      return { text: '+ 已收藏', className: 'text-blue-600 bg-blue-50' };
  }
};
