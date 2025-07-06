import { Customer } from './types';

export const getRandomProfessionalAvatar = (id: number): string => {
  const avatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  ];
  return avatars[id % avatars.length];
};

export const professionalAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b1b4?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
];

export const getRelationshipStatusDisplay = (status?: 'collected' | 'addedMe'): string => {
  switch (status) {
    case 'collected':
      return '已收藏';
    case 'addedMe':
      return '追蹤我';
    default:
      return '一般聯絡人';
  }
};

export const getDefaultCustomers = (): Customer[] => {
  const baseDate = new Date();
  
  return [
    // 已收藏的名片 (5筆)
    {
      id: 1,
      name: '王小明',
      phone: '0912-345-678',
      email: 'wang.xiaoming@example.com',
      company: '台北科技公司',
      jobTitle: '軟體工程師',
      photo: getRandomProfessionalAvatar(1),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '在技術研討會認識的朋友',
      tags: ['工作', '朋友'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: true
    },
    {
      id: 2,
      name: '李大華',
      phone: '0987-654-321',
      email: 'li.dahua@example.com',
      company: '創新設計工作室',
      jobTitle: '設計總監',
      photo: getRandomProfessionalAvatar(2),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '合作過的設計師夥伴',
      tags: ['工作', '合作夥伴'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 3,
      name: '陳美玲',
      phone: '0956-789-123',
      email: 'chen.meiling@example.com',
      company: '國際行銷公司',
      jobTitle: '行銷經理',
      photo: getRandomProfessionalAvatar(3),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '商業聚會認識的行銷專家',
      tags: ['工作', '客戶'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: true
    },
    {
      id: 4,
      name: '張志強',
      phone: '0923-456-789',
      email: 'zhang.zhiqiang@example.com',
      company: '金融投資顧問',
      jobTitle: '投資顧問',
      photo: getRandomProfessionalAvatar(4),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '理財講座認識的專業顧問',
      tags: ['工作', '潛在客戶'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 5,
      name: '劉淑芬',
      phone: '0945-123-456',
      email: 'liu.shufen@example.com',
      company: '健康生活企業',
      jobTitle: '營養師',
      photo: getRandomProfessionalAvatar(5),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '健康講座認識的營養專家',
      tags: ['朋友', '客戶'],
      relationshipStatus: 'collected',
      isMyFriend: true,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    },
    
    // 追蹤我的名片 (8筆 - 2筆新加入 + 6筆已存在)
    {
      id: 6,
      name: '黃建國',
      phone: '0913-567-890',
      email: 'huang.jianguo@example.com',
      company: '建築設計事務所',
      jobTitle: '建築師',
      photo: getRandomProfessionalAvatar(6),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 30 * 60 * 1000).toISOString(), // 30分鐘前
      notes: '剛掃描我的QR Code的新朋友',
      tags: ['工作'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: true,
      isFavorite: false
    },
    {
      id: 7,
      name: '吳雅婷',
      phone: '0967-234-567',
      email: 'wu.yating@example.com',
      company: '時尚品牌公司',
      jobTitle: '品牌經理',
      photo: getRandomProfessionalAvatar(7),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 45 * 60 * 1000).toISOString(), // 45分鐘前
      notes: '展覽會場認識的品牌專家',
      tags: ['工作'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: true,
      isFavorite: false
    },
    {
      id: 8,
      name: '林俊傑',
      phone: '0934-678-901',
      email: 'lin.junjie@example.com',
      company: '數位媒體公司',
      jobTitle: '創意總監',
      photo: getRandomProfessionalAvatar(8),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2小時前
      notes: '透過朋友介紹認識',
      tags: ['朋友'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 9,
      name: '鄭文雄',
      phone: '0921-345-678',
      email: 'zheng.wenxiong@example.com',
      company: '教育培訓機構',
      jobTitle: '講師',
      photo: getRandomProfessionalAvatar(1),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4小時前
      notes: '培訓課程的專業講師',
      tags: ['工作'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 10,
      name: '許美華',
      phone: '0958-789-012',
      email: 'xu.meihua@example.com',
      company: '法律事務所',
      jobTitle: '律師',
      photo: getRandomProfessionalAvatar(2),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6小時前
      notes: '法律諮詢服務的專業律師',
      tags: ['客戶'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 11,
      name: '蔡志明',
      phone: '0912-456-789',
      email: 'cai.zhiming@example.com',
      company: '科技新創公司',
      jobTitle: '產品經理',
      photo: getRandomProfessionalAvatar(3),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8小時前
      notes: '創業聚會認識的產品專家',
      tags: ['工作'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 12,
      name: '楊麗華',
      phone: '0976-123-456',
      email: 'yang.lihua@example.com',
      company: '醫療診所',
      jobTitle: '醫師',
      photo: getRandomProfessionalAvatar(4),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12小時前
      notes: '健康講座的專業醫師',
      tags: ['朋友'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 13,
      name: '何俊賢',
      phone: '0989-567-890',
      email: 'he.junxian@example.com',
      company: '餐飲連鎖企業',
      jobTitle: '營運經理',
      photo: getRandomProfessionalAvatar(5),
      hasCard: true,
      addedDate: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
      notes: '商業聚餐認識的餐飲專家',
      tags: ['客戶'],
      relationshipStatus: 'addedMe',
      isMyFriend: false,
      isFollowingMe: true,
      hasPendingInvitation: true,
      isNewAddition: false,
      isFavorite: false
    },
    
    // 一般聯絡人 (沒有電子名片) - 3筆
    {
      id: 14,
      name: '謝小玲',
      phone: '0932-678-901',
      email: 'xie.xiaoling@example.com',
      company: '傳統貿易公司',
      jobTitle: '業務員',
      hasCard: false,
      addedDate: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '透過紙本名片交換認識',
      tags: ['客戶'],
      relationshipStatus: 'collected',
      isMyFriend: false,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 15,
      name: '周大偉',
      phone: '0943-789-012',
      email: 'zhou.dawei@example.com',
      company: '保險公司',
      jobTitle: '保險業務',
      hasCard: false,
      addedDate: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '朋友介紹的保險專員',
      tags: ['朋友'],
      relationshipStatus: 'collected',
      isMyFriend: false,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    },
    {
      id: 16,
      name: '趙雅芳',
      phone: '0954-890-123',
      email: 'zhao.yafang@example.com',
      company: '美容工作室',
      jobTitle: '美容師',
      hasCard: false,
      addedDate: new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '美容護理的專業人員',
      tags: ['朋友'],
      relationshipStatus: 'collected',
      isMyFriend: false,
      isFollowingMe: false,
      hasPendingInvitation: false,
      isNewAddition: false,
      isFavorite: false
    }
  ];
};
