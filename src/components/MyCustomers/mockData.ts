
import { Customer } from './types';
import { getRandomProfessionalAvatar } from './utils';

export const generateMockCustomers = (): Customer[] => {
  // 已註冊電子名片用戶
  const registeredUsers: Customer[] = [
    {
      id: 1,
      name: '王小明',
      phone: '0912345678',
      email: 'wang.xiaoming@tsmc.com',
      company: '台積電',
      jobTitle: '軟體工程師',
      line: 'wang_xiaoming',
      website: 'https://www.linkedin.com/in/wangxiaoming',
      photo: getRandomProfessionalAvatar(1),
      hasCard: true,
      addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '透過展會認識',
      tags: ['VIP客戶'],
      relationshipStatus: 'collected',
      isDigitalCard: true,
      isRegisteredUser: true,
      isFavorite: true,
      isFollowingMe: false
    },
    {
      id: 2,
      name: '李雅婷',
      phone: '0923456789',
      email: 'li.yating@asus.com',
      company: 'ASUS',
      jobTitle: '產品經理',
      line: 'li_yating',
      photo: getRandomProfessionalAvatar(2),
      hasCard: true,
      addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '透過朋友介紹認識',
      tags: ['合作夥伴'],
      relationshipStatus: 'collected',
      isDigitalCard: true,
      isRegisteredUser: true,
      isFavorite: false,
      isFollowingMe: true
    },
    {
      id: 3,
      name: '張志豪',
      phone: '0934567890',
      email: 'zhang.zhihao@mediatek.com',
      company: '聯發科',
      jobTitle: '業務主管',
      line: 'zhang_zhihao',
      website: 'https://www.zhangzhihao.com',
      photo: getRandomProfessionalAvatar(3),
      hasCard: true,
      addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '業務洽談認識',
      tags: ['客戶'],
      relationshipStatus: 'addedMe',
      isDigitalCard: true,
      isRegisteredUser: true,
      isFavorite: false,
      isFollowingMe: true,
      isNewAddition: true
    }
  ];

  // 未註冊電子名片用戶（只有LINE ID）
  const unregisteredUsers: Customer[] = [
    {
      id: 4,
      name: 'chen_meiling_2024',
      phone: '',
      email: '',
      company: undefined,
      jobTitle: undefined,
      line: 'chen_meiling_2024',
      lineId: 'chen_meiling_2024',
      photo: 'https://ui-avatars.com/api/?name=L&background=00B900&color=ffffff&size=128&rounded=true',
      hasCard: true,
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '透過LINE群組認識',
      tags: ['潛在客戶'],
      relationshipStatus: 'collected',
      isDigitalCard: true,
      isRegisteredUser: false,
      isFavorite: false,
      isFollowingMe: false
    },
    {
      id: 5,
      name: 'business_lin2024',
      phone: '',
      email: '',
      company: undefined,
      jobTitle: undefined,
      line: 'business_lin2024',
      lineId: 'business_lin2024',
      photo: 'https://ui-avatars.com/api/?name=L&background=00B900&color=ffffff&size=128&rounded=true',
      hasCard: true,
      addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: '展會交換LINE',
      tags: ['同事'],
      relationshipStatus: 'collected',
      isDigitalCard: true,
      isRegisteredUser: false,
      isFavorite: true,
      isFollowingMe: false
    }
  ];

  // 紙本名片用戶（保持原有邏輯）
  const names = ['黃淑芬', '吳承恩', '劉德華', '蔡依林', '周杰倫'];
  const companies = ['富邦金控', '中華電信', '統一企業', '鴻海精密', '台灣大哥大'];
  const jobTitles = ['設計師', '行銷專員', '財務分析師', '專案經理', '人資主管'];
  const tags = [['朋友'], ['客戶'], ['供應商'], ['投資人'], ['顧問']];

  const paperCards: Customer[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 6,
    name: names[i % names.length],
    phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    email: `${names[i % names.length].toLowerCase()}@${companies[i % companies.length].toLowerCase()}.com`,
    company: companies[i % companies.length],
    jobTitle: jobTitles[i % jobTitles.length],
    photo: getRandomProfessionalAvatar(i + 6),
    hasCard: true,
    addedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: `透過${i % 2 === 0 ? '展會' : '朋友介紹'}認識`,
    tags: tags[i % tags.length],
    relationshipStatus: Math.random() > 0.5 ? 'collected' : 'addedMe',
    isDigitalCard: false,
    isRegisteredUser: undefined,
    isFavorite: Math.random() > 0.7,
    isFollowingMe: Math.random() > 0.6,
    invitationSent: Math.random() > 0.7,
    emailInvitationSent: Math.random() > 0.8,
    invitationDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    emailInvitationDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
  }));

  return [...registeredUsers, ...unregisteredUsers, ...paperCards];
};
