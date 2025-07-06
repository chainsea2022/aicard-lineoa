
import { Customer } from './types';
import { getRandomProfessionalAvatar } from './utils';

export const generateMockCustomers = (): Customer[] => {
  const names = ['王小明', '李雅婷', '張志豪', '陳美玲', '林俊傑', '黃淑芬', '吳承恩', '劉德華', '蔡依林', '周杰倫'];
  const companies = ['台積電', 'ASUS', '聯發科', '富邦金控', '中華電信', '統一企業', '鴻海精密', '台灣大哥大', '玉山銀行', '中鋼集團'];
  const jobTitles = ['軟體工程師', '產品經理', '業務主管', '設計師', '行銷專員', '財務分析師', '專案經理', '人資主管', '營運總監', '技術長'];
  const tags = [['VIP客戶'], ['潛在客戶'], ['合作夥伴'], ['同事'], ['朋友'], ['客戶'], ['供應商'], ['投資人'], ['顧問'], ['媒體']];

  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    email: `${names[i % names.length].toLowerCase()}@${companies[i % companies.length].toLowerCase()}.com`,
    company: companies[i % companies.length],
    jobTitle: jobTitles[i % jobTitles.length],
    photo: getRandomProfessionalAvatar(i + 1),
    hasCard: Math.random() > 0.3,
    addedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: `透過${i % 2 === 0 ? '展會' : '朋友介紹'}認識`,
    tags: tags[i % tags.length],
    relationshipStatus: Math.random() > 0.5 ? 'collected' : 'addedMe',
    isDigitalCard: i < 15, // 前15個是電子名片，後5個是聯絡人
    isFavorite: Math.random() > 0.7,
    isFollowingMe: Math.random() > 0.6,
    invitationSent: Math.random() > 0.7,
    emailInvitationSent: Math.random() > 0.8,
    invitationDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    emailInvitationDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined
  }));
};
