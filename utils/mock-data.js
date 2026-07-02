const seedState = {
  version: 2,  currentUser: {
    userId: 'u-001',
    nickName: '小王',
    avatar: '../../assets/avatars/avatar-1.png',
    school: '武汉理工大学',
    grade: '2023级',
    creditScore: 95,
    exchangeCount: 12,
    publishCount: 3,
    proposalCount: 4,
    wishCount: 2,
    chainCount: 0,
    storyLikes: 0,
    level: 'Lv3',
    verified: true,
    brainPower: 999,
    energy: 260,
    badges: ['新手换物家', '绿色校园行动者', '脑洞提案大师'],
    title: '脑洞换物家',
  },
  posts: [
    {
      postId: 'p-001',
      userId: 'u-002',
      title: '九成新计算器，换点有趣的东西',
      haveItem: '计算器',
      wantItem: '开放脑洞',
      story: '考试结束再也不用了，想换点更有意思的东西。',
      images: ['../../assets/mock-posts/post-calculator.png'],
      proposalCount: 12,
      likeCount: 26,
      status: 'open',
      createdAt: '2026-06-14',
      school: '武汉理工大学',
      creditScore: 95,
      verified: true,
      avatar: '../../assets/avatars/avatar-2.png',
      nickName: '小李',
      estimatedValue: 45,
      rarity: 'S级考试周刚需',
      brainScore: 92,
      matchScore: 94,
      chainReady: true,
      tags: ['学习刚需', '考试周', 'AI推荐'],
    },
    {
      postId: 'p-002',
      userId: 'u-003',
      title: '保温杯换一张电影票',
      haveItem: '保温杯',
      wantItem: '电影票',
      story: '宿舍里还有一个，想换点能立刻用上的东西。',
      images: ['../../assets/mock-posts/post-cup.png'],
      proposalCount: 8,
      likeCount: 19,
      status: 'open',
      createdAt: '2026-06-15',
      school: '武汉理工大学',
      creditScore: 92,
      verified: true,
      avatar: '../../assets/avatars/avatar-3.png',
      nickName: '小张',
      estimatedValue: 38,
      rarity: 'A级生活刚需',
      brainScore: 86,
      matchScore: 88,
      tags: ['生活用品', '即时快乐', '可换电影票'],
    },
    {
      postId: 'p-003',
      userId: 'u-004',
      title: '毕业季行李箱，换床上桌',
      haveItem: '行李箱',
      wantItem: '床上桌',
      story: '快毕业了，行李箱暂时用不上，想换宿舍实用品。',
      images: ['../../assets/mock-posts/post-suitcase.png'],
      proposalCount: 5,
      likeCount: 14,
      status: 'open',
      createdAt: '2026-06-13',
      school: '武汉理工大学',
      creditScore: 91,
      verified: true,
      avatar: '../../assets/avatars/avatar-4.png',
      nickName: '小陈',
      estimatedValue: 80,
      rarity: 'S级毕业季热门',
      brainScore: 90,
      matchScore: 91,
      tags: ['毕业季', '宿舍刚需', '大件交换'],
    },
    {
      postId: 'p-004',
      userId: 'u-005',
      title: '英语六级资料，换奶茶月卡',
      haveItem: '英语六级资料',
      wantItem: '奶茶月卡',
      story: '资料整理得很全，适合备考冲刺。',
      images: ['../../assets/mock-posts/post-books.png'],
      proposalCount: 15,
      likeCount: 31,
      status: 'open',
      createdAt: '2026-06-12',
      school: '武汉理工大学',
      creditScore: 97,
      verified: true,
      avatar: '../../assets/avatars/avatar-5.png',
      nickName: '小钱',
      estimatedValue: 58,
      rarity: 'S级学习互助',
      brainScore: 95,
      matchScore: 96,
      chainReady: true,
      tags: ['学习资料', '六级冲刺', '奶茶换知识'],
    },
    {
      postId: 'p-005',
      userId: 'u-006',
      title: '手绘头像服务，换耳机',
      haveItem: '手绘头像服务',
      wantItem: '耳机',
      story: '可以帮你画头像、头像框和简单插画。',
      images: ['../../assets/mock-posts/post-art.png'],
      proposalCount: 9,
      likeCount: 22,
      status: 'open',
      createdAt: '2026-06-11',
      school: '武汉理工大学',
      creditScore: 94,
      verified: true,
      avatar: '../../assets/avatars/avatar-6.png',
      nickName: '小周',
      estimatedValue: 66,
      rarity: 'A级技能换物',
      brainScore: 91,
      matchScore: 89,
      tags: ['技能换物', '手绘头像', '创意交换'],
    },
  ],
  wishes: [
    { wishId: 'w-001', name: '计算器', category: '学习用品', count: 18, tag: '考试周刚需', trend: '↑ 32%', ownerId: 'system' },
    { wishId: 'w-002', name: '雨伞', category: '生活用品', count: 12, tag: '雨天急救', trend: '↑ 18%', ownerId: 'system' },
    { wishId: 'w-003', name: '行李箱', category: '毕业季', count: 9, tag: '毕业季热门', trend: '↑ 25%', ownerId: 'system' },
    { wishId: 'w-004', name: '考研资料', category: '学习用品', count: 15, tag: '学习互助', trend: '↑ 21%', ownerId: 'system' },
  ],
  chains: [
    {
      chainId: 'c-001',
      title: '考试周三人交换局',
      status: 'waiting',
      score: 94,
      rewardBrain: 80,
      rewardEnergy: 60,
      nodes: [
        { user: '小王', have: '计算器', want: '奶茶券' },
        { user: '小李', have: '奶茶券', want: '英语六级资料' },
        { user: '小钱', have: '英语六级资料', want: '计算器' },
      ],
      reason: '三人的需求形成闭环，不需要现金也能完成资源流转。',
    },
    {
      chainId: 'c-002',
      title: '毕业季宿舍清仓局',
      status: 'waiting',
      score: 89,
      rewardBrain: 60,
      rewardEnergy: 80,
      nodes: [
        { user: '小陈', have: '行李箱', want: '床上桌' },
        { user: '小赵', have: '床上桌', want: '收纳箱' },
        { user: '小孙', have: '收纳箱', want: '行李箱' },
      ],
      reason: '毕业季大件闲置更适合多人闭环，能减少搬运和浪费。',
    },
  ],
  safeSpots: [
    { id: 'spot-1', name: '图书馆门口', type: '学习用品交换点', latitude: 30.52731, longitude: 114.35412, desc: '人流稳定，适合教材、计算器、资料等学习用品面交。' },
    { id: 'spot-2', name: '南湖食堂门口', type: '生活用品交换点', latitude: 30.52591, longitude: 114.35245, desc: '靠近生活区，适合雨伞、水杯、奶茶券等轻量交换。' },
    { id: 'spot-3', name: '教学楼大厅', type: '公共安全交易点', latitude: 30.52662, longitude: 114.35602, desc: '公共空间，适合第一次交换或高信用分用户验货。' },
  ],
  activityCards: [
    { id: 'a-001', title: '考试周学霸补给', desc: '计算器、六级资料、台灯优先推荐，完成学习用品交换可得双倍脑洞值。', tag: '限时活动' },
    { id: 'a-002', title: '毕业季清仓局', desc: '发布行李箱、收纳箱、纸箱等毕业季物品，更容易进入多边交换挑战。', tag: '毕业季' },
  ],
  tasks: [],
  stories: [
    { storyId: 's-1', type: 'crazy', title: '本周最离谱交换', beforeItem: '本田汽车', afterItem: '特朗普AI合照', likeCount: 1220, liked: false },
    { storyId: 's-2', type: 'profit', title: '本周最赚交换', beforeItem: '计算器', afterItem: '一个月早餐', likeCount: 851, liked: false },
    { storyId: 's-3', type: 'warm', title: '本周最暖交换', beforeItem: '床上桌', afterItem: '一份考研笔记', likeCount: 706, liked: false },
    { storyId: 's-4', type: 'smart', title: '本周最懂交换', beforeItem: '保温杯', afterItem: '电影票', likeCount: 644, liked: false },
  ],
  proposalsByPost: {
    'p-001': [
      { proposalId: 'pr-001', postId: 'p-001', fromUserId: 'u-101', proposerName: '小李', school: '武汉理工大学', offerItem: '奶茶券', description: '我愿意拿两张奶茶券和你交换，也可以加一包小零食。', images: ['../../assets/mock-posts/proposal-milktea.png'], status: 'pending', creditScore: 96, funScore: 88 },
      { proposalId: 'pr-002', postId: 'p-001', fromUserId: 'u-102', proposerName: '小张', school: '武汉理工大学', offerItem: '早餐券', description: '我可以拿一周早餐券换你的计算器。', images: ['../../assets/mock-posts/proposal-breakfast.png'], status: 'pending', creditScore: 93, funScore: 84 },
    ],
    'p-002': [
      { proposalId: 'pr-003', postId: 'p-002', fromUserId: 'u-103', proposerName: '小陈', school: '武汉理工大学', offerItem: '手账本', description: '我有一本很新的手账本，配色很好看。', images: ['../../assets/mock-posts/proposal-notebook.png'], status: 'pending', creditScore: 89, funScore: 81 },
    ],
  },
  rankList: {
    brain: [
      { nickName: '小王', school: '武汉理工大学', value: 999 },
      { nickName: '小李', school: '武汉理工大学', value: 856 },
      { nickName: '小张', school: '武汉理工大学', value: 801 },
    ],
    exchange: [
      { nickName: '小王', school: '武汉理工大学', value: 32 },
      { nickName: '小李', school: '武汉理工大学', value: 29 },
      { nickName: '小陈', school: '武汉理工大学', value: 27 },
    ],
    credit: [
      { nickName: '小赵', school: '武汉理工大学', value: 100 },
      { nickName: '小王', school: '武汉理工大学', value: 95 },
      { nickName: '小李', school: '武汉理工大学', value: 94 },
    ],
    energy: [
      { nickName: '小王', school: '武汉理工大学', value: 260 },
      { nickName: '小李', school: '武汉理工大学', value: 220 },
      { nickName: '小陈', school: '武汉理工大学', value: 188 },
    ],
  },
  messages: [
    { id: 'm-1', type: 'proposal', title: '收到新的提案', desc: '小李想用奶茶券交换你的计算器', time: '10:08' },
    { id: 'm-2', type: 'system', title: '提案被接受', desc: '你和小陈的交换已达成一致', time: '昨天' },
    { id: 'm-3', type: 'story', title: '故事上新', desc: '本周最离谱交换已更新', time: '昨天' },
  ],
};

const taskBlueprints = [
  { taskId: 't-publish', title: '发布第一张 AI 交换卡', desc: '发起 1 次交换，体验 AI 生成标题、估值和标签。', target: 1, metric: 'publishCount', rewardBrain: 20, rewardEnergy: 10, badge: 'AI交换卡收藏家' },
  { taskId: 't-proposal', title: '脑洞提案大师', desc: '向 3 个交换发起脑洞提案。', target: 3, metric: 'proposalCount', rewardBrain: 80, rewardEnergy: 20, badge: '脑洞提案大师' },
  { taskId: 't-exchange', title: '完成第一次交换', desc: '接受或达成 1 次交换，让闲置真正流动起来。', target: 1, metric: 'exchangeCount', rewardBrain: 60, rewardEnergy: 60, badge: '新手换物家' },
  { taskId: 't-wish', title: '点亮校园心愿池', desc: '投递 2 个心愿，让系统发现校园真实需求。', target: 2, metric: 'wishCount', rewardBrain: 40, rewardEnergy: 10, badge: '心愿收集员' },
  { taskId: 't-chain', title: '开启多边交换挑战', desc: '参与 1 次交换挑战局，完成多人交换闭环。', target: 1, metric: 'chainCount', rewardBrain: 90, rewardEnergy: 80, badge: '交换链大师' },
  { taskId: 't-story', title: '故事广场点赞官', desc: '给 3 个交换故事点赞，发现校园里的神奇交换。', target: 3, metric: 'storyLikes', rewardBrain: 30, rewardEnergy: 10, badge: '故事发现官' },
];

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

function createPostId(state) {
  const count = state.posts.length + 1;
  return `p-${String(count).padStart(3, '0')}`;
}

function createProposalId(state) {
  let max = 0;
  Object.values(state.proposalsByPost || {}).forEach((items) => {
    items.forEach((item) => {
      const n = Number(String(item.proposalId).split('-')[1]) || 0;
      if (n > max) max = n;
    });
  });
  return `pr-${String(max + 1).padStart(3, '0')}`;
}

function createWishId(state) {
  const count = (state.wishes || []).length + 1;
  return `w-${String(count).padStart(3, '0')}`;
}

function createMessageId() {
  return `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function defaultTags(post) {
  const have = post.haveItem || '';
  const want = post.wantItem || '';
  const tags = [];
  if (/计算器|资料|教材|笔记|六级|考研|台灯/.test(have + want)) tags.push('学习刚需');
  if (/奶茶|电影|早餐|券|咖啡/.test(have + want)) tags.push('即时快乐');
  if (/行李箱|收纳|床上桌|宿舍|风扇/.test(have + want)) tags.push('宿舍好物');
  if (/手绘|服务|技能|头像|摄影|修图/.test(have + want)) tags.push('技能换物');
  if (/伞|杯|雨衣|鞋套/.test(have + want)) tags.push('生活小物');
  tags.push('AI推荐');
  return Array.from(new Set(tags)).slice(0, 4);
}

function generateSwapCard(form) {
  const haveItem = form.haveItem || '神秘闲置';
  const wantItem = form.wantItem || '开放脑洞';
  const text = `${haveItem}${wantItem}${form.story || ''}`;
  const tags = defaultTags({ haveItem, wantItem });
  const baseValue = 18 + Math.min(haveItem.length * 5 + wantItem.length * 3, 72);
  const novelty = /服务|手绘|技能|故事|随机|开放|脑洞/.test(text) ? 12 : 0;
  const urgency = /计算器|雨伞|资料|行李箱|考试|毕业/.test(text) ? 10 : 0;
  const brainScore = Math.min(99, 68 + tags.length * 4 + novelty + urgency + (form.acceptBrain ? 6 : 0));
  const rarity = brainScore >= 94 ? 'SS级神奇交换' : brainScore >= 88 ? 'S级校园刚需' : brainScore >= 80 ? 'A级好换' : 'B级可探索';
  const alternatives = [];
  if (/计算器|资料|教材|笔记/.test(wantItem + haveItem)) alternatives.push('考研资料', '台灯', '打印券');
  if (/奶茶|电影|早餐|券/.test(wantItem + haveItem)) alternatives.push('咖啡券', '早餐券', '电影票');
  if (/宿舍|行李箱|收纳|床上桌/.test(wantItem + haveItem)) alternatives.push('收纳箱', '小风扇', '插排');
  if (!alternatives.length) alternatives.push('奶茶券', '学习资料', '宿舍小物');
  return {
    title: `${haveItem}，想换${wantItem}`,
    estimatedValue: baseValue,
    rarity,
    brainScore,
    matchScore: Math.min(98, brainScore - 2 + Math.floor(Math.random() * 5)),
    tags,
    alternatives: Array.from(new Set(alternatives)).slice(0, 3),
    reason: `校换小管家判断：${haveItem}适合交换${wantItem}，也可以接受价值接近、使用场景相近或更有故事感的脑洞提案。`,
    quest: brainScore >= 88 ? '建议加入本周挑战局，获得更高曝光。' : '建议补充故事和图片，提高提案率。',
  };
}

function addBadge(user, badge) {
  if (!badge) return;
  if (!Array.isArray(user.badges)) user.badges = [];
  if (!user.badges.includes(badge)) user.badges.push(badge);
}

function upsertRank(list, user, value) {
  const next = Array.isArray(list) ? cloneDeep(list) : [];
  const index = next.findIndex((item) => item.nickName === user.nickName && item.school === user.school);
  const row = { nickName: user.nickName, school: user.school, value };
  if (index >= 0) next[index] = row;
  else next.push(row);
  return next.sort((a, b) => Number(b.value || 0) - Number(a.value || 0)).slice(0, 10);
}

function updateRankList(state) {
  if (!state || !state.currentUser) return state;
  const user = state.currentUser;
  state.rankList = state.rankList || {};
  state.rankList.brain = upsertRank(state.rankList.brain, user, user.brainPower || 0);
  state.rankList.exchange = upsertRank(state.rankList.exchange, user, user.exchangeCount || 0);
  state.rankList.credit = upsertRank(state.rankList.credit, user, user.creditScore || 0);
  state.rankList.energy = upsertRank(state.rankList.energy, user, user.energy || 0);
  return state;
}

function metricValue(state, metric) {
  const user = state.currentUser || {};
  if (metric === 'publishCount') return user.publishCount || state.posts.filter((p) => p.userId === user.userId).length || 0;
  if (metric === 'proposalCount') return user.proposalCount || 0;
  if (metric === 'exchangeCount') return user.exchangeCount || 0;
  if (metric === 'wishCount') return user.wishCount || (state.wishes || []).filter((w) => w.ownerId === user.userId).length || 0;
  if (metric === 'chainCount') return user.chainCount || 0;
  if (metric === 'storyLikes') return user.storyLikes || 0;
  return 0;
}

function refreshTasks(state) {
  const existing = {};
  (state.tasks || []).forEach((task) => { existing[task.taskId] = task; });
  state.tasks = taskBlueprints.map((bp) => {
    const old = existing[bp.taskId] || {};
    const progress = Math.min(metricValue(state, bp.metric), bp.target);
    return {
      ...bp,
      progress,
      percent: Math.min(100, Math.floor((progress / bp.target) * 100)),
      claimed: Boolean(old.claimed),
      done: progress >= bp.target,
    };
  });
  return state.tasks;
}

function claimTaskReward(state, taskId) {
  refreshTasks(state);
  const task = state.tasks.find((item) => item.taskId === taskId);
  if (!task || !task.done || task.claimed) return { ok: false, message: '任务尚未完成或已领取' };
  task.claimed = true;
  const user = state.currentUser;
  user.brainPower = (user.brainPower || 0) + (task.rewardBrain || 0);
  user.energy = (user.energy || 0) + (task.rewardEnergy || 0);
  addBadge(user, task.badge);
  state.messages.unshift({
    id: createMessageId(),
    type: 'task',
    title: '任务奖励已领取',
    desc: `${task.title} 完成，获得 +${task.rewardBrain} 脑洞值、+${task.rewardEnergy} 闲置能量和「${task.badge}」徽章`,
    time: '刚刚',
  });
  updateRankList(state);
  return { ok: true, task };
}

function ensureStateDefaults(rawState) {
  const state = rawState || cloneDeep(seedState);
  const defaults = cloneDeep(seedState);
  state.currentUser = { ...defaults.currentUser, ...(state.currentUser || {}) };
  const user = state.currentUser;
  if (typeof user.energy !== 'number') user.energy = 0;
  if (!Array.isArray(user.badges)) user.badges = ['新手换物家'];
  if (typeof user.brainPower !== 'number') user.brainPower = 0;
  if (typeof user.exchangeCount !== 'number') user.exchangeCount = 0;
  if (typeof user.publishCount !== 'number') user.publishCount = 0;
  if (typeof user.proposalCount !== 'number') user.proposalCount = 0;
  if (typeof user.wishCount !== 'number') user.wishCount = 0;
  if (typeof user.chainCount !== 'number') user.chainCount = 0;
  if (typeof user.storyLikes !== 'number') user.storyLikes = 0;
  if (!user.level) user.level = 'Lv1';
  if (!user.title) user.title = '校园换物家';

  state.posts = Array.isArray(state.posts) ? state.posts : cloneDeep(defaults.posts);
  state.posts = state.posts.map((post, index) => ({
    proposalCount: 0,
    likeCount: 0,
    status: 'open',
    createdAt: '刚刚',
    school: user.school,
    creditScore: user.creditScore,
    verified: Boolean(user.verified),
    avatar: user.avatar,
    nickName: user.nickName,
    estimatedValue: 25 + index * 5,
    rarity: index % 2 === 0 ? 'A级好换' : 'S级刚需',
    brainScore: 80 + (index % 15),
    matchScore: 80 + (index % 14),
    tags: defaultTags(post),
    ...post,
  }));

  ['wishes', 'chains', 'safeSpots', 'activityCards', 'stories', 'messages'].forEach((key) => {
    state[key] = Array.isArray(state[key]) ? state[key] : cloneDeep(defaults[key]);
  });
  state.chains = state.chains.map((chain) => ({
    ...chain,
    routeText: (chain.nodes || []).map((node) => `${node.user}的${node.have}`).join(' → '),
  }));
  state.proposalsByPost = state.proposalsByPost || cloneDeep(defaults.proposalsByPost);
  Object.keys(state.proposalsByPost).forEach((postId) => {
    state.proposalsByPost[postId] = (state.proposalsByPost[postId] || []).map((proposal) => ({
      status: 'pending',
      funScore: 80,
      ...proposal,
    }));
  });

  state.rankList = state.rankList || cloneDeep(defaults.rankList);
  state.rankList.brain = Array.isArray(state.rankList.brain) ? state.rankList.brain : [];
  state.rankList.exchange = Array.isArray(state.rankList.exchange) ? state.rankList.exchange : [];
  state.rankList.credit = Array.isArray(state.rankList.credit) ? state.rankList.credit : [];
  state.rankList.energy = Array.isArray(state.rankList.energy) ? state.rankList.energy : [];
  refreshTasks(state);
  updateRankList(state);
  return state;
}

module.exports = {
  seedState,
  cloneDeep,
  createPostId,
  createProposalId,
  createWishId,
  createMessageId,
  ensureStateDefaults,
  updateRankList,
  refreshTasks,
  claimTaskReward,
  generateSwapCard,
  addBadge,
};
