
export const getRandomProfessionalAvatar = (id: number): string => {
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616c0763995?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
  ];
  return avatars[id % avatars.length];
};

export const getRelationshipStatusDisplay = (status?: 'collected' | 'addedMe' | 'ignored' | 'archived') => {
  switch (status) {
    case 'collected':
      return { text: '已收藏', color: 'text-green-600' };
    case 'addedMe':
      return { text: '加我名片', color: 'text-blue-600' };
    case 'ignored':
      return { text: '已忽略', color: 'text-gray-500' };
    case 'archived':
      return { text: '已封存', color: 'text-orange-600' };
    default:
      return { text: '未知', color: 'text-gray-400' };
  }
};
